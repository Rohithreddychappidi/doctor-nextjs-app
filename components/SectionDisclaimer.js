"use client";

import { useEffect, useState } from "react";

export default function SectionDisclaimer({ sectionKey, className = "" }) {
  const [disclaimer, setDisclaimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!sectionKey) return;
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/disclaimers?section=${encodeURIComponent(sectionKey)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setDisclaimer(data.disclaimer || null);
          }
        }
      } catch (err) {
        console.error("Failed to load section disclaimer:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [sectionKey]);

  // If loading, disabled, or empty short_summary, render nothing (Strict Admin Control)
  if (loading || !disclaimer || !disclaimer.is_active || !disclaimer.short_summary?.trim()) {
    return null;
  }

  return (
    <>
      <aside
        className={`section-disclaimer-banner ${className}`}
        role="complementary"
        aria-label="Clinical and Educational Disclaimer"
        style={{
          margin: "18px 0",
          padding: "14px 18px",
          backgroundColor: "#F8FAFC",
          borderRadius: "12px",
          border: "1px solid #CBD5E1",
          borderLeft: "4px solid #B4832A",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "#FFFBEB",
              color: "#B4832A",
              border: "1px solid #FDE68A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              flexShrink: 0,
              marginTop: "2px",
            }}
          >
            ⚖️
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#B4832A",
                }}
              >
                Notice &amp; Safety Compliance
              </span>
              <span
                style={{
                  fontSize: "12.5px",
                  fontWeight: 700,
                  color: "#0F172A",
                }}
              >
                {disclaimer.title}
              </span>
            </div>
            <p
              style={{
                fontSize: "12px",
                color: "#475569",
                lineHeight: 1.5,
                margin: "0 0 8px 0",
              }}
            >
              {disclaimer.short_summary}
            </p>
            {disclaimer.full_documentation && (
              <button
                type="button"
                onClick={() => setShowModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "11.5px",
                  fontWeight: 700,
                  color: "#1E3A8A",
                  cursor: "pointer",
                  textDecoration: "underline",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>📜</span>
                <span>{disclaimer.doc_link_text || "Read Disclaimer Documentation & Terms"} &rarr;</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* FULL DISCLAIMER DOCUMENTATION MODAL */}
      {showModal && (
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
          onClick={() => setShowModal(false)}
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
            {/* Modal Header */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>⚖️</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>
                    {disclaimer.title}
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#E9C989" }}>
                    Official Educational, Clinical &amp; Compliance Documentation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#FFFFFF",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: 700,
                }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                flex: 1,
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#334155",
              }}
            >
              {/* Short Summary Highlight Box */}
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderLeft: "4px solid #B4832A",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "20px",
                  fontSize: "12.5px",
                  color: "#1E293B",
                  fontWeight: 500,
                }}
              >
                <strong>Executive Summary:</strong> {disclaimer.short_summary}
              </div>

              {/* Formatted Documentation */}
              <div
                style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                  color: "#1E293B",
                }}
              >
                {disclaimer.full_documentation}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid #E2E8F0",
                backgroundColor: "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "11.5px",
                color: "#64748B",
              }}
            >
              <span>Dr. Janardhan Mydam · Institutional Governance</span>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  backgroundColor: "#12203B",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "12px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Acknowledge &amp; Close ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
