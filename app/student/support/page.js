"use client";

import { useEffect, useState } from "react";

export default function StudentSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyMessages, setReplyMessages] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [replying, setReplying] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const res = await fetch("/api/student/support");
      if (res.ok) {
        const json = await res.json();
        setTickets(json.tickets || []);
      }
    } catch (e) {
      console.error("Support tickets error:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/student/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create support ticket");

      setSuccess("Support ticket created! Our team will respond shortly.");
      setSubject("");
      setMessage("");
      loadTickets();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (ticketId) => {
    const text = replyMessages[ticketId];
    if (!text) return;

    setReplying((prev) => ({ ...prev, [ticketId]: true }));
    try {
      const res = await fetch("/api/student/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket_id: ticketId, message: text }),
      });
      if (res.ok) {
        setReplyMessages((prev) => ({ ...prev, [ticketId]: "" }));
        loadTickets();
      }
    } catch (e) {
      console.error("Reply error:", e);
    } finally {
      setReplying((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading support desk...</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
          Student Support &amp; Helpdesk
        </h2>
        <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
          Submit inquiries regarding tele-rotations, Microsoft Teams links, QBank access, or technical assistance.
        </p>
      </div>

      {/* New Ticket Form */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E6E2D8", padding: "24px", marginBottom: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#12203B", margin: "0 0 16px" }}>
          Open a Support Inquiry
        </h3>

        {success && <div style={{ padding: "10px 14px", backgroundColor: "#E8F5E9", color: "#2E7D3A", borderRadius: "6px", fontSize: "13px", marginBottom: "14px" }}>{success}</div>}
        {error && <div style={{ padding: "10px 14px", backgroundColor: "#FFEBEE", color: "#C62828", borderRadius: "6px", fontSize: "13px", marginBottom: "14px" }}>{error}</div>}

        <form onSubmit={handleCreateTicket}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>
              Subject / Topic
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Rotation schedule question, Teams access, or document upload verification"
              required
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }}
            />
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>
              Your Message
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide details about your question or issue..."
              required
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px", fontFamily: "inherit" }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              backgroundColor: "#8A2A34",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 24px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Sending..." : "Submit Ticket"}
          </button>
        </form>
      </div>

      {/* Ticket History */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E6E2D8", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#12203B", margin: "0 0 16px" }}>
          Your Support History
        </h3>

        {tickets.length === 0 ? (
          <p style={{ color: "#767C87", fontSize: "13px" }}>No past inquiries.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {tickets.map((tkt) => (
              <div key={tkt.id} style={{ padding: "18px", backgroundColor: "#F9F8F5", borderRadius: "8px", border: "1px solid #E6E2D8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#12203B", margin: 0 }}>
                      {tkt.subject}
                    </h4>
                    <span style={{ fontSize: "11px", color: "#767C87" }}>
                      Opened: {new Date(tkt.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <span style={{ backgroundColor: tkt.status === "Open" ? "#FFF8E1" : "#E8F5E9", color: tkt.status === "Open" ? "#B4832A" : "#2E7D3A", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                    {tkt.status}
                  </span>
                </div>

                {/* Messages Thread */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
                  {tkt.messages?.map((msg, mIdx) => {
                    const isStaff = msg.role === "admin";
                    return (
                      <div
                        key={mIdx}
                        style={{
                          padding: "10px 14px",
                          borderRadius: "6px",
                          backgroundColor: isStaff ? "#F0ECE1" : "#FFFFFF",
                          border: "1px solid #E6E2D8",
                          alignSelf: isStaff ? "flex-start" : "flex-end",
                          maxWidth: "85%",
                        }}
                      >
                        <div style={{ fontSize: "11px", fontWeight: 700, color: isStaff ? "#8A2A34" : "#12203B", marginBottom: "2px" }}>
                          {msg.sender} {isStaff && "(Staff Support)"}
                        </div>
                        <div style={{ fontSize: "13px", color: "#171A21", lineHeight: 1.4 }}>
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Input */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={replyMessages[tkt.id] || ""}
                    onChange={(e) => setReplyMessages({ ...replyMessages, [tkt.id]: e.target.value })}
                    placeholder="Type a follow-up reply..."
                    style={{ flex: 1, padding: "8px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }}
                  />
                  <button
                    onClick={() => handleSendReply(tkt.id)}
                    disabled={replying[tkt.id]}
                    style={{ backgroundColor: "#12203B", color: "#FFFFFF", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
