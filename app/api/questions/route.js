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
    const {
      subject,
      section,
      module: qModule,
      system,
      exam,
      level,
      stem,
      options,
      correct_index,
      explanation_correct,
      explanation_incorrect,
    } = data;

    if (!subject || !stem || !options || options.length < 2 || correct_index === undefined) {
      return NextResponse.json(
        { error: "Subject, question stem, options, and correct answer index are mandatory (*)." },
        { status: 400 }
      );
    }

    const newQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      subject: subject.trim(),
      section: section ? section.trim() : "General Clinical Vignettes",
      module: qModule ? qModule.trim() : (system || "Neonatal Medicine"),
      system: system ? system.trim() : "General Pediatrics",
      exam: exam ? exam.trim() : "USMLE Step 2 CK / Board Prep",
      level: Number(level) || 1,
      stem: stem.trim(),
      options: Array.isArray(options) ? options : [options],
      correct_index: Number(correct_index),
      explanation_correct: explanation_correct?.trim() || "",
      explanation_incorrect: explanation_incorrect?.trim() || "",
      bookmarks_count: 0,
      created_at: new Date().toISOString(),
    };

    const saved = await db.addQuestion(newQuestion);
    return NextResponse.json({ success: true, question: saved });
  } catch (err) {
    console.error("Create question error:", err);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    let questionId = searchParams.get("id");
    if (!questionId) {
      try {
        const body = await request.json();
        questionId = body?.id;
      } catch (e) {}
    }

    if (!questionId) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }

    const ok = await db.deleteQuestion(questionId);
    if (!ok) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Question deleted successfully" });
  } catch (err) {
    console.error("Delete question error:", err);
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}
