import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isEnrolled = await db.isEnrolledIn(session.id, "research");
    if (isEnrolled) {
      await db.recordActivity(session.id, "research");
    }

    const projects = memoryStore.research_projects.filter((p) => p.member_ids.includes(session.id));
    const tasks = memoryStore.tasks.filter((t) => t.student_id === session.id && t.category === "Research");

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled,
      projects,
      tasks,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
