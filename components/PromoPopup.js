"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PromoPopup() {
  const [promo, setPromo] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function loadPromo() {
      try {
        const isDismissed = sessionStorage.getItem("mydam_promo_dismissed");
        if (isDismissed) return;

        const res = await fetch("/api/marketing");
        if (res.ok) {
          const data = await res.json();
          const active = data.promotions?.find((p) => p.is_active);
          if (active) setPromo(active);
        }
      } catch (e) {
        // ignore error
      }
    }
    loadPromo();
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("mydam_promo_dismissed", "true");
  };

  if (!promo || dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        maxWidth: 380,
        width: "calc(100% - 48px)",
        backgroundColor: "#12203B",
        color: "#FFFFFF",
        borderRadius: 12,
        boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
        border: "1px solid rgba(180, 131, 42, 0.4)",
        padding: "20px 22px",
        zIndex: 9999,
        animation: "slideUp 0.4s ease-out",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            color: "#E9C989",
            backgroundColor: "rgba(180, 131, 42, 0.2)",
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          Special Invitation
        </span>
        <button
          onClick={handleDismiss}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.6)",
            fontSize: 18,
            cursor: "pointer",
            lineHeight: 1,
            padding: "0 4px",
          }}
          aria-label="Close notification"
        >
          &times;
        </button>
      </div>
      <h4 style={{ margin: "6px 0 8px", fontSize: 16, color: "#FFFFFF", fontFamily: "'Fraunces', serif" }}>
        {promo.title}
      </h4>
      <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", margin: "0 0 16px", lineHeight: 1.45 }}>
        {promo.message}
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <Link
          href={promo.cta_link || "/question-banks"}
          onClick={handleDismiss}
          style={{
            backgroundColor: "#8A2A34",
            color: "#FFFFFF",
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          {promo.cta_text || "Explore"}
        </Link>
        <button
          onClick={handleDismiss}
          style={{
            backgroundColor: "transparent",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "#FFFFFF",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Later
        </button>
      </div>
    </div>
  );
}
