import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isEnrolled = await db.isEnrolledIn(session.id, "live_learning");
    await db.recordActivity(session.id, "live_learning");

    const upcoming = memoryStore.live_sessions.filter((s) => s.status === "Upcoming");
    const recorded = memoryStore.live_sessions.filter((s) => s.status === "Recorded");

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled,
      upcoming,
      recorded,
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

    const body = await request.json().catch(() => ({}));
    const { meetingId, title, isFree, price } = body;

    // Check if enrollment already exists
    let enr = (memoryStore.enrollments || []).find(
      (e) => e.student_id === session.id && (e.program_id === "prog_live_learning" || e.program_id === "live_learning")
    );

    if (!enr) {
      enr = {
        id: `enr_${Date.now()}`,
        student_id: session.id,
        program_id: "prog_live_learning",
        plan: isFree ? "Free Live Webinar Pass" : `Live Masterclass (${price ? `$${price}` : "Paid"})`,
        access_start_date: new Date().toISOString(),
        access_expiry_date: null,
        enrollment_status: "Active",
        payment_status: isFree ? "Free" : "Paid",
        program_specific_data: {
          cohort: "Live Learning Conferences",
          enrolled_sessions: meetingId ? [meetingId] : ["m1"]
        },
        created_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString()
      };
      if (!memoryStore.enrollments) memoryStore.enrollments = [];
      memoryStore.enrollments.push(enr);
    } else {
      enr.enrollment_status = "Active";
      enr.payment_status = "Paid";
      if (!enr.program_specific_data) enr.program_specific_data = {};
      if (!enr.program_specific_data.enrolled_sessions) enr.program_specific_data.enrolled_sessions = [];
      if (meetingId && !enr.program_specific_data.enrolled_sessions.includes(meetingId)) {
        enr.program_specific_data.enrolled_sessions.push(meetingId);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Enrolled successfully in ${title || "Live Learning"}! Access unlocked in Student Dashboard.`,
      enrollment: enr
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
