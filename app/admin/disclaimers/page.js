"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminDisclaimersPage() {
  const [disclaimers, setDisclaimers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDisc, setEditingDisc] = useState(null);
  const [previewDisc, setPreviewDisc] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadDisclaimers();
  }, []);

  async function loadDisclaimers() {
    try {
      const res = await fetch("/api/disclaimers?admin=true");
      if (res.ok) {
        const data = await res.json();
        setDisclaimers(data.disclaimers || []);
      }
    } catch (err) {
      console.error("Failed to load disclaimers:", err);
    } finally {
      setLoading(false);
    }
  }

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  }

  async function handleToggle(disc) {
    const updatedStatus = !disc.is_active;
    try {
      const res = await fetch("/api/disclaimers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_key: disc.section_key,
          is_active: updatedStatus,
        }),
      });
      if (res.ok) {
        notify(
          `Disclaimer for "${disc.section_name}" is now ${
            updatedStatus ? "ACTIVE (Shown on portal)" : "DISABLED (Completely hidden)"
          }`
        );
        loadDisclaimers();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editingDisc) return;
    setSaving(true);
    try {
      const res = await fetch("/api/disclaimers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingDisc),
      });
      if (res.ok) {
        notify(`Disclaimer & documentation saved for "${editingDisc.section_name}"`);
        setEditingDisc(null);
        loadDisclaimers();
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div className="dash-head">
        <div>
          <div className="eyebrow">Compliance &amp; Governance CMS</div>
          <h1>Section Disclaimers &amp; Documentation Manager</h1>
          <p className="sub">
            Control clinical safety notices, educational disclaimers, and regulatory terms per section.
            When disabled or blank, the disclaimer banner is completely omitted from the corresponding section and subpages.
          </p>
        </div>
      </div>

      {toast && (
        <div
          style={{
            padding: "12px 18px",
            backgroundColor: "#ECFDF5",
            border: "1px solid #A7F3D0",
            color: "#065F46",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "13.5px",
            fontWeight: 600,
          }}
        >
          {toast}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>
          Loading section disclaimers...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {disclaimers.map((disc) => {
            const isActive = Boolean(disc.is_active && disc.short_summary?.trim());
            return (
              <div
                key={disc.section_key}
                className="dash-card"
                style={{
                  borderLeft: isActive ? "4px solid #16A34A" : "4px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "16px" }}>⚖️</span>
                      <h3 style={{ margin: 0, fontSize: "16px", color: "#0F172A" }}>
                        {disc.section_name}
                      </h3>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "4px",
                          backgroundColor: isActive ? "#DCFCE7" : "#F1F5F9",
                          color: isActive ? "#166534" : "#64748B",
                        }}
                      >
                        {isActive ? "ACTIVE & VISIBLE" : "HIDDEN (DISABLED)"}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>
                      Key: <code>{disc.section_key}</code> · Target:{" "}
                      <strong>
                        {disc.section_key === "tele_rotations"
                          ? "/education-training/tele-rotations & /student/rotations"
                          : disc.section_key === "question_bank"
                          ? "/education-training/question-banks & /student/qbank"
                          : disc.section_key === "live_classes"
                          ? "/education-training/live-learning & /student/live-learning"
                          : disc.section_key === "research"
                          ? "/research & /student/research"
                          : `/${disc.section_key}`}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => handleToggle(disc)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        border: "1px solid",
                        cursor: "pointer",
                        backgroundColor: disc.is_active ? "#FEF2F2" : "#F0FDF4",
                        borderColor: disc.is_active ? "#FECACA" : "#BBF7D0",
                        color: disc.is_active ? "#DC2626" : "#16A34A",
                      }}
                    >
                      {disc.is_active ? "Disable Disclaimer" : "Enable Disclaimer"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingDisc({ ...disc })}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 700,
                        backgroundColor: "#12203B",
                        color: "#FFFFFF",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Edit Content &amp; Docs &rarr;
                    </button>
                  </div>
                </div>

                {/* Banner Content Preview */}
                <div
                  style={{
                    padding: "12px 14px",
                    backgroundColor: "#F8FAFC",
                    borderRadius: "8px",
                    border: "1px solid #E2E8F0",
                    fontSize: "12.5px",
                    lineHeight: 1.5,
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#1E293B", marginBottom: "4px" }}>
                    {disc.title || "Untitled Disclaimer"}
                  </div>
                  <p style={{ margin: "0 0 8px", color: "#475569" }}>
                    {disc.short_summary || (
                      <em style={{ color: "#94A3B8" }}>No short summary configured yet.</em>
                    )}
                  </p>
                  {disc.full_documentation && (
                    <button
                      type="button"
                      onClick={() => setPreviewDisc(disc)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        fontSize: "11.5px",
                        fontWeight: 700,
                        color: "#2563EB",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Preview Documentation Modal ({disc.doc_link_text || "Read Documentation"}) &rarr;
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingDisc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setEditingDisc(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #E2E8F0",
                backgroundColor: "#0E182A",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>
                Edit Disclaimer: {editingDisc.section_name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDisc(null)}
                style={{ background: "none", border: "none", color: "#FFFFFF", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ padding: "24px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Disclaimer Title
                </label>
                <input
                  type="text"
                  required
                  value={editingDisc.title}
                  onChange={(e) => setEditingDisc({ ...editingDisc, title: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Short Summary Callout (Displayed directly in section banner)
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingDisc.short_summary}
                  onChange={(e) => setEditingDisc({ ...editingDisc, short_summary: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Documentation Link Label
                </label>
                <input
                  type="text"
                  value={editingDisc.doc_link_text}
                  onChange={(e) => setEditingDisc({ ...editingDisc, doc_link_text: e.target.value })}
                  placeholder="e.g. Read Full Regulatory & Clinical Terms"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>
                  Full Documentation Content (Shown in modal when documentation link is clicked)
                </label>
                <textarea
                  rows={8}
                  value={editingDisc.full_documentation}
                  onChange={(e) => setEditingDisc({ ...editingDisc, full_documentation: e.target.value })}
                  placeholder="In-depth legal, educational, and institutional compliance provisions..."
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12.5px", boxSizing: "border-box", fontFamily: "monospace" }}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                <input
                  type="checkbox"
                  id="discActive"
                  checked={editingDisc.is_active}
                  onChange={(e) => setEditingDisc({ ...editingDisc, is_active: e.target.checked })}
                />
                <label htmlFor="discActive" style={{ fontSize: "13px", fontWeight: 600, color: "#1E293B", cursor: "pointer" }}>
                  Active and displayed on public &amp; student portal pages
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #E2E8F0", paddingTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setEditingDisc(null)}
                  style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", cursor: "pointer", fontSize: "12px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: "8px 20px", borderRadius: "6px", backgroundColor: "#12203B", color: "#FFFFFF", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "12px" }}
                >
                  {saving ? "Saving Changes..." : "Save Disclaimer ✓"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewDisc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setPreviewDisc(null)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #E2E8F0",
                backgroundColor: "#0E182A",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>
                  {previewDisc.title}
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#E9C989" }}>
                  Live Documentation Preview Mode
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDisc(null)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: "24px", overflowY: "auto", flex: 1, fontSize: "13px", lineHeight: 1.6, color: "#334155" }}>
              <div style={{ whiteSpace: "pre-wrap" }}>{previewDisc.full_documentation}</div>
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setPreviewDisc(null)}
                style={{ padding: "8px 18px", borderRadius: "8px", backgroundColor: "#12203B", color: "#FFFFFF", fontWeight: 700, fontSize: "12px", border: "none", cursor: "pointer" }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
