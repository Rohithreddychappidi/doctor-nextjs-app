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
