"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentQBankPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePillar, setActivePillar] = useState("pillar_neonatology");
  const [unlocking, setUnlocking] = useState(null);
  const [message, setMessage] = useState("");

  const loadQBank = async () => {
    try {
      const res = await fetch("/api/student/qbank");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("QBank load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQBank();
  }, []);

  const handleUnlock = async (moduleId) => {
    setUnlocking(moduleId);
    setMessage("");
    try {
      const res = await fetch("/api/student/qbank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unlock_module", module_id: moduleId }),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Unlock failed");

      setMessage(resJson.message || "Module unlocked successfully!");
      await loadQBank();
    } catch (err) {
      alert("Unlock error: " + err.message);
    } finally {
      setUnlocking(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748B" }}>
        <div style={{ width: 36, height: 36, border: "4px solid #0B1E36", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: "14px", fontWeight: 600 }}>Loading Question Bank tiers &amp; clinical modules...</p>
        <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const pillars = data?.pillars || [];
  const currentPillar = pillars.find((p) => p.id === activePillar) || pillars[0];
  const hasFullBundle = data?.has_full_bundle;

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "24px 16px 60px" }}>
      {/* Header */}
      <div style={{ marginBottom: 26, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 12, backgroundColor: "#EEF2F6", color: "#0B1E36", fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
            📝 Board Examination Preparation
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0B1E36", margin: "0 0 4px" }}>
            Clinical Question Bank Hub
          </h1>
          <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>
            Master clinical decision-making with USMLE Step 2 CK &amp; Shelf formatted clinical vignettes authored by Dr. Janardhan Mydam.
          </p>
        </div>

        <Link
          href="/student/qbank/create"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            backgroundColor: "#0B1E36",
            color: "#FFFFFF",
            borderRadius: 8,
            fontSize: "13.5px",
            fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(11,30,54,0.15)",
          }}
        >
          <span>⚡</span> Quick Custom Test Block
        </Link>
      </div>

      {message && (
        <div style={{ padding: "12px 18px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", borderRadius: 8, fontSize: "14px", fontWeight: 600, marginBottom: 20 }}>
          ✓ {message}
        </div>
      )}

      {/* SECTION I: 2 MAIN TIER CARDS (FREE VS PAID) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 32 }}>
        {/* CARD 1: FREE PRACTICE TIER */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            border: "1px solid #E2E8F0",
            padding: "24px 22px",
            boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "inline-block", padding: "3px 10px", backgroundColor: "#EEF2F6", color: "#0B1E36", fontSize: "11px", fontWeight: 800, borderRadius: 12, textTransform: "uppercase", marginBottom: 12 }}>
              Free Diagnostic Tier
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0B1E36", margin: "0 0 6px" }}>
              Diagnostic &amp; Core Practice
            </h2>
            <p style={{ color: "#64748B", fontSize: "13px", lineHeight: 1.5, margin: "0 0 16px" }}>
              Included for all medical students. Test your foundational clinical reasoning across high-yield vignettes with instant explanations.
            </p>

            <div style={{ backgroundColor: "#F8FAFC", borderRadius: 8, padding: "12px 14px", marginBottom: 18, fontSize: "12.5px", color: "#475569" }}>
              <div style={{ fontWeight: 700, color: "#0B1E36", marginBottom: 6 }}>Included in Free Tier:</div>
              <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
                <li>NRP 8th Edition &amp; Delivery Room Resuscitation Module</li>
                <li>Pediatric Developmental Milestones Diagnostic Block</li>
                <li>Biostatistics Diagnostic Accuracy (Sensitivity &amp; Specificity)</li>
                <li>🩺 Interactive debate with Dr. Janardhan Mydam AI Preceptor</li>
              </ul>
            </div>
          </div>

          <Link
            href="/student/qbank/test/mock_attempt_sample_1"
            style={{
              display: "block",
              textAlign: "center",
              padding: "11px 16px",
              backgroundColor: "#EEF2F6",
              color: "#0B1E36",
              fontWeight: 700,
              fontSize: "13.5px",
              borderRadius: 8,
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
          >
            Launch Free Diagnostic Block →
          </Link>
        </div>

        {/* CARD 2: PREMIUM CLINICAL BOARD TIER */}
        <div
          style={{
            background: "linear-gradient(135deg, #0B1E36 0%, #17375E 100%)",
            color: "#FFFFFF",
            borderRadius: 14,
            padding: "24px 22px",
            boxShadow: "0 8px 25px rgba(11,30,54,0.18)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "inline-block", padding: "3px 10px", backgroundColor: "#B4832A", color: "#FFF", fontSize: "11px", fontWeight: 800, borderRadius: 12, textTransform: "uppercase", marginBottom: 12 }}>
              ★ Premium Clinical Board Tier
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 6px" }}>
              Full High-Yield Board QBank
            </h2>
            <p style={{ color: "#CBD5E1", fontSize: "13px", lineHeight: 1.5, margin: "0 0 16px" }}>
              Complete question pool for USMLE Step 2 CK, Pediatric Shelf, and Neonatal Fellowship In-Training Exams.
            </p>

            <div style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "12px 14px", marginBottom: 18, fontSize: "12.5px", color: "#E2E8F0" }}>
              <div style={{ fontWeight: 700, color: "#93C5FD", marginBottom: 6 }}>Full Tier Privileges:</div>
              <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.7 }}>
                <li>350+ Board-Style Clinical Vignettes across all 3 Pillars</li>
                <li>Dual-Level Explanations: Trainee Review &amp; Attending Pearl</li>
                <li>Predictive Shelf Score Analytics &amp; Weak-Area Breakdown</li>
                <li>Official Verifiable Certificate of Mastery upon completion</li>
              </ul>
            </div>
          </div>

          {hasFullBundle ? (
            <div style={{ textAlign: "center", padding: "11px", backgroundColor: "rgba(34,197,94,0.2)", border: "1px solid #22C55E", borderRadius: 8, color: "#86EFAC", fontWeight: 700, fontSize: "13.5px" }}>
              ✓ Full Board Tier Unlocked &amp; Active
            </div>
          ) : (
            <button
              onClick={() => handleUnlock("bundle_all")}
              disabled={unlocking === "bundle_all"}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "#B4832A",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(180,131,42,0.3)",
              }}
            >
              {unlocking === "bundle_all" ? "Unlocking Complete Access..." : "Unlock All 3 Pillars (All-Access $99) →"}
            </button>
          )}
        </div>
      </div>

      {/* SECTION II: 3 MAIN SUBJECT PILLARS */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10 }}>
          Select Clinical Subject Pillar:
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {pillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 10,
                border: activePillar === pillar.id ? "2px solid #0B1E36" : "1px solid #CBD5E1",
                backgroundColor: activePillar === pillar.id ? "#0B1E36" : "#FFFFFF",
                color: activePillar === pillar.id ? "#FFFFFF" : "#334155",
                fontWeight: 700,
                fontSize: "13.5px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontSize: "16px" }}>{pillar.icon}</span>
              <span>{pillar.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pillar Header */}
      <div style={{ backgroundColor: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontWeight: 800, color: "#0B1E36", fontSize: "15px" }}>
          {currentPillar.name}
        </div>
        <div style={{ fontSize: "13px", color: "#64748B", marginTop: 2 }}>
          {currentPillar.description}
        </div>
      </div>

      {/* Modular Cards Under Selected Pillar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
        {currentPillar.modules?.map((mod) => (
          <div
            key={mod.id}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              border: mod.is_free ? "1px solid #CBD5E1" : "1px solid #E2E8F0",
              padding: "20px 18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 4,
                    backgroundColor: mod.is_free ? "#DCFCE7" : "#FEF3C7",
                    color: mod.is_free ? "#166534" : "#92400E",
                    textTransform: "uppercase",
                  }}
                >
                  {mod.is_free ? "FREE MODULE" : `PAID TIER · $${mod.price}`}
                </span>
                <span style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
                  {mod.question_count} Questions
                </span>
              </div>

              <h3 style={{ fontSize: "15.5px", fontWeight: 800, color: "#0B1E36", margin: "0 0 6px", lineHeight: 1.4 }}>
                {mod.title}
              </h3>
              <div style={{ fontSize: "12px", color: "#64748B", marginBottom: 14 }}>
                🎯 Focus: {mod.exam_focus}
              </div>
            </div>

            {mod.is_unlocked || mod.is_free ? (
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <Link
                  href={`/student/qbank/test/mock_attempt_sample_1?mode=tutor&module=${mod.id}`}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "9px 10px",
                    backgroundColor: "#0B1E36",
                    color: "#FFF",
                    borderRadius: 6,
                    fontSize: "12.5px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  🩺 Tutor Mode
                </Link>
                <Link
                  href={`/student/qbank/test/mock_attempt_sample_1?mode=timed&module=${mod.id}`}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "9px 10px",
                    backgroundColor: "#EEF2F6",
                    color: "#0B1E36",
                    borderRadius: 6,
                    fontSize: "12.5px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  ⏱️ Timed Mode
                </Link>
              </div>
            ) : (
              <button
                onClick={() => handleUnlock(mod.id)}
                disabled={unlocking === mod.id}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: 10,
                  backgroundColor: "#B4832A",
                  color: "#FFF",
                  borderRadius: 6,
                  border: "none",
                  fontSize: "13px",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(180,131,42,0.25)",
                }}
              >
                {unlocking === mod.id ? "Unlocking..." : `💳 Unlock Module ($${mod.price})`}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
