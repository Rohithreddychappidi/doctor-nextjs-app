import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const questions = await db.getQuestions();
    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Fetch questions error:", err);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { subject, level, stem, options, correct_index, explanation_correct, explanation_incorrect } = data;

    if (!subject || !stem || !options || options.length < 2 || correct_index === undefined) {
      return NextResponse.json(
        { error: "Subject, question stem, options, and correct answer index are mandatory (*)." },
        { status: 400 }
      );
    }

    const newQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      subject: subject.trim(),
      level: Number(level) || 1,
      stem: stem.trim(),
      options: Array.isArray(options) ? options : [options],
      correct_index: Number(correct_index),
      explanation_correct: explanation_correct?.trim() || "",
      explanation_incorrect: explanation_incorrect?.trim() || "",
      created_at: new Date().toISOString(),
    };

    const saved = await db.addQuestion(newQuestion);
    return NextResponse.json({ success: true, question: saved });
  } catch (err) {
    console.error("Create question error:", err);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
