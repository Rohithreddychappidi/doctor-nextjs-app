import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
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

    const announcements = await db.getRotationAnnouncements();

    return NextResponse.json({
      success: true,
      applications,
      meetings,
      enrollments,
      announcements,
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

    // 1. Update Application Status (Approve as Free or Paid with Custom Fee)
    if (action === "update_app_status") {
      const { applicationId, status, notes, tier_type = "paid", tuition_fee = 1250 } = body;
      const app = (memoryStore.rotation_applications || []).find(a => a.id === applicationId);
      if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

      app.status = status;
      app.tier_type = tier_type;
      app.tuition_fee = Number(tuition_fee);
      if (tier_type === "free") {
        app.payment_status = "Free Access";
      } else if (tier_type === "paid" && app.payment_status !== "Paid") {
        app.payment_status = "Unpaid";
      }
      if (notes) app.notes = notes;

      // If Approved and Free, activate seat immediately
      if (status === "Approved" && tier_type === "free" && app.student_id) {
        let enr = (memoryStore.enrollments || []).find(e => e.student_id === app.student_id && e.program_id === "prog_tele_rotation");
        if (enr) {
          enr.enrollment_status = "Active";
          enr.payment_status = "Paid";
        } else {
          if (!memoryStore.enrollments) memoryStore.enrollments = [];
          memoryStore.enrollments.push({
            id: `enr_${Date.now()}`,
            student_id: app.student_id,
            program_id: "prog_tele_rotation",
            plan: "Free Scholarship Tele-Rotation",
            access_start_date: new Date().toISOString(),
            access_expiry_date: null,
            enrollment_status: "Active",
            payment_status: "Paid",
            created_at: new Date().toISOString()
          });
        }
      }

      return NextResponse.json({ success: true, application: app });
    }

    // 1b. Add / Manage Recorded Session Links
    if (action === "add_recorded_session") {
      const { title, date, duration, preceptor, video_url, notes, tags } = body;
      const newSession = await db.addRecordedSession({
        title,
        date,
        duration,
        preceptor,
        video_url,
        notes,
        tags
      });
      return NextResponse.json({ success: true, recorded_session: newSession });
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
      let enr = (memoryStore.rotation_enrollments || []).find(e => e.id === enrollmentId || e.student_id === enrollmentId);
      if (!enr) {
        enr = {
          id: enrollmentId || `rot_enr_${Date.now()}`,
          student_name: "Dr. Candidate Trainee",
          evaluation_status: `Completed - Final Grade: ${grade_letter || "Honors"}`,
          final_evaluation: written_evaluation,
          grade_letter: grade_letter || "Honors",
          certificate_issued: true,
          certificate_id: `JVM-ROT-2026-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          certificate_url: `/certificates/tele-rotation-${enrollmentId}.pdf`,
        };
        if (!memoryStore.rotation_enrollments) memoryStore.rotation_enrollments = [];
        memoryStore.rotation_enrollments.push(enr);
      } else {
        enr.evaluation_status = `Completed - Final Grade: ${grade_letter || "Honors"}`;
        enr.final_evaluation = written_evaluation;
        enr.grade_letter = grade_letter || "Honors";
        enr.certificate_issued = true;
        enr.certificate_id = enr.certificate_id || `JVM-ROT-2026-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        enr.certificate_url = `/certificates/tele-rotation-${enr.id}.pdf`;
      }

      return NextResponse.json({ success: true, enrollment: enr });
    }

    // 8. Post Rotation Announcement / Message Box to Cohort
    if (action === "post_announcement") {
      const { cohort_id, target_cohort, title, message, author, posted_by, link, action_url, priority, category, requires_ack, attachments } = body;
      if (!title || !message) {
        return NextResponse.json({ error: "Title and message are mandatory (*)." }, { status: 400 });
      }

      const announcement = await db.createRotationAnnouncement({
        cohort_id: cohort_id || target_cohort || "cohort_fall_2026",
        title,
        message,
        author: author || posted_by || "Dr. Janardhan Mydam, MD, FAAP",
        priority: priority || "Normal",
        category: category || "General Clinical Notice",
        link: link || action_url || "",
        action_url: action_url || link || "",
        requires_ack: Boolean(requires_ack),
        attachments: attachments || []
      });

      return NextResponse.json({ success: true, announcement });
    }

    return NextResponse.json({ error: "Invalid action specified" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
