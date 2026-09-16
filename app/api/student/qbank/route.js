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

    // 3 Main Subject Pillars with Modular Free / Paid Tiers
    const pillars = [
      {
        id: "pillar_neonatology",
        name: "Neonatology & Perinatal Medicine",
        icon: "👶",
        description: "NICU protocols, neonatal resuscitation, prematurity pathophysiology, and AAP guidelines.",
        modules: [
          {
            id: "mod_neo_nrp",
            title: "NRP 8th Edition & Delivery Room Resuscitation",
            category: "Neonatology",
            is_free: true,
            price: 0,
            question_count: 15,
            is_unlocked: true,
            exam_focus: "NRP / NICU In-Training"
          },
          {
            id: "mod_neo_rds",
            title: "Respiratory Distress Syndrome & Surfactant (LISA vs INSURE)",
            category: "Neonatology",
            is_free: false,
            price: 29,
            question_count: 45,
            is_unlocked: hasFullBundle || userUnlocks.some((u) => u.module_id === "mod_neo_rds"),
            exam_focus: "Pediatric Shelf / USMLE Step 2 CK"
          },
          {
            id: "mod_neo_jaundice",
            title: "Neonatal Hyperbilirubinemia & 2022 AAP Clinical Practice Guidelines",
            category: "Neonatology",
            is_free: false,
            price: 29,
            question_count: 35,
            is_unlocked: hasFullBundle || userUnlocks.some((u) => u.module_id === "mod_neo_jaundice"),
            exam_focus: "USMLE Step 2 CK / Board Prep"
          },
          {
            id: "mod_neo_extreme_preterm",
            title: "Extreme Prematurity: IVH, NEC, BPD & PDA Hemodynamics",
            category: "Neonatology",
            is_free: false,
            price: 39,
            question_count: 50,
            is_unlocked: hasFullBundle || userUnlocks.some((u) => u.module_id === "mod_neo_extreme_preterm"),
            exam_focus: "Fellowship & Board Certification"
          }
        ]
      },
      {
        id: "pillar_pediatrics",
        name: "General Pediatrics & Shelf Review",
        icon: "🩺",
        description: "USMLE Step 2 CK & Pediatric Shelf high-yield cases, development, and emergencies.",
        modules: [
          {
            id: "mod_ped_development",
            title: "Developmental Milestones & Well-Child Checks",
            category: "Pediatrics",
            is_free: true,
            price: 0,
            question_count: 20,
            is_unlocked: true,
            exam_focus: "Pediatric Shelf / USMLE Step 2 CK"
          },
          {
            id: "mod_ped_infectious",
            title: "Pediatric Infectious Diseases, Exanthems & Vaccinations",
            category: "Pediatrics",
            is_free: false,
            price: 29,
            question_count: 40,
            is_unlocked: hasFullBundle || userUnlocks.some((u) => u.module_id === "mod_ped_infectious"),
            exam_focus: "USMLE Step 2 CK"
          },
          {
            id: "mod_ped_cardio",
            title: "Congenital Heart Defects & Pediatric Murmurs",
            category: "Pediatrics",
            is_free: false,
            price: 29,
            question_count: 35,
            is_unlocked: hasFullBundle || userUnlocks.some((u) => u.module_id === "mod_ped_cardio"),
            exam_focus: "USMLE Step 2 CK / Shelf"
          },
          {
            id: "mod_ped_emergency",
            title: "Pediatric Emergencies, Dehydration & Critical Resuscitation",
            category: "Pediatrics",
            is_free: false,
            price: 39,
            question_count: 45,
            is_unlocked: hasFullBundle || userUnlocks.some((u) => u.module_id === "mod_ped_emergency"),
            exam_focus: "Shelf & Clinical Clerkship"
          }
        ]
      },
      {
        id: "pillar_biostats",
        name: "Biostatistics & Medical Epidemiology",
        icon: "📊",
        description: "Diagnostic test metrics, clinical trial analysis, odds ratio, and board statistics.",
        modules: [
          {
            id: "mod_bio_diagnostic",
            title: "Sensitivity, Specificity, PPV, NPV & Likelihood Ratios",
            category: "Biostatistics",
            is_free: true,
            price: 0,
            question_count: 15,
            is_unlocked: true,
            exam_focus: "USMLE Step 1 / Step 2 CK Core"
          },
          {
            id: "mod_bio_study_designs",
            title: "Cohort vs Case-Control: Odds Ratio, Relative Risk & NNT",
            category: "Biostatistics",
            is_free: false,
            price: 29,
            question_count: 30,
            is_unlocked: hasFullBundle || userUnlocks.some((u) => u.module_id === "mod_bio_study_designs"),
            exam_focus: "USMLE Step 2 CK Board Vignettes"
          },
          {
            id: "mod_bio_hypo_testing",
            title: "Hypothesis Testing: Type I/II Errors, Power & P-Values",
            category: "Biostatistics",
            is_free: false,
            price: 29,
            question_count: 25,
            is_unlocked: hasFullBundle || userUnlocks.some((u) => u.module_id === "mod_bio_hypo_testing"),
            exam_focus: "USMLE Step 1 & Step 2 CK"
          },
          {
            id: "mod_bio_clinical_trials",
            title: "Clinical Trial Analysis, Forest Plots & Bias Control",
            category: "Biostatistics",
            is_free: false,
            price: 35,
            question_count: 30,
            is_unlocked: hasFullBundle || userUnlocks.some((u) => u.module_id === "mod_bio_clinical_trials"),
            exam_focus: "Board Exam Abstract Questions"
          }
        ]
      }
    ];

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
    const { action, module_id } = body;

    if (!memoryStore.student_qbank_unlocks) memoryStore.student_qbank_unlocks = [];

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
      }

      return NextResponse.json({
        success: true,
        message: targetId === "bundle_all"
          ? "Full High-Yield Board QBank Unlocked!"
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
