"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

export default function QBankResultsPage({ params }) {
  const resolvedParams = use(params);
  const attemptId = resolvedParams.attemptId;

  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});

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

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Calculating score and generating medical rationales...</div>;
  if (!attempt) return <div style={{ padding: "40px" }}>Results not found.</div>;

  const passed = (attempt.score_percent || 0) >= 70;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Score Card Header */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E6E2D8", padding: "32px", textAlign: "center", marginBottom: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px", color: "#767C87", fontWeight: 700 }}>
          Exam Performance Report
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#12203B", margin: "4px 0 12px" }}>
          {attempt.title}
        </h2>

        <div style={{ display: "inline-block", backgroundColor: passed ? "#E8F5E9" : "#FFF3E0", padding: "16px 36px", borderRadius: "8px", margin: "10px auto 16px" }}>
          <div style={{ fontSize: "42px", fontWeight: 900, color: passed ? "#2E7D3A" : "#D84315" }}>
            {attempt.score_percent}%
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: passed ? "#2E7D3A" : "#D84315" }}>
            {passed ? "✓ PASSING STANDARD ACHIEVED" : "⚠️ REMEDIATION RECOMMENDED"}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "24px", fontSize: "13px", color: "#4B505C", marginTop: "8px" }}>
          <span><strong>Correct:</strong> {attempt.correct_count} of {attempt.total_questions}</span>
          <span><strong>Time Spent:</strong> {Math.round((attempt.time_spent_seconds || 120) / 60)} min</span>
          <span><strong>Mode:</strong> {attempt.mode}</span>
        </div>

        <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "12px" }}>
          <Link
            href="/student/qbank/create"
            style={{ backgroundColor: "#8A2A34", color: "#FFFFFF", padding: "10px 22px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}
          >
            Start Another Block →
          </Link>
          <Link
            href="/student/qbank"
            style={{ backgroundColor: "#FFFFFF", color: "#12203B", border: "1px solid #CBD2E1", padding: "10px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
          >
            Back to QBank Hub
          </Link>
        </div>
      </div>

      {/* Question-by-Question Review with Rationales */}
      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#12203B", marginBottom: "16px" }}>
        Detailed Answer Rationales &amp; Distractor Explanations
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {attempt.answers?.map((ans, idx) => {
          const q = attempt.questions.find((item) => item.id === ans.question_id);
          if (!q) return null;
          const isCorrect = ans.is_correct;
          const userSelectedLetter = ans.selected_index >= 0 ? String.fromCharCode(65 + ans.selected_index) : "None";
          const correctLetter = String.fromCharCode(65 + q.correct_index);

          return (
            <div
              key={ans.question_id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: `1px solid ${isCorrect ? "#C8E6C9" : "#FFCDD2"}`,
                borderLeft: `6px solid ${isCorrect ? "#2E7D3A" : "#C62828"}`,
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              {/* Question Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: isCorrect ? "#2E7D3A" : "#C62828" }}>
                  {isCorrect ? "✓ Question " + (idx + 1) + " Correct" : "✗ Question " + (idx + 1) + " Incorrect"}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", backgroundColor: "#F7F4EE", color: "#12203B", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                    {q.subject}
                  </span>
                  <button
                    onClick={() => handleBookmark(q.id)}
                    style={{
                      background: "none",
                      border: "1px solid #CBD2E1",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer",
                      color: bookmarkedQuestions[q.id] ? "#B4832A" : "#4B505C",
                      fontWeight: 600,
                    }}
                  >
                    {bookmarkedQuestions[q.id] ? "★ Bookmarked" : "☆ Bookmark"}
                  </button>
                </div>
              </div>

              {/* Stem */}
              <div style={{ fontSize: "14px", color: "#171A21", lineHeight: 1.6, marginBottom: "16px", fontWeight: 500 }}>
                {q.stem}
              </div>

              {/* Options Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                {q.options.map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isUserChoice = ans.selected_index === optIdx;
                  const isCorrectChoice = q.correct_index === optIdx;

                  let optBg = "#FFFFFF";
                  let optBorder = "#E6E2D8";
                  let labelColor = "#4B505C";

                  if (isCorrectChoice) {
                    optBg = "#E8F5E9";
                    optBorder = "#81C784";
                    labelColor = "#2E7D3A";
                  } else if (isUserChoice && !isCorrect) {
                    optBg = "#FFEBEE";
                    optBorder = "#E57373";
                    labelColor = "#C62828";
                  }

                  return (
                    <div
                      key={optIdx}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "6px",
                        border: `1px solid ${optBorder}`,
                        backgroundColor: optBg,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontSize: "13px",
                      }}
                    >
                      <strong style={{ color: labelColor }}>{letter}.</strong>
                      <span style={{ flex: 1, color: "#171A21" }}>{opt}</span>
                      {isCorrectChoice && <span style={{ fontWeight: 700, color: "#2E7D3A", fontSize: "12px" }}>✓ Correct Answer</span>}
                      {isUserChoice && !isCorrect && <span style={{ fontWeight: 700, color: "#C62828", fontSize: "12px" }}>✗ Your Choice</span>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Section */}
              <div style={{ backgroundColor: "#F9F8F5", borderRadius: "8px", padding: "18px", border: "1px solid #E6E2D8" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#2E7D3A", marginBottom: "6px" }}>
                  Why Option {correctLetter} is Correct:
                </div>
                <div style={{ fontSize: "13px", color: "#171A21", lineHeight: 1.6, marginBottom: "14px" }}>
                  {ans.explanation_correct || q.explanation_correct}
                </div>

                <div style={{ fontSize: "12px", fontWeight: 700, color: "#8A2A34", borderTop: "1px solid #E6E2D8", paddingTop: "10px", marginBottom: "4px" }}>
                  Why the Distractor Options are Wrong:
                </div>
                <div style={{ fontSize: "12px", color: "#4B505C", whiteSpace: "pre-line", lineHeight: 1.5 }}>
                  {ans.explanation_incorrect || q.explanation_incorrect}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
