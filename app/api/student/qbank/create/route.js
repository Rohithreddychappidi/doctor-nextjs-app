import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isEnrolled = await db.isEnrolledIn(session.id, "qbank");
    if (!isEnrolled) {
      return NextResponse.json({ error: "Active QBank enrollment required" }, { status: 403 });
    }

    const {
      title,
      mode = "Timed",
      questionCount = 5,
      subject,
      specialization_id,
      module_ids = [],
    } = await request.json();

    // Look up specialization and module names for certificate
    const spec = (memoryStore.qbank_specializations || []).find(s => s.id === specialization_id);
    const selectedModules = (memoryStore.qbank_modules || []).filter(m => module_ids.includes(m.id));
    const moduleNames = selectedModules.length > 0 ? selectedModules.map(m => m.name) : ["Core Clinical Vignettes"];

    const chosenQuestions = await db.getRandomPracticeQuestions({
      specializationId: specialization_id,
      moduleIds: module_ids,
      count: Number(questionCount) || 5,
    });

    const selectedIds = chosenQuestions.map((q) => q.id);

    const attempt = await db.createTestAttempt(
      session.id,
      title || `${spec ? spec.name : "Pediatric & Neonatal"} Practice Exam Block`,
      selectedIds,
      mode || "Timed",
      {
        specialization_id: specialization_id || null,
        specialization_name: spec ? spec.name : "Neonatal & Pediatric Medicine",
        module_names: moduleNames,
      }
    );

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
