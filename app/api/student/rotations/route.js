import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const application = await db.getStudentRotationApplication(session.id, session.email);
    const recordedSessions = await db.getRecordedSessions();

    // Student is only active if application exists, is approved, and (free OR paid)
    const isApproved = application?.status === "Approved" || application?.status === "Approved - Paid";
    const isPaidOrFree = application?.tier_type === "free" || application?.payment_status === "Paid";
    const isEnrolled = !!(isApproved && isPaidOrFree);

    // Orientation materials
    const orientation = {
      title: "Pediatric & Neonatal Clinical Tele-Rotation Orientation",
      preceptor: "Dr. Janardhan Mydam, MD, FAAP",
      handbook_url: "/docs/tele_rotation_orientation_guide.pdf",
      syllabus_url: "/education-training/tele-rotations",
      objectives: [
        "Master systematic Neonatal Resuscitation Program (NRP) 8th Edition clinical algorithms.",
        "Synthesize clinical decision-making across premature infant hemodynamics, respiratory failure, and surfactant replacement.",
        "Perform structured virtual morning bedside rounds and present clinical vignettes using SBAR format.",
        "Apply 2022 AAP Hyperbilirubinemia guidelines to acute clinical scenarios."
      ],
      rules: [
        "Camera ON and professional clinical attire required for all Microsoft Teams bedside encounters.",
        "Strict adherence to HIPAA de-identification standards (zero protected health information transmission).",
        "Preparation of assigned clinical journal papers before Thursday roundtable discussion."
      ]
    };

    // Weekly meetings & live learnings
    const weeklyMeetings = [
      {
        week: 1,
        title: "Neonatal Resuscitation & Golden Hour Delivery Protocol",
        schedule: "Tuesday & Thursday 18:00–19:30 CST",
        teams_url: application?.teams_meeting_url || "https://teams.microsoft.com/l/meetup-join/jva-tele-neonatology-fall2026",
        passcode: "NICU2026",
        meeting_id: "904 812 7730",
        learning_points: [
          "T-piece resuscitator vs self-inflating bag titration",
          "Delayed cord clamping vs umbilical cord milking (PREMOD2 trial context)",
          "Target pre-ductal SpO2 milestones from 1 to 10 minutes of life"
        ]
      },
      {
        week: 2,
        title: "Respiratory Distress Syndrome (RDS) & Surfactant Replacement (LISA vs INSURE)",
        schedule: "Tuesday & Thursday 18:00–19:30 CST",
        teams_url: application?.teams_meeting_url || "https://teams.microsoft.com/l/meetup-join/jva-tele-neonatology-fall2026",
        passcode: "NICU2026",
        meeting_id: "904 812 7730",
        learning_points: [
          "Non-invasive surfactant administration (LISA) mechanics",
          "Early bubble CPAP titration to avoid ventilator-induced lung injury",
          "Blood gas interpretation in extreme prematurity"
        ]
      },
      {
        week: 3,
        title: "Neonatal Sepsis, Meningitis & Lumbar Puncture Decision Trees",
        schedule: "Tuesday & Thursday 18:00–19:30 CST",
        teams_url: application?.teams_meeting_url || "https://teams.microsoft.com/l/meetup-join/jva-tele-neonatology-fall2026",
        passcode: "NICU2026",
        meeting_id: "904 812 7730",
        learning_points: [
          "Early-onset vs late-onset GBS risk stratification",
          "Kaiser Permanente Sepsis Calculator clinical application",
          "Empiric ampicillin + gentamicin dosing adjustments in renal immaturity"
        ]
      }
    ];

    // Clinical Notes Vault
    const clinicalNotes = [
      {
        id: "note_1",
        title: "Dr. Mydam's High-Yield NICU Morning Rounds Pearls",
        author: "Dr. Janardhan Mydam, MD, FAAP",
        category: "Clinical Pearl Summary",
        date: "2026-09-10",
        content: "Rule of thumb for extreme preterms: Always preserve the capillary bed. Avoid rapid sodium bicarb boluses which elevate intraventricular hemorrhage (IVH) risk. Target PaCO2 45-55 mmHg (permissive hypercapnia) to minimize barotrauma.",
        tags: ["NICU", "Ventilation", "Pearl"]
      },
      {
        id: "note_2",
        title: "AAP 2022 Phototherapy & Exchange Transfusion Cheat Sheet",
        author: "Dr. Janardhan Mydam, MD, FAAP",
        category: "Practice Guideline",
        date: "2026-09-14",
        content: "Remember that the 2022 revised AAP clinical practice guideline has slightly elevated phototherapy thresholds for infants without neurotoxicity risk factors, but requires aggressive monitoring if hemolytic disease is suspected.",
        tags: ["Hyperbilirubinemia", "AAP 2022"]
      }
    ];

    // Examination & OSCE Evaluation
    const examination = {
      osce_status: isEnrolled ? "Scheduled (Week 6)" : "Locked",
      lor_eligibility: application?.lor_status || "Eligible upon completion of active rounds & final evaluation",
      grading_rubric: [
        { component: "Clinical Rounds Attendance & Punctuality", weight: "25%", status: "In Progress" },
        { component: "Vignette Case Presentation & SBAR Communication", weight: "25%", status: "In Progress" },
        { component: "Mid-Rotation Evaluation Call with Dr. Mydam", weight: "20%", status: "Pending" },
        { component: "Final OSCE Tele-Simulation Clinical Exam", weight: "30%", status: "Pending" }
      ],
      exam_quiz: {
        title: "Weekly Knowledge Milestone Quiz #1: Neonatal Resuscitation",
        questions_count: 10,
        passing_score: "80%",
        link: "/student/qbank"
      }
    };

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled,
      application: application || null,
      orientation,
      weekly_meetings: weeklyMeetings,
      clinical_notes: clinicalNotes,
      examination,
      recorded_sessions: recordedSessions
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
    const { action } = body;

    // 1. Submit Intake Verification Form
    if (action === "apply_intake") {
      const {
        full_name,
        email,
        phone,
        medical_school,
        graduation_year,
        usmle_status,
        specialty_interest,
        timing_preference,
        cv_url,
        deans_letter_url,
        immunization_note,
        personal_statement
      } = body;

      if (!full_name || !email || !medical_school || !personal_statement) {
        return NextResponse.json(
          { error: "Full name, email, medical school, and personal statement are mandatory." },
          { status: 400 }
        );
      }

      const existing = await db.getStudentRotationApplication(session.id, session.email);
      if (existing) {
        // Update existing application
        const updated = await db.updateRotationApplication(existing.id, {
          applicant_name: full_name,
          applicant_phone: phone,
          medical_school,
          graduation_year,
          usmle_status,
          specialty_interest,
          timing_preference,
          cv_url,
          deans_letter_url,
          immunization_note,
          personal_statement,
          status: "Under Review"
        });
        return NextResponse.json({ success: true, application: updated });
      }

      const newApp = await db.createRotationApplication({
        student_id: session.id,
        applicant_name: full_name,
        applicant_email: email || session.email,
        applicant_phone: phone,
        medical_school,
        graduation_year,
        usmle_status,
        specialty_interest,
        timing_preference,
        cv_url,
        deans_letter_url,
        immunization_note,
        personal_statement
      });

      return NextResponse.json({ success: true, application: newApp });
    }

    // 2. Process Tuition Payment & Activate Seat
    if (action === "pay_tuition") {
      const app = await db.getStudentRotationApplication(session.id, session.email);
      if (!app) {
        return NextResponse.json({ error: "No active application found to pay for." }, { status: 404 });
      }

      const updated = await db.updateRotationApplication(app.id, {
        status: "Approved - Paid",
        payment_status: "Paid",
        paid_at: new Date().toISOString()
      });

      // Ensure main enrollments store has active record
      let enr = (memoryStore.enrollments || []).find(e => e.student_id === session.id && e.program_id === "prog_tele_rotation");
      if (enr) {
        enr.enrollment_status = "Active";
        enr.payment_status = "Paid";
      } else {
        if (!memoryStore.enrollments) memoryStore.enrollments = [];
        memoryStore.enrollments.push({
          id: `enr_${Date.now()}`,
          student_id: session.id,
          program_id: "prog_tele_rotation",
          plan: "6-Week Tele-Rotation",
          access_start_date: new Date().toISOString(),
          access_expiry_date: null,
          enrollment_status: "Active",
          payment_status: "Paid",
          created_at: new Date().toISOString()
        });
      }

      return NextResponse.json({
        success: true,
        message: "Tuition payment processed successfully! Your clinical rotation seat is now confirmed.",
        application: updated
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
