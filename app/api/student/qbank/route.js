import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!memoryStore.student_qbank_unlocks) memoryStore.student_qbank_unlocks = [];
    const userUnlocks = memoryStore.student_qbank_unlocks.filter((u) => u.student_id === session.id);
    const hasFullBundle = userUnlocks.some((u) => u.module_id === "bundle_all") || session.role === "admin";

    // Dynamic 3 Pillars from DB
    const specs = await db.getSpecializations();
    const allModules = await db.getQBankModules();

    const pillars = specs.map((spec) => {
      const specModules = allModules
        .filter((m) => m.specialization_id === spec.id)
        .map((mod) => ({
          id: mod.id,
          title: mod.name,
          category: spec.name,
          is_free: mod.is_free,
          price: mod.price || 0,
          question_count: mod.question_count || 0,
          is_unlocked: mod.is_free || hasFullBundle || userUnlocks.some((u) => u.module_id === mod.id),
          exam_focus: mod.description || "Board Review / Clinical Mastery"
        }));

      return {
        id: spec.id,
        code: spec.code,
        name: spec.name,
        icon: spec.icon,
        description: spec.description,
        modules: specModules
      };
    });

    const attempts = (memoryStore.test_attempts || []).filter((a) => a.student_id === session.id);
    const bookmarks = (memoryStore.bookmarks || []).filter((b) => b.student_id === session.id);

    return NextResponse.json({
      success: true,
      has_full_bundle: hasFullBundle,
      pillars,
      recent_attempts: attempts,
      bookmarks
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, module_id, payment_details } = body;

    if (!memoryStore.student_qbank_unlocks) memoryStore.student_qbank_unlocks = [];
    if (!memoryStore.payment_transactions) memoryStore.payment_transactions = [];

    // Unlock Module or Full Bundle
    if (action === "unlock_module" || action === "unlock_bundle") {
      const targetId = module_id || "bundle_all";
      const existing = memoryStore.student_qbank_unlocks.find(
        (u) => u.student_id === session.id && u.module_id === targetId
      );

      if (!existing) {
        memoryStore.student_qbank_unlocks.push({
          id: `unl_${Date.now()}`,
          student_id: session.id,
          module_id: targetId,
          unlocked_at: new Date().toISOString()
        });

        // Record payment transaction
        memoryStore.payment_transactions.push({
          id: `tx_qb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          student_id: session.id,
          student_name: session.name || "Enrolled Trainee",
          student_email: session.email,
          item_type: targetId === "bundle_all" ? "qbank_bundle" : "qbank_module",
          item_id: targetId,
          amount: targetId === "bundle_all" ? 99 : (payment_details?.amount || 29),
          payment_method: payment_details?.payment_method || "Credit Card (Verified Sandbox)",
          status: "succeeded",
          created_at: new Date().toISOString()
        });
      }

      return NextResponse.json({
        success: true,
        message: targetId === "bundle_all"
          ? "Full High-Yield Board QBank Unlocked! You now have lifetime access to all clinical modules."
          : "Question Module unlocked successfully! You can now practice in Tutor or Timed mode."
      });
    }

    if (action === "bookmark") {
      const { question_id, note } = body;
      const result = await db.toggleBookmark(session.id, question_id, note);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
