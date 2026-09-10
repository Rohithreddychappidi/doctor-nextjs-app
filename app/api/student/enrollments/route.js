import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allEnrollments = await db.getEnrollmentsByStudent(session.id);
    const activeEnrollments = await db.getActiveEnrollments(session.id);

    return NextResponse.json({
      success: true,
      all_enrollments: allEnrollments,
      active_enrollments: activeEnrollments,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
