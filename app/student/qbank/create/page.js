"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateQBankBlockPage() {
  const router = useRouter();

  const [specializations, setSpecializations] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedSpecId, setSelectedSpecId] = useState("spec_neo");
  const [selectedModuleIds, setSelectedModuleIds] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [mode, setMode] = useState("Timed");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load specializations and modules
  useEffect(() => {
    async function loadData() {
      try {
        const [specRes, modRes] = await Promise.all([
          fetch("/api/qbank/specializations"),
          fetch("/api/qbank/modules"),
        ]);
        if (specRes.ok) {
          const s = await specRes.json();
          setSpecializations(s.specializations || []);
        }
        if (modRes.ok) {
          const m = await modRes.json();
          setModules(m.modules || []);
          // Default select all modules under default specialization
          const defaultMods = (m.modules || []).filter(item => item.specialization_id === "spec_neo");
          setSelectedModuleIds(defaultMods.map(d => d.id));
        }
      } catch (err) {
        console.error("Failed to load QBank metadata:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When specialization changes, update selected modules
  const handleSpecChange = (specId) => {
    setSelectedSpecId(specId);
    const specMods = modules.filter(m => m.specialization_id === specId);
    setSelectedModuleIds(specMods.map(m => m.id));
  };

  const handleToggleModule = (modId) => {
    if (selectedModuleIds.includes(modId)) {
      setSelectedModuleIds(selectedModuleIds.filter(id => id !== modId));
    } else {
      setSelectedModuleIds([...selectedModuleIds, modId]);
    }
  };

  const handleSelectAllInSpec = () => {
    const specMods = modules.filter(m => m.specialization_id === selectedSpecId);
    setSelectedModuleIds(specMods.map(m => m.id));
  };

  const handleDeselectAll = () => {
    setSelectedModuleIds([]);
  };

  const currentSpec = specializations.find(s => s.id === selectedSpecId);
  const currentModules = modules.filter(m => m.specialization_id === selectedSpecId);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    if (selectedModuleIds.length === 0) {
      setError("Please select at least one module to practice.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/student/qbank/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || `${currentSpec ? currentSpec.name : "Pediatric"} Clinical Assessment Block`,
          specialization_id: selectedSpecId,
          module_ids: selectedModuleIds,
          questionCount: Number(questionCount),
          mode,
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

  if (loading) {
    return (
      <div style={{ maxWidth: 760, margin: "40px auto", textAlign: "center", color: "#64748b" }}>
        Loading Question Bank specializations &amp; modules...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 840, margin: "0 auto", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/student/qbank" style={{ color: "#0f766e", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          ← Back to Question Bank Hub
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "8px 0 4px" }}>
          Create Practice Exam Block
        </h1>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
          Select your target specialization, check the modules you want to review, and choose your question batch size.
        </p>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "28px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
        {error && (
          <div style={{ padding: "12px 16px", backgroundColor: "#FEF2F2", color: "#B91C1C", borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-6">
          {/* STEP 1: SELECT SPECIALIZATION */}
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
              1. Choose Clinical Specialization Discipline
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
              {specializations.map((spec) => {
                const isSelected = selectedSpecId === spec.id;
                return (
                  <div
                    key={spec.id}
                    onClick={() => handleSpecChange(spec.id)}
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      border: isSelected ? "2px solid #0f766e" : "1px solid #CBD5E1",
                      backgroundColor: isSelected ? "#F0FDFA" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 20 }}>{spec.icon}</span>
                      <span style={{ fontWeight: 800, fontSize: 13.5, color: isSelected ? "#0f766e" : "#1E293B" }}>
                        {spec.name}
                      </span>
                    </div>
                    <p style={{ fontSize: 11.5, color: "#64748b", margin: 0, lineHeight: 1.35 }}>
                      {spec.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SELECT MODULES UNDER SPECIALIZATION */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                2. Select Modules to Practice ({selectedModuleIds.length} Selected)
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={handleSelectAllInSpec}
                  style={{ background: "transparent", border: "none", color: "#0f766e", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                >
                  Select All
                </button>
                <span style={{ color: "#CBD5E1" }}>·</span>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  style={{ background: "transparent", border: "none", color: "#94A3B8", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div style={{ maxHeight: 280, overflowY: "auto", border: "1px solid #E2E8F0", borderRadius: 10, padding: 12, backgroundColor: "#F8FAFC" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                {currentModules.map((mod) => {
                  const checked = selectedModuleIds.includes(mod.id);
                  return (
                    <label
                      key={mod.id}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "8px 10px",
                        backgroundColor: checked ? "#FFFFFF" : "transparent",
                        borderRadius: 8,
                        border: checked ? "1px solid #99F6E4" : "1px solid transparent",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleModule(mod.id)}
                        style={{ marginTop: 3, accentColor: "#0f766e", cursor: "pointer" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: checked ? "#0f766e" : "#334155" }}>
                            {mod.name}
                          </span>
                          <span style={{ fontSize: 10.5, fontWeight: 700, padding: "1px 6px", borderRadius: 4, backgroundColor: mod.is_free ? "#DCFCE7" : "#FEF3C7", color: mod.is_free ? "#166534" : "#92400E" }}>
                            {mod.is_free ? "Free" : `$${mod.price}`}
                          </span>
                        </div>
                        <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0" }}>
                          {mod.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STEP 3: QUESTION BATCH SIZE */}
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
              3. Select Number of Random Questions
            </label>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[5, 10, 15, 20].map((num) => {
                const isSelected = questionCount === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    style={{
                      flex: "1 1 80px",
                      padding: "12px 16px",
                      borderRadius: 10,
                      border: isSelected ? "2px solid #0f766e" : "1px solid #CBD5E1",
                      backgroundColor: isSelected ? "#0f766e" : "#FFFFFF",
                      color: isSelected ? "#FFFFFF" : "#1E293B",
                      fontSize: 14,
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                    }}
                  >
                    {num} Questions
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 11.5, color: "#64748b", marginTop: 6 }}>
              Questions are drawn at random from your selected modules pool for randomized board exam simulation.
            </p>
          </div>

          {/* STEP 4: EXAM MODE */}
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
              4. Choose Testing Mode
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div
                onClick={() => setMode("Timed")}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  border: mode === "Timed" ? "2px solid #0f766e" : "1px solid #CBD5E1",
                  backgroundColor: mode === "Timed" ? "#F0FDFA" : "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 13.5, color: "#0f172a" }}>⏱ Timed Simulation</div>
                <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4 }}>
                  Official exam timing with countdown clock. Score card and certificate generated after submission.
                </div>
              </div>

              <div
                onClick={() => setMode("Tutor")}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  border: mode === "Tutor" ? "2px solid #0f766e" : "1px solid #CBD5E1",
                  backgroundColor: mode === "Tutor" ? "#F0FDFA" : "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 13.5, color: "#0f172a" }}>📖 Tutor Mode</div>
                <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4 }}>
                  Immediate feedback with detailed AAP &amp; AHA clinical rationales after answering each question.
                </div>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 10,
              backgroundColor: submitting ? "#94A3B8" : "#0f766e",
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 800,
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(15, 118, 110, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            {submitting ? "Synthesizing Practice Block..." : `Start ${questionCount}-Question Practice Exam →`}
          </button>
        </form>
      </div>
    </div>
  );
}
