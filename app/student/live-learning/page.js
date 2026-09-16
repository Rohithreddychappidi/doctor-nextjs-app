"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentLiveLearningPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming"); // upcoming | recorded
  const [registering, setRegistering] = useState(null);
  const [message, setMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const loadClasses = async () => {
    try {
      const res = await fetch("/api/student/live-learning");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Live learning load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
    const interval = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (classId, isFree) => {
    setRegistering(classId);
    setMessage("");
    try {
      const res = await fetch("/api/student/live-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isFree ? "register" : "pay",
          class_id: classId,
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Action failed");

      setMessage(resJson.message);
      await loadClasses();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setRegistering(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748B" }}>
        <div style={{ width: 36, height: 36, border: "4px solid #0B1E36", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: "14px", fontWeight: 600 }}>Loading live clinical lectures &amp; seminars...</p>
        <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const classes = data?.classes || [];
  const recorded = data?.recorded || [];

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 16px 60px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 12, backgroundColor: "#EEF2F6", color: "#0B1E36", fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
            🎥 Microsoft Teams Live Grand Rounds
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0B1E36", margin: "0 0 4px" }}>
            Live Clinical Classes &amp; Lectures
          </h1>
          <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>
            Interactive case seminars, neonatal resuscitation simulations, and USMLE shelf case analysis hosted by <strong>Dr. Janardhan Mydam, MD, FAAP</strong>.
          </p>
        </div>
      </div>

      {message && (
        <div style={{ padding: "12px 18px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", borderRadius: 8, fontSize: "14px", fontWeight: 600, marginBottom: 20 }}>
          ✓ {message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "2px solid #E2E8F0", paddingBottom: 0, marginBottom: 24 }}>
        <button
          onClick={() => setActiveTab("upcoming")}
          style={{
            padding: "12px 20px",
            border: "none",
            borderBottom: activeTab === "upcoming" ? "3px solid #0B1E36" : "3px solid transparent",
            backgroundColor: "transparent",
            color: activeTab === "upcoming" ? "#0B1E36" : "#64748B",
            fontWeight: activeTab === "upcoming" ? 800 : 500,
            fontSize: "14.5px",
            cursor: "pointer",
          }}
        >
          🗓️ Upcoming &amp; Present Live Lectures ({classes.length})
        </button>

        <button
          onClick={() => setActiveTab("recorded")}
          style={{
            padding: "12px 20px",
            border: "none",
            borderBottom: activeTab === "recorded" ? "3px solid #0B1E36" : "3px solid transparent",
            backgroundColor: "transparent",
            color: activeTab === "recorded" ? "#0B1E36" : "#64748B",
            fontWeight: activeTab === "recorded" ? 800 : 500,
            fontSize: "14.5px",
            cursor: "pointer",
          }}
        >
          📼 Recorded Classes Archive ({recorded.length})
        </button>
      </div>

      {/* TAB 1: UPCOMING & PRESENT LECTURES */}
      {activeTab === "upcoming" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {classes.map((cls) => {
            const scheduledDate = new Date(cls.scheduled_time);
            const diffMinutes = Math.round((scheduledDate.getTime() - currentTime.getTime()) / (1000 * 60));
            const isWithin15Minutes = diffMinutes <= 15 && diffMinutes >= -120; // 15 mins before up to 2 hours after
            const isPast = diffMinutes < -120;

            let countdownLabel = "";
            if (diffMinutes > 60) {
              const hours = Math.floor(diffMinutes / 60);
              countdownLabel = `Starts in ~${hours} hr${hours > 1 ? "s" : ""}`;
            } else if (diffMinutes > 15) {
              countdownLabel = `Starts in ${diffMinutes} minutes`;
            } else if (diffMinutes > 0) {
              countdownLabel = `Starting soon (${diffMinutes}m left)`;
            } else if (!isPast) {
              countdownLabel = "🔴 Live Now in Session";
            } else {
              countdownLabel = "Concluded";
            }

            return (
              <div
                key={cls.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  border: isWithin15Minutes ? "2px solid #2563EB" : "1px solid #E2E8F0",
                  padding: "24px",
                  boxShadow: isWithin15Minutes ? "0 6px 20px rgba(37,99,235,0.12)" : "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 10 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: 4,
                          backgroundColor: cls.is_free ? "#DCFCE7" : "#FEF3C7",
                          color: cls.is_free ? "#166534" : "#92400E",
                          textTransform: "uppercase",
                        }}
                      >
                        {cls.is_free ? "FREE CLASS" : `PAID LECTURE · $${cls.price}`}
                      </span>

                      <span
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          backgroundColor: isWithin15Minutes ? "#EFF6FF" : "#F1F5F9",
                          color: isWithin15Minutes ? "#1D4ED8" : "#64748B",
                        }}
                      >
                        ⏱️ {countdownLabel}
                      </span>
                    </div>

                    <h2 style={{ fontSize: "17.5px", fontWeight: 800, color: "#0B1E36", margin: "0 0 6px" }}>
                      {cls.title}
                    </h2>
                    <div style={{ fontSize: "13px", color: "#475569" }}>
                      Preceptor: <strong>{cls.preceptor}</strong> · 🗓️ {scheduledDate.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} ({cls.duration})
                    </div>
                  </div>

                  {/* Actions according to Paid / Free and 15-Minute Link Security */}
                  <div style={{ textAlign: "right" }}>
                    {!cls.is_registered && !cls.is_free ? (
                      <button
                        onClick={() => handleAction(cls.id, false)}
                        disabled={registering === cls.id}
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#B4832A",
                          color: "#FFF",
                          borderRadius: 8,
                          border: "none",
                          fontSize: "13.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(180,131,42,0.25)",
                        }}
                      >
                        {registering === cls.id ? "Enrolling..." : `💳 Enroll & Pay ($${cls.price})`}
                      </button>
                    ) : isWithin15Minutes ? (
                      <a
                        href={cls.teams_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "11px 22px",
                          backgroundColor: "#2563EB",
                          color: "#FFFFFF",
                          borderRadius: 8,
                          fontSize: "14px",
                          fontWeight: 700,
                          textDecoration: "none",
                          boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                        }}
                      >
                        <span>📹</span> Join Live Class (Teams)
                      </a>
                    ) : (
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "9px 16px",
                            backgroundColor: "#F1F5F9",
                            color: "#64748B",
                            borderRadius: 8,
                            fontSize: "13px",
                            fontWeight: 600,
                            border: "1px solid #CBD5E1",
                          }}
                          title="Teams link unlocks 15 minutes prior to scheduled start time"
                        >
                          <span>🔒</span> Teams Link Unlocks 15m Prior
                        </div>
                        <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: 4 }}>
                          Link activates at {new Date(scheduledDate.getTime() - 15 * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: 1.5, margin: "10px 0 14px" }}>
                  {cls.description}
                </p>

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  {cls.tags?.map((t) => (
                    <span key={t} style={{ fontSize: "11px", color: "#475569", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", padding: "2px 8px", borderRadius: 4 }}>
                      #{t}
                    </span>
                  ))}
                  {isWithin15Minutes && (
                    <span style={{ fontSize: "12px", color: "#166534", fontWeight: 700, marginLeft: 8 }}>
                      ● Meeting ID: {cls.meeting_id} · Passcode: {cls.passcode}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: RECORDED LECTURES ARCHIVE */}
      {activeTab === "recorded" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {recorded.map((rec) => (
            <div
              key={rec.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                padding: "20px 24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#EEF2F6", color: "#0B1E36", borderRadius: 4, marginRight: 8 }}>
                    PAST LECTURE RECORDING
                  </span>
                  <span style={{ fontSize: "12px", color: "#64748B" }}>🗓️ {rec.recorded_at} · ⏱️ {rec.duration}</span>
                  <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0B1E36", margin: "8px 0 4px" }}>
                    {rec.title}
                  </h3>
                  <div style={{ fontSize: "13px", color: "#475569" }}>
                    Preceptor: <strong>{rec.preceptor}</strong>
                  </div>
                </div>

                <a
                  href={rec.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "9px 16px",
                    backgroundColor: "#7C3AED",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 700,
                    borderRadius: 6,
                    textDecoration: "none",
                  }}
                >
                  ▶ Watch Recording
                </a>
              </div>

              {rec.notes && (
                <p style={{ fontSize: "13px", color: "#64748B", margin: "8px 0", lineHeight: 1.5 }}>
                  {rec.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
