"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import MandatoryStar from "@/components/MandatoryStar";
import ExportButton from "@/components/ExportButton";

export default function AdminTestsPage() {
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("tests"); // "tests" | "questions"

  // Question Form
  const [qData, setQData] = useState({
    subject: "Neonatology",
    level: 2,
    stem: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct_index: 0,
    explanation_correct: "",
    explanation_incorrect: "",
  });

  // Test Form
  const [tData, setTData] = useState({
    title: "",
    subject: "Pediatrics & Neonatology",
    duration_minutes: 15,
    passing_score: 70,
    is_free: true,
    description: "",
    selectedQuestions: [],
  });

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const loadAll = async () => {
    try {
      const [qRes, tRes] = await Promise.all([
        fetch("/api/questions"),
        fetch("/api/tests"),
      ]);
      if (qRes.ok) {
        const d = await qRes.json();
        setQuestions(d.questions || []);
      }
      if (tRes.ok) {
        const d = await tRes.json();
        setTests(d.tests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!qData.stem || !qData.optionA || !qData.optionB || !qData.explanation_correct) {
      setErr("Stem, at least Options A & B, and correct answer explanation are mandatory (*)");
      return;
    }

    setSaving(true);
    try {
      const options = [qData.optionA, qData.optionB];
      if (qData.optionC) options.push(qData.optionC);
      if (qData.optionD) options.push(qData.optionD);

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: qData.subject,
          level: Number(qData.level),
          stem: qData.stem,
          options,
          correct_index: Number(qData.correct_index),
          explanation_correct: qData.explanation_correct,
          explanation_incorrect: qData.explanation_incorrect,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to add question");

      setMsg("Question added to question bank successfully!");
      setQData({
        subject: "Neonatology",
        level: 2,
        stem: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correct_index: 0,
        explanation_correct: "",
        explanation_incorrect: "",
      });
      loadAll();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddTest = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!tData.title || tData.selectedQuestions.length === 0) {
      setErr("Test title and at least one selected question are mandatory (*)");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: tData.title,
          subject: tData.subject,
          duration_minutes: Number(tData.duration_minutes),
          passing_score: Number(tData.passing_score),
          is_free: tData.is_free,
          description: tData.description,
          question_ids: tData.selectedQuestions,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to create mock test");

      setMsg("Mock test created and published successfully!");
      setTData({
        title: "",
        subject: "Pediatrics & Neonatology",
        duration_minutes: 15,
        passing_score: 70,
        is_free: true,
        description: "",
        selectedQuestions: [],
      });
      loadAll();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="dash-head">
        <div>
          <div className="eyebrow">Priority 2 Module</div>
          <h1>Question Bank &amp; Online Mock Test Engine</h1>
          <p className="sub">
            Create clinical reasoning mock exams, write high-yield vignettes with answer rationales, and export student performance data.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ExportButton type="tests" label="Export Test Attempts (CSV)" />
        </div>
      </div>

      {msg && <div className="form-note" style={{ color: "#2E7D3A", marginBottom: 20 }}>{msg}</div>}
      {err && <div className="form-note error" style={{ color: "#8A2A34", marginBottom: 20 }}>{err}</div>}

      <div style={{ display: "flex", gap: 12, borderBottom: "2px solid #E6E2D8", marginBottom: 24 }}>
        <button
          onClick={() => setActiveView("tests")}
          style={{
            background: "transparent",
            border: "none",
            padding: "8px 16px",
            fontWeight: 600,
            fontSize: 15,
            color: activeView === "tests" ? "var(--accent)" : "var(--muted)",
            borderBottom: activeView === "tests" ? "3px solid var(--accent)" : "3px solid transparent",
            cursor: "pointer",
          }}
        >
          Mock Tests ({tests.length})
        </button>
        <button
          onClick={() => setActiveView("questions")}
          style={{
            background: "transparent",
            border: "none",
            padding: "8px 16px",
            fontWeight: 600,
            fontSize: 15,
            color: activeView === "questions" ? "var(--accent)" : "var(--muted)",
            borderBottom: activeView === "questions" ? "3px solid var(--accent)" : "3px solid transparent",
            cursor: "pointer",
          }}
        >
          Question Bank ({questions.length})
        </button>
      </div>

      {/* VIEW 1: MOCK TESTS */}
      {activeView === "tests" && (
        <div>
          {/* Create Test Card */}
          <div className="dash-card" style={{ marginBottom: 30 }}>
            <h3 style={{ marginBottom: 16 }}>Create New Mock Test</h3>
            <form onSubmit={handleAddTest}>
              <div className="form-row">
                <div className="field">
                  <label>
                    Test Title <MandatoryStar />
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neonatal-Perinatal Board Style Exam 1"
                    value={tData.title}
                    onChange={(e) => setTData({ ...tData, title: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Subject Focus</label>
                  <input
                    type="text"
                    placeholder="e.g. Neonatology"
                    value={tData.subject}
                    onChange={(e) => setTData({ ...tData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label>Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={tData.duration_minutes}
                    onChange={(e) => setTData({ ...tData, duration_minutes: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Passing Score (%)</label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={tData.passing_score}
                    onChange={(e) => setTData({ ...tData, passing_score: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Free Promotional Practice?</label>
                  <select
                    value={tData.is_free ? "true" : "false"}
                    onChange={(e) => setTData({ ...tData, is_free: e.target.value === "true" })}
                  >
                    <option value="true">Yes (Free Practice Test)</option>
                    <option value="false">No (Premium)</option>
                  </select>
                </div>
              </div>

              <div className="form-row single">
                <div className="field">
                  <label>Test Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe what clinical competencies are tested..."
                    value={tData.description}
                    onChange={(e) => setTData({ ...tData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Select Questions */}
              <div style={{ backgroundColor: "#F7F4EE", padding: 18, borderRadius: 8, margin: "16px 0" }}>
                <h4 style={{ margin: "0 0 10px", fontSize: 14 }}>
                  Select Questions for this Test <MandatoryStar /> ({tData.selectedQuestions.length} selected)
                </h4>
                <div style={{ maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                  {questions.map((q) => {
                    const isChecked = tData.selectedQuestions.includes(q.id);
                    return (
                      <label
                        key={q.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          fontSize: 13.5,
                          cursor: "pointer",
                          backgroundColor: isChecked ? "#E8F5E9" : "#FFFFFF",
                          padding: "8px 12px",
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTData({ ...tData, selectedQuestions: [...tData.selectedQuestions, q.id] });
                            } else {
                              setTData({
                                ...tData,
                                selectedQuestions: tData.selectedQuestions.filter((id) => id !== q.id),
                              });
                            }
                          }}
                        />
                        <div>
                          <strong>[{q.subject} · Level {q.level}]</strong> {q.stem.slice(0, 100)}...
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Publishing Test..." : "Create & Publish Mock Test"}
              </button>
            </form>
          </div>

          {/* Active Tests List */}
          <h3>Active Mock Examinations</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
            {tests.map((t) => (
              <div key={t.id} className="dash-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span className="pill accent">{t.is_free ? "FREE" : "PAID"}</span>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{t.duration_minutes} Mins · Pass {t.passing_score}%</span>
                  </div>
                  <h4 style={{ margin: "2px 0 4px", fontSize: 16 }}>{t.title}</h4>
                  <p style={{ fontSize: 13, color: "var(--ink-soft)" }}>{t.question_ids?.length || 0} Questions · {t.subject}</p>
                </div>
                <div>
                  <a href={`/mock-tests/${t.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    Preview Exam &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: QUESTION BANK */}
      {activeView === "questions" && (
        <div>
          {/* Add Question Form */}
          <div className="dash-card" style={{ marginBottom: 30 }}>
            <h3 style={{ marginBottom: 16 }}>Add Question with Comprehensive Rationales</h3>
            <form onSubmit={handleAddQuestion}>
              <div className="form-row">
                <div className="field">
                  <label>
                    Subject <MandatoryStar />
                  </label>
                  <select
                    value={qData.subject}
                    onChange={(e) => setQData({ ...qData, subject: e.target.value })}
                  >
                    <option value="Neonatology">Neonatology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Biostatistics">Biostatistics</option>
                  </select>
                </div>
                <div className="field">
                  <label>Learning Level</label>
                  <select
                    value={qData.level}
                    onChange={(e) => setQData({ ...qData, level: Number(e.target.value) })}
                  >
                    <option value={1}>Level 1: Medical School &amp; Shelf</option>
                    <option value={2}>Level 2: USMLE Clinical Reasoning</option>
                    <option value={3}>Level 3: Pediatrics Board Preparation</option>
                    <option value={4}>Level 4: Neonatal-Perinatal Boards</option>
                  </select>
                </div>
              </div>

              <div className="form-row single">
                <div className="field">
                  <label>
                    Clinical Vignette / Question Stem <MandatoryStar />
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter clinical vignette (patient age, presentation, labs, imaging, question)..."
                    value={qData.stem}
                    onChange={(e) => setQData({ ...qData, stem: e.target.value })}
                  />
                </div>
              </div>

              {/* Multiple Choice Options */}
              <div style={{ backgroundColor: "#F7F4EE", padding: 18, borderRadius: 8, margin: "16px 0" }}>
                <h4 style={{ margin: "0 0 12px", fontSize: 14 }}>Options &amp; Correct Answer</h4>
                <div className="form-row">
                  <div className="field">
                    <label>
                      Option A <MandatoryStar />
                    </label>
                    <input
                      type="text"
                      required
                      value={qData.optionA}
                      onChange={(e) => setQData({ ...qData, optionA: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>
                      Option B <MandatoryStar />
                    </label>
                    <input
                      type="text"
                      required
                      value={qData.optionB}
                      onChange={(e) => setQData({ ...qData, optionB: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="field">
                    <label>Option C</label>
                    <input
                      type="text"
                      value={qData.optionC}
                      onChange={(e) => setQData({ ...qData, optionC: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Option D</label>
                    <input
                      type="text"
                      value={qData.optionD}
                      onChange={(e) => setQData({ ...qData, optionD: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row single" style={{ marginTop: 10 }}>
                  <div className="field">
                    <label>
                      Select the Single Best / Correct Answer <MandatoryStar />
                    </label>
                    <select
                      value={qData.correct_index}
                      onChange={(e) => setQData({ ...qData, correct_index: Number(e.target.value) })}
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RATIONALE EXPLANATIONS */}
              <div className="form-row single">
                <div className="field">
                  <label>
                    Why the Correct Answer is Right <MandatoryStar />
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide in-depth medical rationale for why the correct option is the guideline standard..."
                    value={qData.explanation_correct}
                    onChange={(e) => setQData({ ...qData, explanation_correct: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="field">
                  <label>Why the Distractors (Incorrect Options) are Wrong</label>
                  <textarea
                    rows={3}
                    placeholder="Explain why Option B, C, D are incorrect or contraindicated..."
                    value={qData.explanation_incorrect}
                    onChange={(e) => setQData({ ...qData, explanation_incorrect: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving Question..." : "Save Question to Bank"}
              </button>
            </form>
          </div>

          {/* Questions List */}
          <h3>Question Bank Catalog ({questions.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 14 }}>
            {questions.map((q, idx) => (
              <div key={q.id} className="dash-card">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="pill accent">Item #{idx + 1} · {q.subject} (Level {q.level})</span>
                  <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                    Correct: Option {String.fromCharCode(65 + Number(q.correct_index))}
                  </span>
                </div>
                <p style={{ fontSize: 14.5, color: "var(--ink)", margin: "8px 0" }}>{q.stem}</p>
                <div style={{ fontSize: 13, color: "var(--ink-soft)", backgroundColor: "#F7F4EE", padding: 10, borderRadius: 6 }}>
                  <strong>Correct Rationale:</strong> {q.explanation_correct}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
