import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const tests = await db.getMockTests();
    return NextResponse.json({ tests });
  } catch (err) {
    console.error("Fetch mock tests error:", err);
    return NextResponse.json({ error: "Failed to fetch mock tests" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const data = await request.json();
    const { title, subject, duration_minutes, passing_score, is_free, description, question_ids } = data;

    if (!title || !subject || !question_ids || question_ids.length === 0) {
      return NextResponse.json(
        { error: "Test title, subject, and at least one question are mandatory (*)." },
        { status: 400 }
      );
    }

    const newTest = {
      id: `tst_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim(),
      subject: subject.trim(),
      duration_minutes: Number(duration_minutes) || 15,
      passing_score: Number(passing_score) || 70,
      is_free: is_free !== false,
      description: description?.trim() || "",
      question_ids,
      created_at: new Date().toISOString(),
    };

    const saved = await db.addMockTest(newTest);
    return NextResponse.json({ success: true, test: saved });
  } catch (err) {
    console.error("Create test error:", err);
    return NextResponse.json({ error: "Failed to create mock test" }, { status: 500 });
  }
}
