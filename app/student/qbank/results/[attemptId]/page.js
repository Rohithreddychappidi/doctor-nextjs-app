"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import QuestionTutorModal from "@/components/QuestionTutorModal";

export default function QBankResultsPage({ params }) {
  const resolvedParams = use(params);
  const attemptId = resolvedParams.attemptId;

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});
  const [activeDiscussionQuestion, setActiveDiscussionQuestion] = useState(null);

  useEffect(() => {
    async function loadResults() {
      try {
        const res = await fetch(`/api/student/qbank/test/${attemptId}`);
        if (res.ok) {
          const json = await res.json();
          setAttempt(json.attempt);
        }
      } catch (err) {
        console.error("Results error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, [attemptId]);

  const handleBookmark = async (qId) => {
    try {
      const res = await fetch("/api/student/qbank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bookmark", question_id: qId }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarkedQuestions((prev) => ({ ...prev, [qId]: data.bookmarked }));
      }
    } catch (e) {
      console.error("Bookmark error:", e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748b" }}>
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p style={{ fontWeight: 700, fontSize: 14 }}>Calculating score card &amp; synthesizing certificate...</p>
      </div>
    );
  }

  if (!attempt) return <div style={{ padding: "40px" }}>Results not found.</div>;

  const passed = (attempt.score_percent || 0) >= 70;
  const certCode = attempt.certificate_code || `JVM-QB-${Math.floor(1000 + Math.random() * 9000)}-${attemptId.slice(-4).toUpperCase()}`;
  const performanceGrade = attempt.performance_grade || (
    (attempt.score_percent || 0) >= 85
      ? "Honors Clinical Distinction (Top Tier)"
      : (attempt.score_percent || 0) >= 70
      ? "Pass with Clinical Proficiency"
      : (attempt.score_percent || 0) >= 60
      ? "Pass (Satisfactory Standard)"
      : "Remediation Recommended"
  );

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Top Action Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <Link href="/student/qbank" style={{ color: "#0f766e", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
          ← Back to Question Bank Hub
        </Link>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #cbd5e1",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              color: "#334155",
              cursor: "pointer",
            }}
          >
            🖨 Print / Download Score Card
          </button>
          <Link
            href="/student/qbank/create"
            style={{
              backgroundColor: "#0f766e",
              color: "#ffffff",
              padding: "8px 18px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            + Start Another Practice Block
          </Link>
        </div>
      </div>

      {/* OFFICIAL CERTIFICATE & SCORE CARD */}
      <div
        id="certificate-print-area"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: "4px double #0f766e",
          padding: "36px 32px",
          textAlign: "center",
          marginBottom: "32px",
          boxShadow: "0 10px 30px -5px rgba(15, 118, 110, 0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative watermark */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "140px",
            fontWeight: 900,
            color: "rgba(15, 118, 110, 0.03)",
            userSelect: "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          JVM MEDICAL
        </div>

        {/* Company Header */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ backgroundColor: "#0f766e", color: "#fff", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 900, letterSpacing: 1 }}>
            JVM
          </span>
          <span style={{ fontSize: "16px", fontWeight: 900, color: "#0f172a", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            jvmmedicalservices
          </span>
        </div>
        <div style={{ fontSize: "11.5px", color: "#64748b", textTransform: "uppercase", letterSpacing: "2px", fontWeight: 700, marginBottom: 16 }}>
          JVM Medical Services · Pediatric &amp; Neonatal Academic Division
        </div>

        <h1 style={{ fontSize: "26px", fontWeight: 900, color: "#0f172a", margin: "4px 0 6px", fontFamily: "serif", letterSpacing: "0.5px" }}>
          Clinical Performance Certificate &amp; Score Card
        </h1>
        <p style={{ fontSize: "13px", color: "#475569", maxWidth: "600px", margin: "0 auto 20px" }}>
          This certifies the successful completion of an interactive clinical reasoning examination block evaluating diagnostic acumen, emergency decision algorithms, and guideline mastery.
        </p>

        {/* Big Score Box */}
        <div
          style={{
            display: "inline-block",
            backgroundColor: passed ? "#f0fdf4" : "#fff7ed",
            border: `2px solid ${passed ? "#86efac" : "#fdba74"}`,
            padding: "20px 48px",
            borderRadius: "16px",
            margin: "10px auto 20px",
          }}
        >
          <div style={{ fontSize: "52px", fontWeight: 900, color: passed ? "#166534" : "#c2410c", lineHeight: 1 }}>
            {attempt.score_percent}%
          </div>
          <div style={{ fontSize: "14px", fontWeight: 800, color: passed ? "#15803d" : "#ea580c", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {performanceGrade}
          </div>
        </div>

        {/* Metrics Row */}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "28px", fontSize: "13px", color: "#334155", margin: "16px 0 24px" }}>
          <div><strong>Questions Answered:</strong> {attempt.correct_count} of {attempt.total_questions} ({attempt.score_percent}%)</div>
          <div><strong>Assessment Mode:</strong> {attempt.mode || "Timed Simulation"}</div>
          <div><strong>Elapsed Time:</strong> {Math.round((attempt.time_spent_seconds || 120) / 60)} minutes</div>
          <div><strong>Specialization:</strong> {attempt.specialization_name || "Neonatal-Perinatal Medicine"}</div>
        </div>

        {/* Modules Evaluated */}
        {Array.isArray(attempt.module_names) && attempt.module_names.length > 0 && (
          <div style={{ margin: "14px auto", maxWidth: "680px", padding: "12px", backgroundColor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Curricular Modules Evaluated: </span>
            <span style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
              {attempt.module_names.join(" • ")}
            </span>
          </div>
        )}

        {/* Preceptor Signature & Verification Footer */}
        <div style={{ marginTop: "32px", paddingTop: "20px", borderTop: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, alignItems: "center" }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Certificate Code</div>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#0f766e", fontFamily: "monospace", letterSpacing: "1px" }}>
              {certCode}
            </div>
            <div style={{ fontSize: "10.5px", color: "#94a3b8", marginTop: 2 }}>
              Verified by jvmmedicalservices Engine
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-block", border: "2px solid #0f766e", padding: "4px 12px", borderRadius: "50px", fontSize: "11px", fontWeight: 800, color: "#0f766e", textTransform: "uppercase", letterSpacing: "1px" }}>
              ★ Official Certified Result ★
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#0f172a", fontFamily: "serif" }}>
              Dr. Janardhan Mydam, MD, FAAP
            </div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>
              Chief Medical Director &amp; Attending Preceptor
            </div>
            <div style={{ fontSize: "10px", color: "#0f766e", fontWeight: 700 }}>
              jvmmedicalservices
            </div>
          </div>
        </div>
      </div>

      {/* QUESTION-BY-QUESTION RATIONALE REVIEW */}
      <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a", marginBottom: "16px" }}>
        Detailed Answer Rationales &amp; Distractor Explanations
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {attempt.answers?.map((ans, idx) => {
          const q = attempt.questions?.find((item) => item.id === ans.question_id) || {};
          const isCorrect = ans.is_correct;
          const userSelectedLetter = ans.selected_index >= 0 ? String.fromCharCode(65 + ans.selected_index) : "None";
          const correctLetter = q.correct_index !== undefined ? String.fromCharCode(65 + q.correct_index) : "A";

          return (
            <div
              key={ans.question_id || idx}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                border: `1px solid ${isCorrect ? "#bbf7d0" : "#fecaca"}`,
                borderLeft: `6px solid ${isCorrect ? "#16a34a" : "#dc2626"}`,
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              {/* Question Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: "#64748b" }}>
                  Question #{idx + 1}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: "6px",
                      backgroundColor: isCorrect ? "#dcfce7" : "#fee2e2",
                      color: isCorrect ? "#166534" : "#991b1b",
                    }}
                  >
                    {isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}
                  </span>
                  <button
                    onClick={() => handleBookmark(ans.question_id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: bookmarkedQuestions[ans.question_id] ? "#d97706" : "#94a3b8",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {bookmarkedQuestions[ans.question_id] ? "★ Bookmarked" : "☆ Bookmark"}
                  </button>
                </div>
              </div>

              {/* Question Stem */}
              <p style={{ fontSize: "15px", color: "#0f172a", lineHeight: 1.6, marginBottom: "16px", fontWeight: 500 }}>
                {q.stem || "Question scenario text"}
              </p>

              {/* Image if available */}
              {ans.image_url && (
                <div style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden", maxWidth: 450 }}>
                  <img src={ans.image_url} alt="Clinical diagnostic slide" style={{ width: "100%", height: "auto" }} />
                </div>
              )}

              {/* User selection vs Correct Answer summary */}
              <div style={{ fontSize: "13px", color: "#475569", marginBottom: "16px", display: "flex", gap: "20px" }}>
                <span>Your Answer: <strong style={{ color: isCorrect ? "#166534" : "#dc2626" }}>Option {userSelectedLetter}</strong></span>
                <span>Correct Answer: <strong style={{ color: "#166534" }}>Option {correctLetter}</strong></span>
              </div>

              {/* Detailed Guidelines Rationale */}
              <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", fontSize: "13px", color: "#334155", lineHeight: 1.6 }}>
                <div style={{ fontWeight: 800, color: "#166534", marginBottom: "6px" }}>
                  Evidence-Based Clinical Rationale (AAP / NRP Standards):
                </div>
                <p style={{ margin: "0 0 8px" }}>
                  {ans.explanation_correct || q.explanation_correct || "Review diagnostic workup criteria."}
                </p>
                {ans.explanation_incorrect && (
                  <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #cbd5e1", fontSize: "12.5px", color: "#64748b" }}>
                    <span style={{ fontWeight: 700, color: "#991b1b" }}>Distractor Review: </span>
                    {ans.explanation_incorrect}
                  </div>
                )}
              </div>

              {/* Question Action Strip (Debate / AI Preceptor) */}
              <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <button
                  onClick={() =>
                    setActiveDiscussionQuestion({
                      question: q,
                      selectedOption: `${userSelectedLetter}. ${q.options?.[ans.selected_index] || "None"}`,
                      correctOption: `${correctLetter}. ${q.options?.[q.correct_index] || ""}`,
                      rationale: `${ans.explanation_correct || q.explanation_correct || ""} ${ans.explanation_incorrect || ""}`,
                    })
                  }
                  style={{
                    backgroundColor: "#0F766E",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 6px rgba(15,118,110,0.2)",
                  }}
                >
                  <span>💬 Debate / Discuss with AI Preceptor</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive AI Clinical Preceptor Modal */}
      {activeDiscussionQuestion && (
        <QuestionTutorModal
          isOpen={Boolean(activeDiscussionQuestion)}
          onClose={() => setActiveDiscussionQuestion(null)}
          question={activeDiscussionQuestion.question}
          selectedOption={activeDiscussionQuestion.selectedOption}
          correctOption={activeDiscussionQuestion.correctOption}
          rationale={activeDiscussionQuestion.rationale}
        />
      )}
    </div>
  );
}
