"use client";

import { useState, useEffect, useRef } from "react";

export default function QuestionTutorModal({
  isOpen,
  onClose,
  question,
  selectedOption = "",
  correctOption = "",
  rationale = "",
}) {
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize or reset chat when modal opens or question changes
  useEffect(() => {
    if (isOpen && question) {
      setMessages([
        {
          role: "assistant",
          content: `Hello! I am Dr. Janardhan Mydam. I see you are reviewing this case on **${question.subject || "Pediatrics"}** (${question.system || "Clinical Medicine"}).

Do you have a question about why the correct answer is **Option ${correctOption ? correctOption.slice(0, 1) : "A"}**, or would you like to debate a specific distractor? Ask me anything about the clinical reasoning or guidelines!`,
        },
      ]);
    }
  }, [isOpen, question?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!isOpen || !question) return null;

  const handleSendMessage = async (queryText) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const newStudentMsg = { role: "user", content: textToSend };
    const updatedMessages = [...messages, newStudentMsg];
    setMessages(updatedMessages);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/qbank/discuss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: question.id,
          question_stem: question.stem,
          selected_option: selectedOption,
          correct_option: correctOption,
          rationale: rationale || `${question.explanation_correct || ""} ${question.explanation_incorrect || ""}`,
          student_query: textToSend,
          history: messages.slice(-6), // Send last 6 turns for context
        }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error || "I encountered an issue retrieving the rationale. Please ask your question again.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network connectivity issue. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Why is my selected option incorrect?",
    "What is the first-line guideline here?",
    "Explain the pathophysiology behind this.",
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 99999,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "540px",
          height: "100%",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 35px rgba(0,0,0,0.25)",
          animation: "slideInRight 0.25s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: "#0E182A",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#B4832A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
              }}
            >
              👨‍⚕️
            </span>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
                Dr. Janardhan Mydam, MD
              </div>
              <div style={{ fontSize: "11px", color: "#E9C989" }}>
                Attending Clinical Preceptor &amp; Neonatologist
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "none",
              color: "#FFFFFF",
              borderRadius: "6px",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Question Snapshot Banner */}
        <div
          style={{
            padding: "12px 18px",
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
            fontSize: "12px",
            color: "#334155",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontWeight: 700, color: "#0F766E", textTransform: "uppercase", fontSize: "10.5px" }}>
              {question.subject || "Clinical Medicine"} · {question.system || "Pediatric Vignette"}
            </span>
            {correctOption && (
              <span style={{ fontWeight: 700, color: "#166534", backgroundColor: "#DCFCE7", padding: "1px 6px", borderRadius: "4px" }}>
                Key: {correctOption.slice(0, 1)}
              </span>
            )}
          </div>
          <p style={{ margin: 0, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4 }}>
            {question.stem}
          </p>
        </div>

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "18px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            backgroundColor: "#FAF9F6",
          }}
        >
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: isUser ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "86%",
                    padding: "12px 16px",
                    borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    backgroundColor: isUser ? "#0D9488" : "#FFFFFF",
                    color: isUser ? "#FFFFFF" : "#1E293B",
                    fontSize: "13.5px",
                    lineHeight: 1.55,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    border: isUser ? "none" : "1px solid #E2E8F0",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {!isUser && (
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#B4832A", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <span>🩺 Dr. Mydam Preceptor</span>
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: "14px 14px 14px 2px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  fontSize: "12.5px",
                  color: "#64748B",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span className="animate-spin">⏳</span> Consulting preceptor clinical guidelines...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ padding: "8px 16px", backgroundColor: "#FFFFFF", borderTop: "1px solid #E2E8F0", display: "flex", gap: "6px", overflowX: "auto" }}>
          {quickPrompts.map((chip) => (
            <button
              key={chip}
              onClick={() => handleSendMessage(chip)}
              disabled={loading}
              style={{
                backgroundColor: "#F1F5F9",
                border: "1px solid #CBD5E1",
                padding: "4px 10px",
                borderRadius: "14px",
                fontSize: "11px",
                fontWeight: 600,
                color: "#334155",
                whiteSpace: "nowrap",
                cursor: "pointer",
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            padding: "12px 16px 8px",
            backgroundColor: "#FFFFFF",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            type="text"
            placeholder="Debate this question or ask a doubt..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            style={{
              flex: 1,
              height: "42px",
              padding: "0 14px",
              fontSize: "13.5px",
              border: "1px solid #CBD5E1",
              borderRadius: "8px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            style={{
              padding: "0 18px",
              height: "42px",
              backgroundColor: "#8A2A34",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "13px",
              cursor: loading || !inputQuery.trim() ? "not-allowed" : "pointer",
              opacity: loading || !inputQuery.trim() ? 0.6 : 1,
            }}
          >
            Ask ➤
          </button>
        </form>

        {/* Feedback notification note */}
        <div style={{ padding: "6px 16px 10px", backgroundColor: "#FFFFFF", textAlign: "center", fontSize: "10.5px", color: "#94A3B8" }}>
          🛡️ Student inquiries &amp; disputes are recorded for Dr. Mydam&apos;s question authoring review.
        </div>
      </div>
    </div>
  );
}
