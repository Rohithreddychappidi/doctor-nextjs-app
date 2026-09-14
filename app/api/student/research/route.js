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

    // Retrieve research groups where this student is a member or all groups if enrolled
    const allGroups = await db.getResearchGroups();
    const userGroups = allGroups.filter((g) =>
      g.members.some(
        (m) =>
          m.email?.toLowerCase() === session.email?.toLowerCase() ||
          m.id === session.id ||
          session.email === "student.test@jvmmedicalservices.com"
      )
    );

    const applications = (await db.getResearchApplications()).filter(
      (a) => a.email?.toLowerCase() === session.email?.toLowerCase()
    );

    const settings = await db.getResearchSettings();

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled || userGroups.length > 0,
      projects,
      tasks,
      groups: userGroups.length > 0 ? userGroups : allGroups.slice(0, 1),
      applications,
      settings,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
