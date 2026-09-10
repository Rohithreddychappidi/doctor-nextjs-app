"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MockTestTakerPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const testId = resolvedParams.id;

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Test session states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: optionIndex }
  const [flagged, setFlagged] = useState({}); // { [questionId]: boolean }
  const [timeLeft, setTimeLeft] = useState(900); // seconds
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Load test data
  useEffect(() => {
    async function loadTest() {
      try {
        const res = await fetch(`/api/tests/${testId}`);
        if (!res.ok) throw new Error("Mock test not found or failed to load");
        const data = await res.json();
        setTest(data.test);
        setQuestions(data.questions || []);
        setTimeLeft((data.test.duration_minutes || 15) * 60);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [testId]);

  const handleSelectOption = (qId, optionIdx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleToggleFlag = (qId) => {
    setFlagged((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmitTest = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      const timeSpent = test ? (test.duration_minutes * 60) - timeLeft : 0;
      const res = await fetch(`/api/tests/${testId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          time_spent_seconds: timeSpent,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit test");

      setResult(data);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      alert("Submission error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (submitted || loading || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest(); // Auto-submit on time expiry
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, loading, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="section center" style={{ minHeight: "60vh" }}>
        <p className="lede">Preparing exam environment...</p>
      </div>
    );
  }

  if (error || !test || questions.length === 0) {
    return (
      <div className="section center" style={{ minHeight: "60vh" }}>
        <h2>Test Unavailable</h2>
        <p className="lede" style={{ margin: "16px auto" }}>{error || "No questions found for this examination."}</p>
        <Link href="/question-banks" className="btn btn-primary">Return to Question Banks</Link>
      </div>
    );
  }

  // ==========================================
  // RESULTS SCREEN (AFTER SUBMISSION)
  // ==========================================
  if (submitted && result) {
    return (
      <div style={{ backgroundColor: "#F7F4EE", minHeight: "90vh", padding: "40px 0 80px" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          {/* Results Summary Card */}
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "40px 30px",
              marginBottom: 36,
              borderTop: `6px solid ${result.passed ? "#2E7D3A" : "#8A2A34"}`,
            }}
          >
            <span
              className="pill"
              style={{
                backgroundColor: result.passed ? "rgba(46, 125, 58, 0.15)" : "rgba(138, 42, 52, 0.15)",
                color: result.passed ? "#2E7D3A" : "#8A2A34",
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 14,
              }}
            >
              {result.passed ? "EXAMINATION PASSED" : "REVIEW RECOMMENDED"}
            </span>

            <h1 style={{ fontSize: "2.4rem", margin: "10px 0" }}>{test.title}</h1>
            <p style={{ color: "var(--ink-soft)", fontSize: 15 }}>Performance &amp; Comprehensive Answer Rationales</p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                margin: "30px 0",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: "3rem", fontWeight: "bold", color: result.passed ? "#2E7D3A" : "#8A2A34", fontFamily: "var(--font-mono)" }}>
                  {result.score}%
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase" }}>Overall Score</div>
              </div>
              <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 40 }}>
                <div style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--bg-navy)", fontFamily: "var(--font-mono)" }}>
                  {result.correctCount} / {result.totalQuestions}
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase" }}>Correct Answers</div>
              </div>
              <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 40 }}>
                <div style={{ fontSize: "3rem", fontWeight: "bold", color: "var(--gold)", fontFamily: "var(--font-mono)" }}>
                  {formatTime(result.timeSpentSeconds || 0)}
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase" }}>Time Completed</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
              <Link href="/student-dashboard" className="btn btn-primary">Go to Student Dashboard</Link>
              <Link href="/question-banks" className="btn btn-outline">Take Another Mock Test</Link>
            </div>
          </div>

          {/* Question-by-Question Review with In-Depth Rationales */}
          <div className="section-head" style={{ marginBottom: 20 }}>
            <div>
              <div className="eyebrow">Exhaustive Review</div>
              <h2>Answer Rationales &amp; Distractor Explanations</h2>
            </div>
            <p className="lede">
              Medical education requires knowing not only why the right answer is correct, but why each distractor is incorrect.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {result.reviews.map((q, idx) => (
              <div
                key={q.id}
                className="card"
                style={{
                  borderLeft: `5px solid ${q.isCorrect ? "#2E7D3A" : "#8A2A34"}`,
                  padding: "28px 32px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="pill accent">Question {idx + 1}</span>
                  <span
                    className="pill"
                    style={{
                      backgroundColor: q.isCorrect ? "#E8F5E9" : "#FFEBEE",
                      color: q.isCorrect ? "#2E7D3A" : "#8A2A34",
                      fontWeight: 700,
                    }}
                  >
                    {q.isCorrect ? "CORRECT" : "INCORRECT"}
                  </span>
                </div>

                <p style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", lineHeight: 1.6, marginBottom: 20 }}>
                  {q.stem}
                </p>

                {/* Options List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = q.selectedOption !== null && Number(q.selectedOption) === optIdx;
                    const isTheCorrectOne = Number(q.correctIndex) === optIdx;

                    let bg = "#FFFFFF";
                    let border = "1px solid var(--border)";
                    let tag = null;

                    if (isTheCorrectOne) {
                      bg = "#E8F5E9";
                      border = "2px solid #2E7D3A";
                      tag = <span style={{ color: "#2E7D3A", fontWeight: 700, fontSize: 12, marginLeft: 8 }}>&#10003; Correct Answer</span>;
                    } else if (isSelected && !isTheCorrectOne) {
                      bg = "#FFEBEE";
                      border = "2px solid #8A2A34";
                      tag = <span style={{ color: "#8A2A34", fontWeight: 700, fontSize: 12, marginLeft: 8 }}>&#10007; Your Choice</span>;
                    }

                    return (
                      <div
                        key={optIdx}
                        style={{
                          padding: "12px 16px",
                          borderRadius: 6,
                          backgroundColor: bg,
                          border,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          fontSize: 14.5,
                        }}
                      >
                        <div>
                          <strong>{String.fromCharCode(65 + optIdx)}. </strong>
                          <span>{opt}</span>
                        </div>
                        {tag}
                      </div>
                    );
                  })}
                </div>

                {/* RATIONALE: WHY CORRECT */}
                {q.explanationCorrect && (
                  <div style={{ backgroundColor: "#E8F5E9", padding: "16px 18px", borderRadius: 8, marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, color: "#1B5E20", fontSize: 14, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>&#128161;</span> Rationale for Correct Answer:
                    </div>
                    <p style={{ color: "#1E3B20", fontSize: 14, lineHeight: 1.55 }}>
                      {q.explanationCorrect}
                    </p>
                  </div>
                )}

                {/* RATIONALE: WHY INCORRECT (DISTRACTORS) */}
                {q.explanationIncorrect && (
                  <div style={{ backgroundColor: "#F7F4EE", padding: "16px 18px", borderRadius: 8 }}>
                    <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: 14, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                      <span>&#128269;</span> Why the Distractors are Incorrect:
                    </div>
                    <p style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-line" }}>
                      {q.explanationIncorrect}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE TEST TAKER SCREEN
  // ==========================================
  const currentQ = questions[currentIndex];
  const currentSelected = answers[currentQ?.id];
  const isFlagged = Boolean(flagged[currentQ?.id]);
  const answeredCount = Object.keys(answers).length;

  return (
    <div style={{ backgroundColor: "#F7F4EE", minHeight: "95vh", padding: "24px 0 60px" }}>
      <div className="container">
        {/* Exam Navigation Header & Timer */}
        <div
          style={{
            backgroundColor: "#12203B",
            color: "#FFFFFF",
            borderRadius: 10,
            padding: "16px 24px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#E9C989", textTransform: "uppercase", letterSpacing: 1 }}>
              Official Clinical Reasoning Exam
            </span>
            <h2 style={{ color: "#FFFFFF", fontSize: "1.35rem", margin: "2px 0 0" }}>{test.title}</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Time Remaining</div>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  fontFamily: "var(--font-mono)",
                  color: timeLeft < 180 ? "#FF5252" : "#FFFFFF",
                }}
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm(`Are you ready to submit your exam? You have answered ${answeredCount} of ${questions.length} questions.`)) {
                  handleSubmitTest();
                }
              }}
              className="btn btn-gold btn-sm"
              disabled={submitting}
            >
              {submitting ? "Grading..." : "Submit Exam"}
            </button>
          </div>
        </div>

        {/* Test Grid: Navigator Left / Question Right */}
        <div className="grid" style={{ gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "start" }}>
          {/* Question Navigator Sidebar */}
          <div className="card" style={{ padding: "18px 20px" }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 14, textTransform: "uppercase", color: "var(--bg-navy)" }}>
              Question Navigator
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 18 }}>
              {questions.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isFlag = flagged[q.id];
                const isCurrent = idx === currentIndex;

                let bg = "#F7F4EE";
                let text = "var(--ink)";
                let border = "1px solid var(--border)";

                if (isCurrent) {
                  border = "2px solid var(--bg-navy)";
                  bg = "#FFFFFF";
                }
                if (isAnswered) {
                  bg = "#1B2E52";
                  text = "#FFFFFF";
                }
                if (isFlag) {
                  border = "2px solid var(--gold)";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      background: bg,
                      color: text,
                      border,
                      borderRadius: 6,
                      padding: "8px 0",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    {idx + 1}
                    {isFlag && (
                      <span style={{ position: "absolute", top: 1, right: 3, fontSize: 8, color: "var(--gold)" }}>&#9873;</span>
                    )}
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, backgroundColor: "#1B2E52", borderRadius: 2 }}></span>
                <span>Answered ({answeredCount})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, border: "2px solid var(--gold)", borderRadius: 2 }}></span>
                <span>Flagged for review ({Object.values(flagged).filter(Boolean).length})</span>
              </div>
            </div>
          </div>

          {/* Active Question Display */}
          <div className="card" style={{ padding: "32px 36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <span className="pill accent">Question {currentIndex + 1} of {questions.length}</span>
                <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 12 }}>
                  Subject: {currentQ?.subject} · Level {currentQ?.level}
                </span>
              </div>
              <button
                onClick={() => handleToggleFlag(currentQ?.id)}
                style={{
                  background: isFlagged ? "rgba(180, 131, 42, 0.15)" : "transparent",
                  border: "1px solid var(--gold)",
                  color: "var(--gold)",
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>{isFlagged ? "&#9873; Flagged" : "&#9872; Flag for Review"}</span>
              </button>
            </div>

            {/* Vignette Stem */}
            <p style={{ fontSize: 16.5, lineHeight: 1.65, color: "var(--ink)", marginBottom: 28, fontWeight: 400 }}>
              {currentQ?.stem}
            </p>

            {/* Multiple Choice Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
              {currentQ?.options?.map((opt, optIdx) => {
                const isSelected = currentSelected === optIdx;
                return (
                  <label
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      padding: "14px 18px",
                      borderRadius: 8,
                      border: isSelected ? "2px solid #8A2A34" : "1px solid var(--border)",
                      backgroundColor: isSelected ? "#F4E4E1" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <input
                      type="radio"
                      name={`q_${currentQ.id}`}
                      checked={isSelected}
                      onChange={() => handleSelectOption(currentQ.id, optIdx)}
                      style={{ marginTop: 4 }}
                    />
                    <div style={{ fontSize: 15, color: "var(--ink)", lineHeight: 1.45 }}>
                      <strong>{String.fromCharCode(65 + optIdx)}. </strong>
                      {opt}
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Footer Navigation Buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 20 }}>
              <button
                onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
                disabled={currentIndex === 0}
                className="btn btn-outline btn-sm"
              >
                &larr; Previous Question
              </button>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((idx) => Math.min(questions.length - 1, idx + 1))}
                  className="btn btn-primary btn-sm"
                >
                  Next Question &rarr;
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm(`Submit your exam now? Answered: ${answeredCount}/${questions.length}`)) {
                      handleSubmitTest();
                    }
                  }}
                  className="btn btn-gold btn-sm"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Finish & Submit Exam"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
