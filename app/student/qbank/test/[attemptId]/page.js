"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TakeQBankTestPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const attemptId = resolvedParams.attemptId;

  const [attempt, setAttempt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [question_id]: selected_index }
  const [flagged, setFlagged] = useState({});
  const [showTutorRationale, setShowTutorRationale] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 mins default
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttempt() {
      try {
        const res = await fetch(`/api/student/qbank/test/${attemptId}`);
        if (res.ok) {
          const json = await res.json();
          setAttempt(json.attempt);
          if (json.attempt.questions?.length) {
            setSecondsRemaining(json.attempt.questions.length * 90); // 90s per question
          }
        }
      } catch (e) {
        console.error("Test load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [attemptId]);

  // Timer countdown for timed mode
  useEffect(() => {
    if (!attempt || attempt.mode !== "Timed") return;
    if (secondsRemaining <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [attempt, secondsRemaining]);

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleToggleFlag = (questionId) => {
    setFlagged((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmit = async () => {
    if (!attempt) return;
    setSubmitting(true);
    try {
      const answersPayload = attempt.questions.map((q) => ({
        question_id: q.id,
        selected_index: selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1,
      }));

      const totalTime = (attempt.questions.length * 90) - Math.max(secondsRemaining, 0);

      const res = await fetch(`/api/student/qbank/test/${attemptId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answersPayload,
          time_spent_seconds: totalTime,
        }),
      });

      if (res.ok) {
        router.push(`/student/qbank/results/${attemptId}`);
      }
    } catch (e) {
      console.error("Submission error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Preparing exam block...</div>;
  if (!attempt || !attempt.questions?.length) return <div style={{ padding: "40px" }}>Exam block not found.</div>;

  const currentQ = attempt.questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const isSelected = (idx) => selectedAnswers[currentQ.id] === idx;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Top Test Navigation Bar */}
      <div style={{ backgroundColor: "#12203B", color: "#FFFFFF", padding: "14px 24px", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#E9C989", fontWeight: 700 }}>
            {attempt.title} ({attempt.mode} Mode)
          </div>
          <div style={{ fontSize: "15px", fontWeight: 700, marginTop: "2px" }}>
            Question {currentIndex + 1} of {attempt.questions.length}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {attempt.mode === "Timed" && (
            <div style={{ backgroundColor: "rgba(255,255,255,0.1)", padding: "6px 14px", borderRadius: "6px", fontSize: "14px", fontWeight: 700, color: secondsRemaining < 60 ? "#F87171" : "#FFFFFF" }}>
              ⏱ {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          )}

          <button
            onClick={() => handleToggleFlag(currentQ.id)}
            style={{
              backgroundColor: flagged[currentQ.id] ? "#B4832A" : "rgba(255,255,255,0.12)",
              color: "#FFFFFF",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {flagged[currentQ.id] ? "🚩 Flagged" : "🏳 Flag for Review"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              backgroundColor: "#8A2A34",
              color: "#FFFFFF",
              border: "none",
              padding: "8px 18px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {submitting ? "Grading..." : "Submit Block"}
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E6E2D8", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: "20px" }}>
        {/* Question Metadata */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", backgroundColor: "#F7F4EE", color: "#12203B", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, border: "1px solid #E6E2D8" }}>
            {currentQ.subject}
          </span>
          <span style={{ fontSize: "11px", backgroundColor: "#F7F4EE", color: "#4B505C", padding: "2px 8px", borderRadius: "4px", border: "1px solid #E6E2D8" }}>
            System: {currentQ.system}
          </span>
          <span style={{ fontSize: "11px", backgroundColor: "#F7F4EE", color: "#4B505C", padding: "2px 8px", borderRadius: "4px", border: "1px solid #E6E2D8" }}>
            {currentQ.exam}
          </span>
        </div>

        {/* Clinical Vignette Stem */}
        <div style={{ fontSize: "15px", color: "#171A21", lineHeight: 1.7, fontWeight: 500, marginBottom: "24px" }}>
          {currentQ.stem}
        </div>

        {/* Answer Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {currentQ.options.map((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            const selected = isSelected(optIdx);
            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "14px",
                  padding: "14px 18px",
                  borderRadius: "8px",
                  border: selected ? "2px solid #8A2A34" : "1px solid #E6E2D8",
                  backgroundColor: selected ? "#FFF5F5" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.1s ease",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: selected ? "#8A2A34" : "#F0ECE1",
                    color: selected ? "#FFFFFF" : "#12203B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  {letter}
                </span>
                <span style={{ fontSize: "14px", color: "#171A21", lineHeight: 1.5, marginTop: "3px" }}>
                  {opt}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tutor Mode Immediate Rationale Toggle */}
        {attempt.mode === "Tutor" && (
          <div style={{ marginTop: "20px", borderTop: "1px solid #F0ECE1", paddingTop: "16px" }}>
            {!showTutorRationale[currentQ.id] ? (
              <button
                onClick={() => setShowTutorRationale((prev) => ({ ...prev, [currentQ.id]: true }))}
                style={{ backgroundColor: "#12203B", color: "#FFFFFF", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
              >
                💡 Show Answer &amp; Explanations
              </button>
            ) : (
              <div style={{ backgroundColor: "#F7F4EE", padding: "18px", borderRadius: "8px", borderLeft: "4px solid #2E7D3A" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#2E7D3A", marginBottom: "8px" }}>
                  Correct Answer: Option {String.fromCharCode(65 + currentQ.correct_index)}
                </div>
                <div style={{ fontSize: "13px", color: "#171A21", lineHeight: 1.6, marginBottom: "12px" }}>
                  {currentQ.explanation_correct}
                </div>
                <div style={{ fontSize: "12px", color: "#4B505C", whiteSpace: "pre-line", lineHeight: 1.5, borderTop: "1px solid #E6E2D8", paddingTop: "8px" }}>
                  {currentQ.explanation_incorrect}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#FFFFFF", padding: "16px 24px", borderRadius: "8px", border: "1px solid #E6E2D8", flexWrap: "wrap", gap: "12px" }}>
        <button
          onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
          disabled={currentIndex === 0}
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #CBD2E1",
            color: "#12203B",
            padding: "8px 18px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            opacity: currentIndex === 0 ? 0.5 : 1,
          }}
        >
          ← Previous
        </button>

        {/* Question Selector Strip */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {attempt.questions.map((q, idx) => {
            const hasAnswer = selectedAnswers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            const isFlag = flagged[q.id];
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                  border: isCurrent ? "2px solid #8A2A34" : "1px solid #CBD2E1",
                  backgroundColor: hasAnswer ? "#12203B" : "#FFFFFF",
                  color: hasAnswer ? "#FFFFFF" : "#12203B",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                {idx + 1}
                {isFlag && (
                  <span style={{ position: "absolute", top: "-4px", right: "-4px", fontSize: "9px" }}>🚩</span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            if (currentIndex < attempt.questions.length - 1) {
              setCurrentIndex((prev) => prev + 1);
            } else {
              handleSubmit();
            }
          }}
          style={{
            backgroundColor: currentIndex === attempt.questions.length - 1 ? "#8A2A34" : "#12203B",
            color: "#FFFFFF",
            border: "none",
            padding: "8px 18px",
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {currentIndex === attempt.questions.length - 1 ? "Finish & Submit Block →" : "Next →"}
        </button>
      </div>
    </div>
  );
}
