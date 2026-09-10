import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isEnrolled = await db.isEnrolledIn(session.id, "mentorship");
    if (isEnrolled) {
      await db.recordActivity(session.id, "mentorship");
    }

    const mentorData = memoryStore.mentor_assignments.find((m) => m.student_id === session.id);
    const tasks = memoryStore.tasks.filter((t) => t.student_id === session.id && t.category === "Mentorship");

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled,
      mentor: mentorData || null,
      tasks,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
