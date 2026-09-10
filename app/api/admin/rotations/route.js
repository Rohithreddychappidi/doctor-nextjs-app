import { NextResponse } from "next/server";
import { memoryStore } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(request) {
  try {
    await requireRole(["admin", "super_admin", "physician"]);

    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get("enrollmentId");

    const applications = memoryStore.rotation_applications || [];
    let meetings = memoryStore.rotation_meetings || [];

    if (enrollmentId) {
      meetings = meetings.filter(m => m.rotation_enrollment_id === enrollmentId);
    }

    const enrollments = (memoryStore.rotation_enrollments || []).map(enr => {
      const student = (memoryStore.users || []).find(u => u.id === enr.student_id);
      const studentMeetings = (memoryStore.rotation_meetings || []).filter(m => m.rotation_enrollment_id === enr.id);
      const examineCalls = studentMeetings.filter(m => m.meeting_type === "Examine Call");
      const gradedExamines = examineCalls.filter(m => m.score !== null);
      const avgScore = gradedExamines.length > 0 
        ? Math.round(gradedExamines.reduce((acc, c) => acc + c.score, 0) / gradedExamines.length)
        : null;

      return {
        ...enr,
        student_name: student ? `${student.first_name} ${student.last_name}` : "Alex Rivera",
        student_email: student?.email,
        total_scheduled_meetings: studentMeetings.length,
        examine_calls_count: examineCalls.length,
        examine_calls_graded: gradedExamines.length,
        average_examine_score: avgScore
      };
    });

    const stats = {
      total_applications: applications.length,
      pending_review: applications.filter(a => a.status === "Submitted" || a.status === "Under Review").length,
      documents_required: applications.filter(a => a.status === "Documents Required").length,
      approved_cohort: applications.filter(a => a.status === "Approved").length,
      active_enrollments: enrollments.length,
      upcoming_meetings: meetings.filter(m => m.status === "Scheduled").length,
      upcoming_examine_calls: meetings.filter(m => m.meeting_type === "Examine Call" && m.status === "Scheduled").length,
    };

    return NextResponse.json({
      success: true,
      applications,
      meetings,
      enrollments,
      stats,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    await requireRole(["admin", "super_admin", "physician"]);
    const body = await request.json();
    const { action } = body;

    // 1. Update Application Status
    if (action === "update_app_status") {
      const { applicationId, status, notes } = body;
      const app = (memoryStore.rotation_applications || []).find(a => a.id === applicationId);
      if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

      app.status = status;
      if (notes) app.notes = notes;

      // If Approved, ensure student has an active enrollment
      if (status === "Approved" && !app.student_id) {
        const newUserId = `usr_${Date.now()}`;
        const names = (app.applicant_name || "Applicant").split(" ");
        memoryStore.users.push({
          id: newUserId,
          email: app.applicant_email,
          first_name: names[0] || "Learner",
          last_name: names.slice(1).join(" ") || "Doctor",
          role: "student",
          medical_school: app.medical_school,
          graduation_year: app.graduation_year,
          usmle_stage: app.usmle_stage
        });
        app.student_id = newUserId;

        // Create tele_rotation enrollment
        const newEnrId = `rot_enr_${Date.now()}`;
        memoryStore.rotation_enrollments.push({
          id: newEnrId,
          student_id: newUserId,
          rotation_program_id: "rot_prog_tele",
          start_date: app.preferred_start || "2026-10-01",
          end_date: "2026-11-15",
          current_week: 1,
          total_weeks: 6,
          physician: "Dr. Janardhan Mydam, MD, FAAP",
          hospital_site: "JVA Tele-Neonatology Clinical Network",
          schedule_summary: "Live rounds & clinical examine calls via Microsoft Teams",
          evaluation_status: "Enrolled - Orientation Pending",
          certificate_issued: false
        });
      }

      return NextResponse.json({ success: true, application: app });
    }

    // 2. Request Documents (triggers status Documents Required)
    if (action === "request_documents") {
      const { applicationId, requested_documents, notes } = body;
      const app = (memoryStore.rotation_applications || []).find(a => a.id === applicationId);
      if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

      app.status = "Documents Required";
      app.requested_documents = requested_documents || ["Official Medical School Transcript", "Good Standing Letter"];
      if (notes) app.notes = notes;

      return NextResponse.json({
        success: true,
        message: `Email dispatched to ${app.applicant_email} requesting: ${app.requested_documents.join(", ")}.`,
        application: app
      });
    }

    // 3. Create Flexible Meeting
    if (action === "create_meeting") {
      const {
        rotation_enrollment_id = "rot_enr_a",
        cohort_id = "cohort_fall_2026",
        meeting_type = "Live Teaching Session",
        title,
        scheduled_at,
        duration_minutes = 60,
        physician = "Dr. Janardhan Mydam, MD, FAAP",
        attendee_scope = "cohort",
        student_id = null,
        teams_join_url,
        materials_url = "",
        notes = "",
        teams_meeting_id = "",
        teams_passcode = "",
        recording_url = "",
        ai_summary = "",
        is_pro = true
      } = body;

      const newMeeting = {
        id: `rot_meet_${Date.now()}`,
        rotation_enrollment_id,
        cohort_id,
        meeting_type,
        title: title || `${meeting_type}: Clinical Case Discussion`,
        scheduled_at: scheduled_at || new Date(Date.now() + 86400000 * 3).toISOString(),
        duration_minutes: Number(duration_minutes),
        physician,
        attendee_scope,
        student_id,
        teams_join_url: teams_join_url || `https://teams.microsoft.com/l/meetup-join/jva-session-${Date.now()}`,
        teams_meeting_id: teams_meeting_id || "",
        teams_passcode: teams_passcode || "",
        recording_url: recording_url || "",
        ai_summary: ai_summary || "",
        is_pro: Boolean(is_pro),
        materials_url,
        notes,
        status: recording_url ? "Completed" : "Scheduled",
        score: null,
        pass_fail: null,
        grader_notes: null
      };

      if (!memoryStore.rotation_meetings) memoryStore.rotation_meetings = [];
      memoryStore.rotation_meetings.push(newMeeting);

      return NextResponse.json({ success: true, meeting: newMeeting });
    }

    // 3b. Update Meeting (e.g., attach Cloud Recording URL, AI summary, or update schedule)
    if (action === "update_meeting") {
      const { meeting_id, ...updates } = body;
      const meet = (memoryStore.rotation_meetings || []).find(m => m.id === meeting_id);
      if (!meet) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });

      Object.assign(meet, updates);
      if (updates.recording_url && meet.status !== "Completed") {
        meet.status = "Completed";
      }

      return NextResponse.json({ success: true, meeting: meet });
    }

    // 4. Duplicate / Recurrence Generator ("Repeat weekly for N weeks")
    if (action === "duplicate_meetings") {
      const { base_meeting_id, repeat_weeks = 6 } = body;
      const base = (memoryStore.rotation_meetings || []).find(m => m.id === base_meeting_id);
      if (!base) return NextResponse.json({ error: "Base meeting not found" }, { status: 404 });

      const generated = [];
      const baseDate = new Date(base.scheduled_at);

      for (let i = 1; i < repeat_weeks; i++) {
        const nextDate = new Date(baseDate.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        const dup = {
          ...base,
          id: `rot_meet_${Date.now()}_${i}`,
          title: base.title.replace(/Week \d+/i, `Week ${i + 1}`) || `${base.title} (Part ${i + 1})`,
          scheduled_at: nextDate.toISOString(),
          status: "Scheduled",
          score: null,
          pass_fail: null,
          grader_notes: null
        };
        memoryStore.rotation_meetings.push(dup);
        generated.push(dup);
      }

      return NextResponse.json({ success: true, generated_count: generated.length, generated });
    }

    // 5. Grade Examine Call
    if (action === "grade_examine_call") {
      const { meeting_id, score, pass_fail, grader_notes } = body;
      const meet = (memoryStore.rotation_meetings || []).find(m => m.id === meeting_id);
      if (!meet) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });

      meet.score = Number(score);
      meet.pass_fail = pass_fail || (Number(score) >= 70 ? "Pass" : "Fail");
      meet.grader_notes = grader_notes || "";
      meet.status = "Completed";

      // Update student enrollment evaluation status
      const enr = (memoryStore.rotation_enrollments || []).find(e => e.id === meet.rotation_enrollment_id);
      if (enr) {
        enr.evaluation_status = `Examine Call Graded: ${meet.score}% (${meet.pass_fail}) - Performance Logged`;
      }

      return NextResponse.json({ success: true, meeting: meet, enrollment: enr });
    }

    // 6. Delete Meeting
    if (action === "delete_meeting") {
      const { meeting_id } = body;
      memoryStore.rotation_meetings = (memoryStore.rotation_meetings || []).filter(m => m.id !== meeting_id);
      return NextResponse.json({ success: true });
    }

    // 7. Publish Written Evaluation & Certificate
    if (action === "publish_evaluation") {
      const { enrollmentId, written_evaluation, grade_letter } = body;
      const enr = (memoryStore.rotation_enrollments || []).find(e => e.id === enrollmentId);
      if (!enr) return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });

      enr.evaluation_status = `Completed - Final Grade: ${grade_letter || "Honors"}`;
      enr.final_evaluation = written_evaluation;
      enr.certificate_issued = true;
      enr.certificate_url = `/certificates/tele-rotation-${enr.id}.pdf`;

      return NextResponse.json({ success: true, enrollment: enr });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
