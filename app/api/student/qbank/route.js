import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isEnrolled = await db.isEnrolledIn(session.id, "qbank");
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get("subject");

    await db.recordActivity(session.id, "qbank");

    const questions = await db.getQuestions(subject);
    const attempts = memoryStore.test_attempts.filter((a) => a.student_id === session.id);
    const bookmarks = memoryStore.bookmarks.filter((b) => b.student_id === session.id);

    return NextResponse.json({
      success: true,
      is_enrolled: isEnrolled,
      total_questions: questions.length,
      questions: questions.map((q) => ({
        id: q.id,
        exam: q.exam,
        subject: q.subject,
        system: q.system,
        level: q.level,
        stem: q.stem,
        options: q.options,
        bookmarks_count: q.bookmarks_count,
        is_bookmarked: bookmarks.some((b) => b.question_id === q.id),
      })),
      recent_attempts: attempts,
      bookmarks,
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

    const body = await request.json();
    const { action, question_id, note } = body;

    if (action === "bookmark") {
      const result = await db.toggleBookmark(session.id, question_id, note);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
