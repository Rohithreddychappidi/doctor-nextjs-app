import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hasTele = await db.isEnrolledIn(session.id, "tele_rotation");
    const hasPhysical = await db.isEnrolledIn(session.id, "physical_rotation");
    const isEnrolled = hasTele || hasPhysical;

    if (isEnrolled) {
      await db.recordActivity(session.id, hasTele ? "tele_rotation" : "physical_rotation");
    }

    const rotation = memoryStore.rotation_enrollments.find((r) => r.student_id === session.id);
    const applications = memoryStore.rotation_applications.filter((a) => a.student_id === session.id);
    const programs = memoryStore.rotation_programs;
    const meetings = rotation
      ? (memoryStore.rotation_meetings || []).filter(
          (m) => m.rotation_enrollment_id === rotation.id || (m.attendee_scope === "cohort" && m.cohort_id === "cohort_fall_2026")
        )
      : [];

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled,
      rotation: rotation || null,
      applications,
      programs,
      meetings,
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

    // 1. Process Tuition Payment & Activate Cohort
    if (action === "pay_tuition") {
      const app = (memoryStore.rotation_applications || []).find(a => a.student_id === session.id || a.applicant_email === session.email);
      if (app) {
        app.status = "Approved - Paid";
      }

      let enr = (memoryStore.rotation_enrollments || []).find(r => r.student_id === session.id);
      if (!enr) {
        enr = {
          id: `rot_enr_${Date.now()}`,
          student_id: session.id,
          rotation_program_id: "rot_prog_tele",
          start_date: "2026-10-01",
          end_date: "2026-11-15",
          current_week: 1,
          total_weeks: 6,
          physician: "Dr. Janardhan Mydam, MD, FAAP",
          hospital_site: "JVA Tele-Neonatology Clinical Network",
          schedule_summary: "Tuesdays & Thursdays 18:00–19:30 CST on Microsoft Teams",
          evaluation_status: "Active Trainee - Seat Confirmed",
          payment_status: "Paid",
          certificate_issued: false
        };
        memoryStore.rotation_enrollments.push(enr);
      } else {
        enr.payment_status = "Paid";
        enr.evaluation_status = "Active Trainee - Seat Confirmed";
      }

      // Also ensure standard enrollments store has active record
      const mainEnr = (memoryStore.enrollments || []).find(e => e.student_id === session.id && e.program_id === "prog_tele_rotation");
      if (mainEnr) {
        mainEnr.payment_status = "Paid";
        mainEnr.enrollment_status = "Active";
      } else {
        memoryStore.enrollments.push({
          id: `enr_${Date.now()}`,
          student_id: session.id,
          program_id: "prog_tele_rotation",
          plan: "6-Week Tele-Rotation",
          access_start_date: new Date().toISOString(),
          access_expiry_date: null,
          enrollment_status: "Active",
          payment_status: "Paid",
          created_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString()
        });
      }

      return NextResponse.json({
        success: true,
        message: "Payment confirmed! You are now fully active in the Tele-Rotation cohort.",
        enrollment: enr
      });
    }

    // 2. Submit Tele-Rotation Application
    if (action === "apply") {
      const { name, email, phone, document_url, message, preferred_time } = body;
      const newApp = {
        id: `rot_app_${Date.now()}`,
        student_id: session.id,
        applicant_name: name || session.name || "Candidate",
        applicant_email: email || session.email,
        applicant_phone: phone || "",
        document_url: document_url || "",
        notes: message || "New Tele-Rotation candidate application",
        status: "Submitted",
        preferred_start: "2026-10-01",
        timing_preference: preferred_time || "Evenings CST",
        applied_at: new Date().toISOString()
      };
      if (!memoryStore.rotation_applications) memoryStore.rotation_applications = [];
      memoryStore.rotation_applications.unshift(newApp);

      return NextResponse.json({ success: true, application: newApp });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
