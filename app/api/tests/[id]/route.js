import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { sendTestResultEmail } from "@/lib/email";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const test = await db.getMockTestById(id);
    if (!test) {
      return NextResponse.json({ error: "Mock test not found" }, { status: 404 });
    }

    const allQuestions = await db.getQuestions();
    const testQuestions = (test.question_ids || [])
      .map((qId) => allQuestions.find((q) => q.id === qId))
      .filter(Boolean)
      .map((q) => ({
        id: q.id,
        subject: q.subject,
        level: q.level,
        stem: q.stem,
        options: q.options,
        // Omit correct_index and explanations during test taking
      }));

    return NextResponse.json({
      test: {
        id: test.id,
        title: test.title,
        subject: test.subject,
        duration_minutes: test.duration_minutes,
        passing_score: test.passing_score,
        is_free: test.is_free,
        description: test.description,
      },
      questions: testQuestions,
    });
  } catch (err) {
    console.error("Get test error:", err);
    return NextResponse.json({ error: "Failed to load test" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    const data = await request.json();
    const { answers, time_spent_seconds, student_email, student_name } = data;

    const test = await db.getMockTestById(id);
    if (!test) {
      return NextResponse.json({ error: "Mock test not found" }, { status: 404 });
    }

    const allQuestions = await db.getQuestions();
    const testQuestions = (test.question_ids || [])
      .map((qId) => allQuestions.find((q) => q.id === qId))
      .filter(Boolean);

    let correctCount = 0;
    const reviews = testQuestions.map((q) => {
      const selectedOption = answers ? answers[q.id] : null;
      const isCorrect = selectedOption !== null && selectedOption !== undefined && Number(selectedOption) === Number(q.correct_index);
      if (isCorrect) correctCount++;

      return {
        id: q.id,
        stem: q.stem,
        options: q.options,
        selectedOption,
        correctIndex: q.correct_index,
        isCorrect,
        explanationCorrect: q.explanation_correct,
        explanationIncorrect: q.explanation_incorrect,
      };
    });

    const totalQuestions = testQuestions.length || 1;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const passed = score >= (test.passing_score || 70);

    const attempt = {
      id: `att_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      student_id: user?.id || `guest_${Date.now()}`,
      test_id: id,
      score,
      total_questions: totalQuestions,
      answers: answers || {},
      passed,
      time_spent_seconds: time_spent_seconds || 0,
      completed_at: new Date().toISOString(),
    };

    await db.saveTestAttempt(attempt);

    // Send email summary via Resend if email available
    const recipientEmail = user?.email || student_email;
    const recipientName = user?.name || student_name || "Doctor / Student";
    if (recipientEmail) {
      sendTestResultEmail({
        to: recipientEmail,
        studentName: recipientName,
        testTitle: test.title,
        score,
        passed,
      }).catch((e) => console.error("Test email notification error:", e));
    }

    return NextResponse.json({
      success: true,
      score,
      correctCount,
      totalQuestions,
      passed,
      passingScore: test.passing_score,
      timeSpentSeconds: time_spent_seconds,
      reviews,
    });
  } catch (err) {
    console.error("Submit test error:", err);
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 });
  }
}
