import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isEnrolled = await db.isEnrolledIn(session.id, "courses");
    if (isEnrolled) {
      await db.recordActivity(session.id, "courses");
    }

    const courses = memoryStore.courses;

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled,
      courses,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
