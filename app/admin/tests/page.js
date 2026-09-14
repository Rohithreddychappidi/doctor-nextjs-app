"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import MandatoryStar from "@/components/MandatoryStar";
import ExportButton from "@/components/ExportButton";

export default function AdminTestsPage() {
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("modules"); // "modules" | "upload" | "questions" | "tests"

  // Modules Filter & Form
  const [selectedSpec, setSelectedSpec] = useState("all");
  const [newModule, setNewModule] = useState({
    name: "",
    specialization_id: "spec_neo",
    description: "",
    is_free: true,
    price: 0,
  });
  const [creatingModule, setCreatingModule] = useState(false);

  // Bulk Upload State
  const [uploadModuleId, setUploadModuleId] = useState("");
  const [csvText, setCsvText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // Question Form
  const [qData, setQData] = useState({
    subject: "Neonatology",
    module: "Neonatal Resuscitation & Intensive Care",
    module_id: "",
    section: "Respiratory Distress Syndrome & Surfactant",
    system: "Respiratory",
    exam: "USMLE Step 2 CK / Board Prep",
    level: 2,
    stem: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct_index: 0,
    explanation_correct: "",
    explanation_incorrect: "",
    image_url: "",
  });

  const [qSearch, setQSearch] = useState("");
  const [qSubjectFilter, setQSubjectFilter] = useState("ALL");

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
      const [qRes, tRes, sRes, mRes] = await Promise.all([
        fetch("/api/questions"),
        fetch("/api/tests"),
        fetch("/api/qbank/specializations"),
        fetch("/api/qbank/modules"),
      ]);
      if (qRes.ok) {
        const d = await qRes.json();
        setQuestions(d.questions || []);
      }
      if (tRes.ok) {
        const d = await tRes.json();
        setTests(d.tests || []);
      }
      if (sRes.ok) {
        const d = await sRes.json();
        setSpecializations(d.specializations || []);
      }
      if (mRes.ok) {
        const d = await mRes.json();
        setModules(d.modules || []);
        if (d.modules && d.modules.length > 0 && !uploadModuleId) {
          setUploadModuleId(d.modules[0].id);
        }
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

  // Handle Create Module
  const handleCreateModule = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    if (!newModule.name || !newModule.specialization_id) {
      setErr("Module Name and Specialization are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/qbank/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newModule),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create module");
      setMsg(`Module "${newModule.name}" created successfully!`);
      setNewModule({ name: "", specialization_id: "spec_neo", description: "", is_free: true, price: 0 });
      setCreatingModule(false);
      loadAll();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Bulk Upload
  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setUploadResult(null);

    if (!uploadModuleId) {
      setErr("Please select a target module.");
      return;
    }
    if (!csvText.trim()) {
      setErr("Please provide CSV / Spreadsheet data to import.");
      return;
    }

    setUploading(true);
    try {
      const res = await fetch("/api/qbank/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          module_id: uploadModuleId,
          csv_text: csvText,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMsg(`Success! Added ${data.count} clinical questions to the selected module.`);
      setUploadResult(data);
      setCsvText("");
      loadAll();
    } catch (e) {
      setErr(e.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle CSV File Read
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setCsvText(content);
      }
    };
    reader.readAsText(file);
  };

  // Download Sample Template
  const handleDownloadSampleCSV = () => {
    const headers = "S.No,Question,Option A,Option B,Option C,Option D,Correct Option,Explanation\n";
    const sampleRows = [
      '1,"A 28-week preterm infant exhibits acute cyanosis and unequal breath sounds on CPAP. Transillumination of the right hemithorax is positive. What is the most immediate emergency intervention?","Emergent needle thoracostomy in the 2nd intercostal space midclavicular line","Intravenous bolus of normal saline 10 mL/kg","Increase nasal CPAP pressure to 8 cm H2O","Administration of surfactant via endotracheal tube","A","Right tension pneumothorax requires immediate decompression with an 18-20 gauge needle catheter before chest tube insertion."',
      '2,"A 3-week-old male infant presents with non-bilious projectile vomiting after every feed. Serum labs show Na 134 mEq/L, K 3.1 mEq/L, Cl 88 mEq/L, HCO3 32 mEq/L. What is the primary diagnosis?","Hypertrophic Pyloric Stenosis","Duodenal Atresia","Necrotizing Enterocolitis","Gastroesophageal Reflux Disease","A","Hypochloremic, hypokalemic metabolic alkalosis with postprandial projectile non-bilious vomiting is pathognomonic for infantile hypertrophic pyloric stenosis."'
    ].join("\n");

    const blob = new Blob([headers + sampleRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "jvmmedicalservices_qbank_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Manual Question
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
          module: qData.module,
          section: qData.section,
          system: qData.system,
          exam: qData.exam,
          level: Number(qData.level),
          stem: qData.stem,
          options,
          correct_index: Number(qData.correct_index),
          explanation_correct: qData.explanation_correct,
          explanation_incorrect: qData.explanation_incorrect,
          image_url: qData.image_url,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create question");

      setMsg("Question added successfully!");
      setQData({
        ...qData,
        stem: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correct_index: 0,
        explanation_correct: "",
        explanation_incorrect: "",
        image_url: "",
      });
      loadAll();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!confirm("Are you sure you want to delete this question? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/questions?id=${qId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete question");
      setMsg("Question deleted successfully.");
      loadAll();
    } catch (e) {
      setErr(e.message);
    }
  };

  const filteredModules = selectedSpec === "all"
    ? modules
    : modules.filter(m => m.specialization_id === selectedSpec);

  return (
    <AdminShell>
      <div className="dash-head">
        <div>
          <div className="eyebrow">Academic CMS · jvmmedicalservices</div>
          <h1>Question Bank &amp; Curricular Modules Management</h1>
          <p className="sub">
            Manage 3 Specializations, 20+ Curricular Modules, Bulk Excel/CSV question imports, and certificate scores.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ExportButton type="tests" label="Export Test Attempts (CSV)" />
        </div>
      </div>

      {msg && <div className="form-note" style={{ color: "#2E7D3A", marginBottom: 20 }}>✓ {msg}</div>}
      {err && <div className="form-note error" style={{ color: "#8A2A34", marginBottom: 20 }}>⚠️ {err}</div>}

      {/* TABS NAVIGATION */}
      <div style={{ display: "flex", gap: 10, borderBottom: "2px solid #E6E2D8", marginBottom: 24, overflowX: "auto" }}>
        {[
          { key: "modules", label: `Specializations & Modules (${modules.length})` },
          { key: "upload", label: "⚡ Bulk Excel/CSV Upload" },
          { key: "questions", label: `Question Library (${questions.length})` },
          { key: "tests", label: `Mock Exam Blocks (${tests.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveView(tab.key); setMsg(""); setErr(""); }}
            style={{
              background: "transparent",
              border: "none",
              padding: "10px 18px",
              fontWeight: 700,
              fontSize: 14,
              color: activeView === tab.key ? "#0f766e" : "#64748b",
              borderBottom: activeView === tab.key ? "3px solid #0f766e" : "3px solid transparent",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* VIEW 1: MODULES & SPECIALIZATIONS */}
      {activeView === "modules" && (
        <div className="space-y-6">
          {/* Top Actions: Specialization Filter & Add Module Button */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, backgroundColor: "#fff", padding: 16, borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Filter by Specialization:</span>
              <button
                onClick={() => setSelectedSpec("all")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  backgroundColor: selectedSpec === "all" ? "#0f766e" : "#f1f5f9",
                  color: selectedSpec === "all" ? "#fff" : "#475569",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                All Specializations ({modules.length})
              </button>
              {specializations.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSpec(s.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    backgroundColor: selectedSpec === s.id ? "#0f766e" : "#f1f5f9",
                    color: selectedSpec === s.id ? "#fff" : "#475569",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCreatingModule(!creatingModule)}
              style={{
                backgroundColor: "#0f766e",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
              }}
            >
              {creatingModule ? "✕ Cancel" : "+ Create New Module"}
            </button>
          </div>

          {/* New Module Form Drawer */}
          {creatingModule && (
            <div style={{ backgroundColor: "#f8fafc", padding: 20, borderRadius: 12, border: "1px solid #cbd5e1" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Add New Question Bank Module</h3>
              <form onSubmit={handleCreateModule}>
                <div className="form-row">
                  <div className="field">
                    <label>Module Title <MandatoryStar /></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Neonatal Sepsis & Early CSF Analysis"
                      value={newModule.name}
                      onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Specialization Discipline <MandatoryStar /></label>
                    <select
                      value={newModule.specialization_id}
                      onChange={(e) => setNewModule({ ...newModule, specialization_id: e.target.value })}
                    >
                      {specializations.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label>Module Description</label>
                    <input
                      type="text"
                      placeholder="Summary of high-yield clinical topics tested"
                      value={newModule.description}
                      onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                    />
                  </div>
                  <div className="field" style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 24 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={newModule.is_free}
                        onChange={(e) => setNewModule({ ...newModule, is_free: e.target.checked })}
                      />
                      Free Module (100% Free Practice)
                    </label>
                    {!newModule.is_free && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Price ($):</span>
                        <input
                          type="number"
                          style={{ width: 80, padding: "4px 8px" }}
                          value={newModule.price}
                          onChange={(e) => setNewModule({ ...newModule, price: Number(e.target.value) })}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  style={{ backgroundColor: "#0f766e", color: "#fff", padding: "8px 20px", borderRadius: 6, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 8 }}
                >
                  {saving ? "Creating..." : "Save Module"}
                </button>
              </form>
            </div>
          )}

          {/* Modules Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {filteredModules.map((mod) => {
              const spec = specializations.find(s => s.id === mod.specialization_id);
              return (
                <div
                  key={mod.id}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, backgroundColor: "#f1f5f9", color: "#0f766e" }}>
                        {spec ? `${spec.icon} ${spec.code}` : "MODULE"}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 6,
                          backgroundColor: mod.is_free ? "#dcfce7" : "#fef3c7",
                          color: mod.is_free ? "#166534" : "#92400e",
                        }}
                      >
                        {mod.is_free ? "Free" : `$${mod.price} Paid`}
                      </span>
                    </div>

                    <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{mod.name}</h4>
                    <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.4, marginBottom: 12 }}>{mod.description}</p>
                  </div>

                  <div style={{ paddingTop: 12, borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>
                      📝 {mod.question_count || 0} Questions
                    </span>
                    <button
                      onClick={() => {
                        setUploadModuleId(mod.id);
                        setActiveView("upload");
                      }}
                      style={{
                        backgroundColor: "#f0fdfa",
                        color: "#0f766e",
                        border: "1px solid #ccfbf1",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      + Bulk Add Questions
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: BULK EXCEL / CSV UPLOAD */}
      {activeView === "upload" && (
        <div style={{ maxWidth: 850, margin: "0 auto", backgroundColor: "#fff", padding: 28, borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>Bulk Excel / CSV Question Importer</h3>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                Upload an Excel/CSV spreadsheet to automatically add 10s or 100s of clinical questions to any module in one click.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadSampleCSV}
              style={{
                backgroundColor: "#f8fafc",
                color: "#0f766e",
                border: "1px solid #cbd5e1",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              📥 Download Sample Template (.CSV)
            </button>
          </div>

          {/* Expected Columns Box */}
          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: 14, borderRadius: 8, marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 4 }}>
              Required Spreadsheet Columns:
            </div>
            <code style={{ fontSize: 11.5, color: "#14532d", wordBreak: "break-all" }}>
              S.No, Question, Option A, Option B, Option C, Option D, Correct Option, Explanation
            </code>
          </div>

          <form onSubmit={handleBulkUpload}>
            {/* Target Module Dropdown */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                Target Curricular Module <MandatoryStar />
              </label>
              <select
                value={uploadModuleId}
                onChange={(e) => setUploadModuleId(e.target.value)}
                required
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13.5 }}
              >
                <option value="">-- Choose Module --</option>
                {specializations.map(spec => (
                  <optgroup key={spec.id} label={`${spec.icon} ${spec.name}`}>
                    {modules.filter(m => m.specialization_id === spec.id).map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.question_count || 0} questions)</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* File Upload / Paste Option */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                Upload Spreadsheet File (.csv)
              </label>
              <input
                type="file"
                accept=".csv, text/csv"
                onChange={handleFileUpload}
                style={{ width: "100%", padding: 8, border: "1px dashed #94a3b8", borderRadius: 8, backgroundColor: "#f8fafc" }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
                Or Paste Spreadsheet / CSV Data Directly:
              </label>
              <textarea
                rows={8}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={`S.No,Question,Option A,Option B,Option C,Option D,Correct Option,Explanation\n1,"A 2-day-old infant presents with tachypnea...","Option A","Option B","Option C","Option D","A","Rationale..."`}
                style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid #cbd5e1", fontFamily: "monospace", fontSize: 12 }}
              />
            </div>

            <button
              type="submit"
              disabled={uploading || !csvText.trim()}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                backgroundColor: uploading || !csvText.trim() ? "#94a3b8" : "#0f766e",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: uploading || !csvText.trim() ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? "Processing & Inserting Questions..." : "Process & Import Questions to Module"}
            </button>
          </form>

          {uploadResult && (
            <div style={{ marginTop: 24, padding: 16, backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: "#166534", fontSize: 14, marginBottom: 8 }}>
                ✓ {uploadResult.count} Questions Successfully Added!
              </div>
              <p style={{ fontSize: 12.5, color: "#14532d", margin: 0 }}>
                You can now view them in the Question Library, assign images, or take practice exams in the Student Dashboard.
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: QUESTION LIBRARY & MANUAL ENTRY */}
      {activeView === "questions" && (
        <div>
          {/* Add Question Card */}
          <div className="dash-card" style={{ marginBottom: 30 }}>
            <h3 style={{ marginBottom: 16 }}>Add Single Question Manually</h3>
            <form onSubmit={handleAddQuestion}>
              <div className="form-row">
                <div className="field">
                  <label>Curricular Module <MandatoryStar /></label>
                  <select
                    value={qData.module}
                    onChange={(e) => setQData({ ...qData, module: e.target.value })}
                  >
                    {modules.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Organ System / Subject Focus</label>
                  <input
                    type="text"
                    value={qData.subject}
                    onChange={(e) => setQData({ ...qData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="field">
                  <label>Clinical Vignette / Question Stem <MandatoryStar /></label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter the patient scenario, gestational age, clinical presentation, and diagnostic probe..."
                    value={qData.stem}
                    onChange={(e) => setQData({ ...qData, stem: e.target.value })}
                  />
                </div>
              </div>

              {/* Optional Image URL */}
              <div className="form-row single">
                <div className="field">
                  <label>Diagnostic Image URL (Optional X-ray, ECG, or Path Slide)</label>
                  <input
                    type="url"
                    placeholder="https://... or /uploads/chest-xray.png"
                    value={qData.image_url}
                    onChange={(e) => setQData({ ...qData, image_url: e.target.value })}
                  />
                </div>
              </div>

              {/* Options A - D */}
              <div className="form-row">
                <div className="field">
                  <label>Option A <MandatoryStar /></label>
                  <input
                    type="text"
                    required
                    value={qData.optionA}
                    onChange={(e) => setQData({ ...qData, optionA: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label>Option B <MandatoryStar /></label>
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

              <div className="form-row">
                <div className="field">
                  <label>Single Best Answer (Correct Option) <MandatoryStar /></label>
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
                <div className="field">
                  <label>Target Exam Level</label>
                  <select
                    value={qData.level}
                    onChange={(e) => setQData({ ...qData, level: Number(e.target.value) })}
                  >
                    <option value={1}>Level 1: Core Medical Student (USMLE Step 1)</option>
                    <option value={2}>Level 2: Clinical Sub-I / Shelf (USMLE Step 2 CK)</option>
                    <option value={3}>Level 3: Advanced Fellow / Pediatric Board</option>
                  </select>
                </div>
              </div>

              <div className="form-row single">
                <div className="field">
                  <label>Guideline-Based Correct Answer Rationale <MandatoryStar /></label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Cite clinical guidelines (AAP, NRP, AHA) explaining why the chosen option is correct..."
                    value={qData.explanation_correct}
                    onChange={(e) => setQData({ ...qData, explanation_correct: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="field">
                  <label>Distractor Explanations (Why other options are incorrect)</label>
                  <textarea
                    rows={2}
                    placeholder="Option A is wrong because... Option C is contraindicated in..."
                    value={qData.explanation_incorrect}
                    onChange={(e) => setQData({ ...qData, explanation_incorrect: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save Question to Library"}
              </button>
            </form>
          </div>

          {/* Question List */}
          <div className="dash-card">
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <h3>Item Library ({questions.length} Questions)</h3>
              <input
                type="text"
                placeholder="Search stem or keywords..."
                value={qSearch}
                onChange={(e) => setQSearch(e.target.value)}
                style={{ padding: "6px 12px", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 13 }}
              />
            </div>

            <div className="space-y-4">
              {questions.length === 0 && (
                <div style={{ padding: "32px", textAlign: "center", color: "#64748B", backgroundColor: "#F8FAFC", borderRadius: "10px", border: "1px dashed #CBD5E1" }}>
                  <div style={{ fontSize: "28px", marginBottom: "8px" }}>📝</div>
                  <div style={{ fontWeight: 700, color: "#1E293B", marginBottom: "4px" }}>Question Bank Library is Empty</div>
                  <p style={{ fontSize: "13px", margin: 0 }}>No test questions in the library. Add clinical questions using the form on the left or the Bulk CSV Importer tab.</p>
                </div>
              )}
              {questions
                .filter(q => !qSearch || q.stem.toLowerCase().includes(qSearch.toLowerCase()))
                .map((q, idx) => (
                  <div key={q.id} className="dash-card" style={{ borderLeft: "4px solid #0f766e" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                        <span className="pill accent">#{idx + 1} · {q.subject || "Clinical Core"}</span>
                        {q.module && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                            📚 {q.module}
                          </span>
                        )}
                        {q.image_url && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: "#ede9fe", color: "#6d28d9" }}>
                            🖼 Image Attached
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 12, color: "#166534", fontWeight: 700, backgroundColor: "#DCFCE7", padding: "3px 8px", borderRadius: 5 }}>
                          Correct: Option {String.fromCharCode(65 + Number(q.correct_index))}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id)}
                          style={{ padding: "3px 8px", borderRadius: 5, border: "1px solid #FECACA", backgroundColor: "#FEF2F2", color: "#DC2626", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: 14.5, color: "#0f172a", margin: "8px 0 12px", lineHeight: 1.5 }}>{q.stem}</p>

                    {/* Options Preview */}
                    {Array.isArray(q.options) && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 6, marginBottom: 12 }}>
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === Number(q.correct_index);
                          return (
                            <div
                              key={optIdx}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                fontSize: 12.5,
                                backgroundColor: isCorrect ? "#DCFCE7" : "#F8FAFC",
                                border: isCorrect ? "1px solid #86EFAC" : "1px solid #E2E8F0",
                                color: isCorrect ? "#166534" : "#334155",
                                fontWeight: isCorrect ? 700 : 400,
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}.</span>
                              <span style={{ flex: 1 }}>{opt}</span>
                              {isCorrect && <span>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation */}
                    <div style={{ fontSize: 12.5, color: "#475569", backgroundColor: "#F8FAFC", padding: 10, borderRadius: 6 }}>
                      <strong style={{ color: "#166534" }}>Rationale:</strong> {q.explanation_correct}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: MOCK EXAMS (Pre-Packaged) */}
      {activeView === "tests" && (
        <div className="dash-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3>Pre-Packaged Practice Mock Blocks</h3>
            <span className="pill accent">{tests.length} Active Exams</span>
          </div>

          {tests.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#64748B", backgroundColor: "#F8FAFC", borderRadius: "10px", border: "1px dashed #CBD5E1" }}>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>📋</div>
              <div style={{ fontWeight: 700, color: "#1E293B", marginBottom: "4px" }}>No Mock Exams Created Yet</div>
              <p style={{ fontSize: "13px", margin: 0 }}>Create a new timed mock exam simulation block using the form below or import questions to package tests.</p>
            </div>
          ) : (
            <div className="grid grid-2" style={{ gap: 16 }}>
            {tests.map(t => (
              <div key={t.id} style={{ padding: 16, borderRadius: 10, border: "1px solid #e2e8f0", backgroundColor: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#0f766e" }}>{t.subject}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.is_free ? "#166534" : "#92400e" }}>
                    {t.is_free ? "Free Practice" : "Paid Block"}
                  </span>
                </div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{t.title}</h4>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>{t.description}</p>
                <div style={{ fontSize: 12, color: "#475569", display: "flex", gap: 14 }}>
                  <span>⏱ {t.duration_minutes} mins</span>
                  <span>🎯 Pass: {t.passing_score}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      )}
    </AdminShell>
  );
}
