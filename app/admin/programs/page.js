"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProg, setEditingProg] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  async function loadPrograms() {
    try {
      const res = await fetch("/api/admin/programs");
      if (res.ok) {
        const json = await res.json();
        setPrograms(json.programs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function handleOpenEdit(prog) {
    setEditingProg({
      id: prog.id,
      name: prog.name,
      category: prog.category,
      duration: prog.duration || "",
      pricing_type: prog.pricing_type || (prog.price === "Free" ? "Free" : "Paid"),
      price: prog.price || "$0",
      pricing_note: prog.pricing_note || "",
      description: prog.description || "",
    });
  }

  async function handleSaveProgram(e) {
    e.preventDefault();
    if (!editingProg) return;

    setSaving(true);
    setSaveSuccess("");

    try {
      const payload = {
        id: editingProg.id,
        updates: {
          pricing_type: editingProg.pricing_type,
          price: editingProg.pricing_type === "Free" ? "Free" : editingProg.price,
          pricing_note: editingProg.pricing_note,
          duration: editingProg.duration,
          description: editingProg.description,
        }
      };

      const res = await fetch("/api/admin/programs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(`Pricing & settings for "${editingProg.name}" updated successfully! Changes are live on the public website.`);
        setEditingProg(null);
        await loadPrograms();
        setTimeout(() => setSaveSuccess(""), 5000);
      } else {
        alert("Failed to update program pricing. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell>
      <div style={{ maxWidth: "1100px", padding: "28px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#B4832A", marginBottom: "4px" }}>
              Website &amp; Programs CMS
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#12203B", margin: 0 }}>
              Programs Catalog &amp; Live Pricing
            </h1>
            <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px", margin: 0 }}>
              Set program pricing (Paid vs Free). Price badges and tuition notes reflect dynamically across the public website and Education &amp; Training cards.
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ backgroundColor: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>
              ✓ Live Sync with Public Hub
            </span>
          </div>
        </div>

        {saveSuccess && (
          <div style={{ padding: "12px 16px", backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", borderRadius: "8px", fontSize: "13px", fontWeight: 600, marginBottom: "20px" }}>
            ✓ {saveSuccess}
          </div>
        )}

        {/* Programs Grid */}
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>Loading program offerings...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {programs.map((prog) => {
              const isFree = (prog.pricing_type === "Free" || prog.price === "Free");
              return (
                <div
                  key={prog.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s ease"
                  }}
                >
                  <div style={{ padding: "20px", flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#B4832A", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {prog.category}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "999px",
                          backgroundColor: isFree ? "#ECFDF5" : "#EFF6FF",
                          color: isFree ? "#047857" : "#1D4ED8",
                          border: isFree ? "1px solid #A7F3D0" : "1px solid #BFDBFE"
                        }}
                      >
                        {isFree ? "Free Program" : "Paid Enrollment"}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: "0 0 8px", lineHeight: 1.3 }}>
                      {prog.name}
                    </h3>
                    <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 16px", lineHeight: 1.5 }}>
                      {prog.description}
                    </p>
                  </div>

                  {/* Pricing Bar */}
                  <div style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: isFree ? "#059669" : "#1E293B" }}>
                        {isFree ? "Free" : prog.price}
                      </div>
                      <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                        {prog.pricing_note || prog.duration}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(prog)}
                      style={{
                        padding: "6px 14px",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #CBD5E1",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#334155",
                        cursor: "pointer",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                      }}
                    >
                      Edit Pricing ✏️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pricing Edit Modal */}
        {editingProg && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", width: "100%", maxWidth: "520px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F8FAFC" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                    Configure Program Pricing
                  </h3>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{editingProg.name}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProg(null)}
                  style={{ background: "none", border: "none", fontSize: "18px", color: "#94A3B8", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProgram} style={{ padding: "24px" }}>
                {/* Pricing Type Selector */}
                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "8px" }}>
                    Pricing Model
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <button
                      type="button"
                      onClick={() => setEditingProg({ ...editingProg, pricing_type: "Free", price: "Free" })}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: editingProg.pricing_type === "Free" ? "2px solid #059669" : "1px solid #E2E8F0",
                        backgroundColor: editingProg.pricing_type === "Free" ? "#ECFDF5" : "#FFFFFF",
                        color: editingProg.pricing_type === "Free" ? "#065F46" : "#475569",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>🎁</span> Free (Open Access)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProg({ ...editingProg, pricing_type: "Paid", price: editingProg.price === "Free" ? "$499" : editingProg.price })}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: editingProg.pricing_type === "Paid" ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: editingProg.pricing_type === "Paid" ? "#EFF6FF" : "#FFFFFF",
                        color: editingProg.pricing_type === "Paid" ? "#1E40AF" : "#475569",
                        fontWeight: 700,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px"
                      }}
                    >
                      <span>💳</span> Paid Tuition
                    </button>
                  </div>
                </div>

                {/* Price Amount (If Paid) */}
                {editingProg.pricing_type === "Paid" && (
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                      Published Tuition Price (e.g. $499, $1,200)
                    </label>
                    <input
                      type="text"
                      value={editingProg.price}
                      onChange={(e) => setEditingProg({ ...editingProg, price: e.target.value })}
                      required
                      placeholder="$499"
                      style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px", fontWeight: 600, boxSizing: "border-box" }}
                    />
                  </div>
                )}

                {/* Pricing Note */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                    Pricing Subtitle / Note (e.g. "per 6-week cohort", "one-time tuition")
                  </label>
                  <input
                    type="text"
                    value={editingProg.pricing_note}
                    onChange={(e) => setEditingProg({ ...editingProg, pricing_note: e.target.value })}
                    placeholder="per cohort"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                {/* Program Duration */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                    Duration Specification
                  </label>
                  <input
                    type="text"
                    value={editingProg.duration}
                    onChange={(e) => setEditingProg({ ...editingProg, duration: e.target.value })}
                    placeholder="6 Weeks"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #E2E8F0", paddingTop: "16px" }}>
                  <button
                    type="button"
                    onClick={() => setEditingProg(null)}
                    style={{ padding: "9px 16px", borderRadius: "6px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", color: "#475569", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ padding: "9px 20px", borderRadius: "6px", border: "none", backgroundColor: "#12203B", color: "#FFFFFF", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                  >
                    {saving ? "Saving Changes..." : "Publish Live Pricing ✓"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
