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

  // Payment Modal State
  const [selectedClassForPayment, setSelectedClassForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | upi | sandbox
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [billingName, setBillingName] = useState("Candidate Trainee");
  const [paying, setPaying] = useState(false);

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
    const interval = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRegisterFree = async (classId) => {
    setRegistering(classId);
    setMessage("");
    try {
      const res = await fetch("/api/student/live-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          class_id: classId,
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Registration failed");

      setMessage(resJson.message);
      await loadClasses();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setRegistering(null);
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!selectedClassForPayment) return;

    setPaying(true);
    setMessage("");
    try {
      const res = await fetch("/api/student/live-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pay",
          class_id: selectedClassForPayment.id,
          payment_details: {
            amount: selectedClassForPayment.price,
            payment_method: paymentMethod === "card" ? "Credit/Debit Card (Stripe Gateway)" : "Instant Medical Student Sandbox",
            card_last4: cardNumber.slice(-4) || "4242",
            billing_name: billingName,
          }
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Payment processing failed");

      setMessage(resJson.message);
      setSelectedClassForPayment(null);
      await loadClasses();
    } catch (err) {
      alert("Payment Error: " + err.message);
    } finally {
      setPaying(false);
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
        <div style={{ padding: "14px 18px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", borderRadius: 10, fontSize: "14px", fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "18px" }}>✓</span>
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage("")} style={{ background: "none", border: "none", color: "#166534", fontSize: "16px", cursor: "pointer" }}>✕</button>
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
          🗓️ Upcoming &amp; Scheduled Live Lectures ({classes.length})
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
          📼 Recorded Clinical Archives ({recorded.length})
        </button>
      </div>

      {/* TAB 1: UPCOMING & PRESENT LECTURES */}
      {activeTab === "upcoming" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {classes.map((cls) => {
            const scheduledDate = new Date(cls.scheduled_time);
            const diffMinutes = Math.round((scheduledDate.getTime() - currentTime.getTime()) / (1000 * 60));
            const isWithin15Minutes = diffMinutes <= 15 && diffMinutes >= -120; // 15 mins before up to 2 hours after
            const isPast = diffMinutes < -120;

            // Security Window Countdown calculation
            const unlockDate = new Date(scheduledDate.getTime() - 15 * 60 * 1000);
            const minutesUntilUnlock = Math.max(0, diffMinutes - 15);

            let unlockCountdownText = "";
            if (minutesUntilUnlock > 60 * 24) {
              const days = Math.floor(minutesUntilUnlock / (60 * 24));
              unlockCountdownText = `Unlocks on ${scheduledDate.toLocaleDateString([], { month: "short", day: "numeric" })} at ${scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} (~${days} day${days > 1 ? "s" : ""})`;
            } else if (minutesUntilUnlock > 60) {
              const hours = Math.floor(minutesUntilUnlock / 60);
              const mins = minutesUntilUnlock % 60;
              unlockCountdownText = `Unlocks in ${hours}h ${mins}m`;
            } else if (minutesUntilUnlock > 0) {
              unlockCountdownText = `Unlocks in ${minutesUntilUnlock} minutes`;
            } else if (isWithin15Minutes) {
              unlockCountdownText = "Unlocked · Teams Room Active";
            } else {
              unlockCountdownText = "Session Concluded";
            }

            return (
              <div
                key={cls.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 14,
                  border: isWithin15Minutes ? "2px solid #2563EB" : "1px solid #E2E8F0",
                  padding: "24px",
                  boxShadow: isWithin15Minutes ? "0 8px 24px rgba(37,99,235,0.12)" : "0 2px 10px rgba(0,0,0,0.03)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {isWithin15Minutes && (
                  <div style={{ position: "absolute", top: 0, right: 0, backgroundColor: "#2563EB", color: "#FFF", fontSize: "11px", fontWeight: 800, padding: "4px 12px", borderRadius: "0 0 0 8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    🔴 Teams Room Open Now
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ flex: "1 1 540px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 800,
                          padding: "3px 9px",
                          borderRadius: 6,
                          backgroundColor: cls.is_free ? "#DCFCE7" : "#FEF3C7",
                          color: cls.is_free ? "#166534" : "#92400E",
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                        }}
                      >
                        {cls.is_free ? "FREE LECTURE" : `PAID MASTERCLASS · $${cls.price}`}
                      </span>

                      {cls.is_registered && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 9px",
                            borderRadius: 6,
                            backgroundColor: "#EEF2F6",
                            color: "#0B1E36",
                          }}
                        >
                          ✓ Seat Confirmed
                        </span>
                      )}

                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "3px 9px",
                          borderRadius: 6,
                          backgroundColor: isWithin15Minutes ? "#EFF6FF" : "#F8FAFC",
                          color: isWithin15Minutes ? "#1D4ED8" : "#64748B",
                          border: "1px solid #E2E8F0",
                        }}
                      >
                        ⏱️ {unlockCountdownText}
                      </span>
                    </div>

                    <h2 style={{ fontSize: "18.5px", fontWeight: 800, color: "#0B1E36", margin: "0 0 6px" }}>
                      {cls.title}
                    </h2>

                    <p style={{ color: "#475569", fontSize: "13.5px", margin: "0 0 10px", lineHeight: 1.5 }}>
                      {cls.description}
                    </p>

                    <div style={{ fontSize: "13px", color: "#64748B", display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span>Preceptor: <strong>{cls.preceptor}</strong></span>
                      <span>🗓️ {scheduledDate.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })} at {scheduledDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      <span>⏳ {cls.duration}</span>
                    </div>
                  </div>

                  {/* ACTION SECTION ACCORDING TO PAYMENT & 15-MIN LOCK */}
                  <div style={{ flex: "0 0 auto", textAlign: "right", minWidth: 220 }}>
                    {!cls.is_registered ? (
                      cls.is_free ? (
                        <button
                          onClick={() => handleRegisterFree(cls.id)}
                          disabled={registering === cls.id}
                          style={{
                            padding: "11px 22px",
                            backgroundColor: "#0B1E36",
                            color: "#FFFFFF",
                            borderRadius: 8,
                            border: "none",
                            fontSize: "14px",
                            fontWeight: 700,
                            cursor: "pointer",
                            width: "100%",
                            boxShadow: "0 2px 8px rgba(11,30,54,0.15)",
                          }}
                        >
                          {registering === cls.id ? "Registering..." : "📝 Register for Free Class"}
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedClassForPayment(cls)}
                          style={{
                            padding: "11px 22px",
                            backgroundColor: "#B4832A",
                            color: "#FFFFFF",
                            borderRadius: 8,
                            border: "none",
                            fontSize: "14px",
                            fontWeight: 700,
                            cursor: "pointer",
                            width: "100%",
                            boxShadow: "0 2px 8px rgba(180,131,42,0.25)",
                          }}
                        >
                          💳 Enroll &amp; Pay ($${cls.price})
                        </button>
                      )
                    ) : isWithin15Minutes ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                        <a
                          href={cls.teams_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            padding: "12px 24px",
                            backgroundColor: "#2563EB",
                            color: "#FFFFFF",
                            borderRadius: 8,
                            fontSize: "14px",
                            fontWeight: 700,
                            textDecoration: "none",
                            boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                            width: "100%",
                          }}
                        >
                          <span>🎥</span>
                          <span>Join Microsoft Teams Class</span>
                        </a>
                        <div style={{ fontSize: "11.5px", color: "#64748B" }}>
                          Passcode: <code style={{ backgroundColor: "#F1F5F9", padding: "1px 5px", borderRadius: 4, fontWeight: 700, color: "#0B1E36" }}>{cls.passcode}</code>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                        <div
                          style={{
                            padding: "10px 18px",
                            backgroundColor: "#F1F5F9",
                            color: "#64748B",
                            borderRadius: 8,
                            border: "1px solid #E2E8F0",
                            fontSize: "13px",
                            fontWeight: 700,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <span>🔒</span>
                          <span>Teams Link Locked</span>
                        </div>
                        <div style={{ fontSize: "11px", color: "#94A3B8", textAlign: "right" }}>
                          Unlocks 15 minutes before scheduled start time
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: RECORDED CLASSES */}
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                  {rec.tags.map((t) => (
                    <span key={t} style={{ fontSize: "11px", fontWeight: 700, backgroundColor: "#F1F5F9", color: "#475569", padding: "2px 8px", borderRadius: 4 }}>
                      #{t}
                    </span>
                  ))}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0B1E36", margin: "0 0 4px" }}>
                  {rec.title}
                </h3>
                <div style={{ fontSize: "13px", color: "#64748B" }}>
                  Preceptor: <strong>{rec.preceptor}</strong> · Recorded: {rec.recorded_at} ({rec.duration})
                </div>
                <p style={{ fontSize: "12.5px", color: "#475569", margin: "6px 0 0" }}>
                  {rec.notes}
                </p>
              </div>

              <a
                href={rec.video_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 18px",
                  borderRadius: 8,
                  backgroundColor: "#0B1E36",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  shrink: 0,
                }}
              >
                ▶ Watch Recording
              </a>
            </div>
          ))}
        </div>
      )}

      {/* PAYMENT CHECKOUT MODAL */}
      {selectedClassForPayment && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(11, 30, 54, 0.65)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              width: "100%",
              maxWidth: 520,
              padding: "28px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              border: "1px solid #E2E8F0",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: "11px", fontWeight: 800, color: "#B4832A", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Clinical Lecture Enrollment
                </div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0B1E36", margin: "2px 0 0" }}>
                  Tuition Settlement &amp; Seat Reservation
                </h3>
              </div>
              <button
                onClick={() => setSelectedClassForPayment(null)}
                style={{ background: "none", border: "none", fontSize: "20px", color: "#94A3B8", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Lecture Summary Box */}
            <div style={{ backgroundColor: "#F8FAFC", borderRadius: 10, padding: "14px 16px", border: "1px solid #E2E8F0", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: "#0B1E36", fontSize: "14.5px", marginBottom: 4 }}>
                {selectedClassForPayment.title}
              </div>
              <div style={{ fontSize: "12.5px", color: "#64748B" }}>
                Preceptor: <strong>{selectedClassForPayment.preceptor}</strong>
              </div>
              <div style={{ fontSize: "12.5px", color: "#64748B", marginTop: 2 }}>
                Schedule: {new Date(selectedClassForPayment.scheduled_time).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: 14, marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "#475569", marginBottom: 6 }}>
                <span>Lecture Tuition</span>
                <span>${selectedClassForPayment.price}.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px", color: "#475569", marginBottom: 6 }}>
                <span>Platform &amp; Teams Pro Fee</span>
                <span style={{ color: "#166534", fontWeight: 600 }}>$0.00 (Waived)</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, color: "#0B1E36", paddingTop: 8, borderTop: "1px dashed #CBD5E1" }}>
                <span>Total Due</span>
                <span>${selectedClassForPayment.price}.00 USD</span>
              </div>
            </div>

            {/* Checkout Form */}
            <form onSubmit={handleConfirmPayment}>
              {/* Payment Method Selector */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", textTransform: "uppercase", marginBottom: 6 }}>
                  Select Payment Method
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    style={{
                      padding: "10px",
                      borderRadius: 8,
                      border: paymentMethod === "card" ? "2px solid #0B1E36" : "1px solid #CBD5E1",
                      backgroundColor: paymentMethod === "card" ? "#F0F4F8" : "#FFF",
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#0B1E36",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    💳 Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("sandbox")}
                    style={{
                      padding: "10px",
                      borderRadius: 8,
                      border: paymentMethod === "sandbox" ? "2px solid #0B1E36" : "1px solid #CBD5E1",
                      backgroundColor: paymentMethod === "sandbox" ? "#F0F4F8" : "#FFF",
                      fontWeight: 700,
                      fontSize: "13px",
                      color: "#0B1E36",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    ⚡ Verified 1-Click Pay
                  </button>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div style={{ spaceY: 12, marginBottom: 18 }}>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      required
                      style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13.5px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13.5px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13.5px", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        required
                        style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13.5px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "sandbox" && (
                <div style={{ padding: "14px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, marginBottom: 18, fontSize: "13px", color: "#166534" }}>
                  ✓ Instant Student Sandbox Checkout active. Click confirm below to simulate a live 3rd-party payment gateway transaction.
                </div>
              )}

              <button
                type="submit"
                disabled={paying}
                style={{
                  width: "100%",
                  padding: "13px",
                  backgroundColor: "#166534",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "14.5px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(22, 101, 52, 0.25)",
                }}
              >
                {paying ? "Processing Transaction..." : `Confirm Payment of $${selectedClassForPayment.price} USD →`}
              </button>

              <div style={{ marginTop: 10, textAlign: "center", fontSize: "11.5px", color: "#94A3B8" }}>
                🔒 256-Bit SSL Encrypted Payment · Receipt logged to Dr. Janardhan Mydam
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
