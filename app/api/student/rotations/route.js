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

    // Attending Physician Announcements / Message Box
    const announcements = await db.getRotationAnnouncements(application?.cohort_id || "cohort_fall_2026");

    // Dynamic rotation meetings & live learnings (filtered for this student or cohort-wide)
    const allRotationMeetings = memoryStore.rotation_meetings || [];
    const studentMeetings = allRotationMeetings
      .filter((m) => {
        if (m.attendee_scope === "cohort") return true;
        if (m.attendee_scope === "individual") {
          return m.student_id === session.id || m.student_id === "usr_student_jvm";
        }
        return false;
      })
      .map((m, idx) => ({
        id: m.id,
        week: idx + 1,
        title: m.title,
        meeting_type: m.meeting_type || "Live Teaching Session",
        schedule: new Date(m.scheduled_at).toLocaleString(),
        scheduled_at: m.scheduled_at,
        duration_minutes: m.duration_minutes || 60,
        physician: m.physician || "Dr. Janardhan Mydam, MD, FAAP",
        attendee_scope: m.attendee_scope || "cohort",
        teams_url: m.teams_join_url || "https://teams.microsoft.com",
        meeting_id: m.teams_meeting_id || "904 812 7730",
        passcode: m.teams_passcode || "NICU2026",
        recording_url: m.recording_url || "",
        ai_summary: m.ai_summary || "",
        status: m.status || "Scheduled",
        score: m.score,
        pass_fail: m.pass_fail,
        grader_notes: m.grader_notes,
        learning_points: [
          m.notes || "Interactive clinical case analysis and bedside decision-making.",
          "Differential diagnosis formulation using SBAR clinical framework.",
          "AAP & NRP evidence-based management review."
        ]
      }));

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

    // Examination and OSCE materials
    const examination = {
      title: "Exit Clinical OSCE & High-Yield Oral Case Simulation",
      examiner: "Dr. Janardhan Mydam, MD, FAAP",
      format: "One-on-one virtual oral exam over Microsoft Teams (30 Minutes)",
      rubric_url: "/docs/tele_rotation_osce_rubric.pdf",
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

    const enrollment = (memoryStore.rotation_enrollments || []).find(
      (e) => e.student_id === session.id || e.student_email === session.email || e.id === "rot_enr_a"
    ) || null;

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled,
      application: application || null,
      enrollment: enrollment,
      announcements: announcements || [],
      orientation,
      weekly_meetings: studentMeetings,
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
