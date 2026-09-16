import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { callGeminiFlash } from "@/lib/ai-gemini";

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const body = await request.json();

    const {
      question_id,
      question_stem = "",
      selected_option = "",
      correct_option = "",
      rationale = "",
      student_query = "",
      history = [],
    } = body;

    if (!student_query || !student_query.trim()) {
      return NextResponse.json({ error: "Student question or dispute is required." }, { status: 400 });
    }

    // Assemble rich clinical context for Gemini Flash
    const clinicalContext = `
CLINICAL VIGNETTE STEM:
${question_stem || "Pediatric Clinical Vignette"}

STUDENT'S CHOSEN OPTION:
${selected_option || "Not recorded"}

OFFICIAL CORRECT OPTION:
${correct_option || "Not recorded"}

OFFICIAL BOARD RATIONALE:
${rationale || "Evidence-based pediatric clinical decision guidelines."}
`.trim();

    // Call Multi-Key Gemini Flash with automatic rotation
    const aiResult = await callGeminiFlash({
      prompt: student_query,
      context: clinicalContext,
      history,
    });

    const studentName = user?.name || user?.full_name || "Enrolled Trainee";
    const studentEmail = user?.email || "";
    const studentId = user?.id || null;

    // Log the discussion/dispute into database for Admin Review & Question Authoring
    const loggedDispute = await db.logQuestionDispute({
      question_id,
      question_stem,
      student_id: studentId,
      student_name: studentName,
      student_email: studentEmail,
      student_query,
      ai_response: aiResult.text,
      selected_option,
      correct_option,
    });

    return NextResponse.json({
      success: true,
      reply: aiResult.text,
      model: aiResult.model,
      dispute_id: loggedDispute?.id,
    });
  } catch (error) {
    console.error("AI QBank discussion error:", error);
    return NextResponse.json(
      { error: "Failed to generate clinical tutor response. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("question_id");

    if (!questionId) {
      return NextResponse.json({ error: "question_id query parameter is required." }, { status: 400 });
    }

    const disputes = await db.getQuestionDisputes(questionId);
    return NextResponse.json({ success: true, disputes });
  } catch (error) {
    console.error("Fetch question disputes error:", error);
    return NextResponse.json({ error: "Could not retrieve question discussions." }, { status: 500 });
  }
}
