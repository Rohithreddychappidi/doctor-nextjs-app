"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import MandatoryStar from "@/components/MandatoryStar";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingId, setGradingId] = useState(null);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const loadData = async () => {
    try {
      const [subRes, clsRes] = await Promise.all([
        fetch("/api/assignments"),
        fetch("/api/classes"),
      ]);
      if (subRes.ok) {
        const subData = await subRes.json();
        setSubmissions(subData.submissions || []);
      }
      if (clsRes.ok) {
        const clsData = await clsRes.json();
        setClasses(clsData.classes || []);
      }
    } catch (e) {
      console.error("Submissions load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGrade = async (id) => {
    if (!gradeInput) {
      alert("Please enter a grade (*)");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/assignments/${id}/grade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade: gradeInput, feedback: feedbackInput }),
      });
      if (res.ok) {
        setMsg("Grade and feedback saved successfully!");
        setGradingId(null);
        setGradeInput("");
        setFeedbackInput("");
        loadData();
      }
    } catch (e) {
      alert("Failed to save grade");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="dash-head">
        <div>
          <div className="eyebrow">Faculty Grading Console</div>
          <h1>Student Assignment Submissions</h1>
          <p className="sub">Review student case writeups, EMR documentation exercises, and provide clinical grades and feedback.</p>
        </div>
      </div>

      {msg && <div className="form-note" style={{ color: "#2E7D3A", marginBottom: 20 }}>{msg}</div>}

      {loading ? (
        <p>Loading submissions...</p>
      ) : submissions.length === 0 ? (
        <p>No student submissions received yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {submissions.map((sub) => {
            const cls = classes.find((c) => c.id === sub.class_id);
            const isEditing = gradingId === sub.id;

            return (
              <div key={sub.id} className="dash-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                      <span className="pill accent">Week {cls?.week_number || "—"}</span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          backgroundColor: sub.submission_type === "group" ? "#FEF3C7" : "#EFF6FF",
                          color: sub.submission_type === "group" ? "#B45309" : "#1D4ED8",
                        }}
                      >
                        {sub.submission_type === "group" ? "👥 Group Assignment" : "👤 Individual Submission"}
                      </span>
                    </div>
                    <h3 style={{ margin: "6px 0 2px", fontSize: 18 }}>{cls?.assignment_title || cls?.title || "Clinical Assignment"}</h3>
                    <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                      Submitted by: <strong>{sub.student_name}</strong> on {new Date(sub.submitted_at).toLocaleString()}
                    </div>
                    {sub.group_members && sub.group_members.length > 0 && (
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                        👥 <strong>Co-authors / Group:</strong> {sub.group_members.join(", ")}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="pill" style={{ background: sub.grade ? "var(--green)" : "var(--gold)", color: "#fff" }}>
                      {sub.grade ? `Graded: ${sub.grade}` : "Pending Grading"}
                    </span>
                  </div>
                </div>

                <div style={{ backgroundColor: "#F7F4EE", padding: 16, borderRadius: 8, margin: "12px 0", fontSize: 14 }}>
                  <strong>Student Response:</strong>
                  <p style={{ marginTop: 6, color: "var(--ink)", whiteSpace: "pre-line" }}>{sub.submission_text}</p>
                  {sub.file_url && (
                    <div style={{ marginTop: 10 }}>
                      <a href={sub.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        &#128206; Download Student File
                      </a>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, marginTop: 16 }}>
                    <h4 style={{ marginBottom: 10 }}>Assign Grade &amp; Clinical Feedback</h4>
                    <div className="form-row">
                      <div className="field">
                        <label>
                          Grade / Score (e.g. 95/100 or Pass) <MandatoryStar />
                        </label>
                        <input
                          type="text"
                          value={gradeInput}
                          onChange={(e) => setGradeInput(e.target.value)}
                          placeholder="e.g. 95/100"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-row single">
                      <div className="field">
                        <label>Faculty Clinical Feedback</label>
                        <textarea
                          rows={3}
                          value={feedbackInput}
                          onChange={(e) => setFeedbackInput(e.target.value)}
                          placeholder="Provide constructive feedback on student's clinical analysis..."
                        />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => handleSaveGrade(sub.id)} className="btn btn-primary btn-sm" disabled={saving}>
                        {saving ? "Saving..." : "Submit Grade & Feedback"}
                      </button>
                      <button onClick={() => setGradingId(null)} className="btn btn-outline btn-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                    <div style={{ fontSize: 13.5 }}>
                      {sub.feedback ? (
                        <span><strong>Faculty Feedback:</strong> {sub.feedback}</span>
                      ) : (
                        <span style={{ color: "var(--muted)" }}>No feedback entered yet.</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setGradingId(sub.id);
                        setGradeInput(sub.grade || "");
                        setFeedbackInput(sub.feedback || "");
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      {sub.grade ? "Edit Grade" : "Enter Grade"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
