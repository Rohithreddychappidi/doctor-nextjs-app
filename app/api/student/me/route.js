import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.getStudentProfile(session.id);
    const activeEnrollments = await db.getActiveEnrollments(session.id);
    const allEnrollments = await db.getEnrollmentsByStudent(session.id);
    const roles = await db.getUserRoles(session.id);

    return NextResponse.json({
      success: true,
      user: {
        id: session.id,
        email: session.email,
        name: session.name,
        roles,
      },
      profile,
      active_enrollments: activeEnrollments,
      all_enrollments: allEnrollments,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
