"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateQBankBlockPage() {
  const router = useRouter();

  const [title, setTitle] = useState("Custom Practice Exam Block");
  const [mode, setMode] = useState("Timed");
  const [questionCount, setQuestionCount] = useState("5");
  const [subject, setSubject] = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/student/qbank/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          mode,
          questionCount: Number(questionCount),
          subject,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create practice block");

      router.push(`/student/qbank/test/${data.attempt.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/student/qbank" style={{ color: "#8A2A34", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
          ← Back to Question Bank
        </Link>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#12203B", margin: "8px 0 4px" }}>
          Create Practice Exam Block
        </h2>
        <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
          Configure an exam block customized to your target exam and study focus.
        </p>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E6E2D8", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        {error && (
          <div style={{ padding: "12px", backgroundColor: "#FFEBEE", color: "#C62828", borderRadius: "6px", fontSize: "13px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCreate}>
          {/* Test Name */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>
              Exam Block Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "14px" }}
            />
          </div>

          {/* Test Mode */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>
              Exam Mode
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div
                onClick={() => setMode("Timed")}
                style={{
                  padding: "14px",
                  borderRadius: "6px",
                  border: mode === "Timed" ? "2px solid #8A2A34" : "1px solid #CBD2E1",
                  backgroundColor: mode === "Timed" ? "#FFF5F5" : "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#12203B" }}>⏱ Timed Mode</div>
                <div style={{ fontSize: "12px", color: "#4B505C", marginTop: "4px" }}>
                  Official exam simulation with countdown timer and full rationale review after submission.
                </div>
              </div>

              <div
                onClick={() => setMode("Tutor")}
                style={{
                  padding: "14px",
                  borderRadius: "6px",
                  border: mode === "Tutor" ? "2px solid #8A2A34" : "1px solid #CBD2E1",
                  backgroundColor: mode === "Tutor" ? "#FFF5F5" : "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#12203B" }}>📖 Tutor Mode</div>
                <div style={{ fontSize: "12px", color: "#4B505C", marginTop: "4px" }}>
                  Learn as you go: view in-depth correct and distractor rationales after each question.
                </div>
              </div>
            </div>
          </div>

          {/* Subject Filter */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>
              Subject Category
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "14px", backgroundColor: "#FFFFFF" }}
            >
              <option value="All">All Subjects (Comprehensive Mix)</option>
              <option value="Neonatology">Neonatology &amp; Delivery Room Care</option>
              <option value="Pediatrics">Pediatrics &amp; Critical Care</option>
              <option value="Biostatistics">Biostatistics &amp; Epidemiology</option>
            </select>
          </div>

          {/* Question Count */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>
              Number of Questions
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              {["3", "5", "10"].map((cnt) => (
                <button
                  type="button"
                  key={cnt}
                  onClick={() => setQuestionCount(cnt)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "6px",
                    border: questionCount === cnt ? "2px solid #8A2A34" : "1px solid #CBD2E1",
                    backgroundColor: questionCount === cnt ? "#8A2A34" : "#FFFFFF",
                    color: questionCount === cnt ? "#FFFFFF" : "#12203B",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              backgroundColor: "#8A2A34",
              color: "#FFFFFF",
              border: "none",
              padding: "14px",
              borderRadius: "6px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Generating Exam Block..." : "Start Practice Block →"}
          </button>
        </form>
      </div>
    </div>
  );
}
