import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isEnrolled = await db.isEnrolledIn(session.id, "qbank");
    if (!isEnrolled) {
      return NextResponse.json({ error: "Active QBank enrollment required" }, { status: 403 });
    }

    const { title, mode, questionCount, subject } = await request.json();

    let pool = memoryStore.questions;
    if (subject && subject !== "All") {
      pool = pool.filter((q) => q.subject.toLowerCase() === subject.toLowerCase());
    }

    const count = Math.min(Number(questionCount) || 5, pool.length);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, count).map((q) => q.id);

    const attempt = await db.createTestAttempt(
      session.id,
      title || "Custom QBank Practice Block",
      selectedIds,
      mode || "Timed"
    );

    return NextResponse.json({
      success: true,
      attempt,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
