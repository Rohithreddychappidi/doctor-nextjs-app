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
