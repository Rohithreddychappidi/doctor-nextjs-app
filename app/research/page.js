"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatStrip from "@/components/StatStrip";
import { useSiteData } from "@/lib/DataContext";
import SectionDisclaimer from "@/components/SectionDisclaimer";

const statusLabel = { done: "Published", progress: "Under review", new: "In progress" };

const DISCUSSION_CATEGORIES = [
  "All Categories",
  "Neonatal Resuscitation & DCC",
  "Pediatric Cardiology",
  "Critical Care & Ventilation",
  "IRB & Study Design",
  "USMLE Research Electives & Publication Tips",
];

export default function ResearchPage() {
  const { content } = useSiteData();
  const c = content.research;

  // Dynamic research data
  const [discussions, setDiscussions] = useState([]);
  const [settings, setSettings] = useState({ pricing_type: "Free", price: "$0" });
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [activeDiscId, setActiveDiscId] = useState("disc_1"); // open first discussion by default

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyRole, setReplyRole] = useState("guest");
  const [replyingTo, setReplyingTo] = useState(null);
  const [submittingReply, setSubmittingReply] = useState(false);

  // New Discussion Modal
  const [showNewDiscModal, setShowNewDiscModal] = useState(false);
  const [discForm, setDiscForm] = useState({
    category: "Neonatal Resuscitation & DCC",
    title: "",
    content: "",
    author_name: "",
    author_role: "guest",
  });
  const [submittingDisc, setSubmittingDisc] = useState(false);

  // Apply Mentorship Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    full_name: "",
    email: "",
    institution: "",
    research_topic: "",
    topic_description: "",
    resume_url: "",
    team_members: "",
  });
  const [applying, setApplying] = useState(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState("");

  // Load discussions & settings
  useEffect(() => {
    async function loadData() {
      try {
        const [discRes, setRes] = useState ? await Promise.all([
          fetch("/api/research/discussions"),
          fetch("/api/research/settings"),
        ]) : [];

        if (discRes?.ok) {
          const dData = await discRes.json();
          setDiscussions(dData.discussions || []);
        }
        if (setRes?.ok) {
          const sData = await setRes.json();
          setSettings(sData.settings || { pricing_type: "Free", price: "$0" });
        }
      } catch (err) {
        console.error("Failed to load research data:", err);
      }
    }
    loadData();
  }, []);

  const handlePostDiscussion = async (e) => {
    e.preventDefault();
    if (!discForm.title || !discForm.content) return;
    setSubmittingDisc(true);
    try {
      const res = await fetch("/api/research/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discForm),
      });
      const data = await res.json();
      if (res.ok && data.discussion) {
        setDiscussions([data.discussion, ...discussions]);
        setActiveDiscId(data.discussion.id);
        setShowNewDiscModal(false);
        setDiscForm({
          category: "Neonatal Resuscitation & DCC",
          title: "",
          content: "",
          author_name: "",
          author_role: "guest",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDisc(false);
    }
  };

  const handlePostReply = async (discId) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/research/discussions/${discId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: replyAuthor.trim() || "Community Member",
          author_role: replyRole,
          content: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setDiscussions((prev) =>
          prev.map((d) =>
            d.id === discId ? { ...d, replies: [...(d.replies || []), data.reply] } : d
          )
        );
        setReplyText("");
        setReplyingTo(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleApplyMentorship = async (e) => {
    e.preventDefault();
    if (!applyForm.full_name || !applyForm.email || !applyForm.research_topic) return;
    setApplying(true);
    try {
      const res = await fetch("/api/research/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applyForm),
      });
      const data = await res.json();
      if (res.ok) {
        setApplySuccessMsg(
          "Application received! Dr. Janardhan Mydam will review your research proposal. If approved, you will be assigned to a collaborative research group with live group chat and Microsoft Teams meetings."
        );
        setTimeout(() => {
          setShowApplyModal(false);
          setApplySuccessMsg("");
          setApplyForm({
            full_name: "",
            email: "",
            institution: "",
            research_topic: "",
            topic_description: "",
            resume_url: "",
            team_members: "",
          });
        }, 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  const filteredDiscussions =
    selectedCategory === "All Categories"
      ? discussions
      : discussions.filter((d) => d.category === selectedCategory);

  return (
    <>
      <section className="hero" style={{ paddingBottom: 36 }}>
        <div className="container">
          <div className="eyebrow">{c.eyebrow}</div>
          <h1 style={{ maxWidth: 740 }}>{c.heading}</h1>
          <p className="lede" style={{ marginTop: 14 }}>
            Advancing neonatal transitions, oxygenation protocols, and evidence-based pediatric care.
            Explore open clinical debates or apply for direct research mentorship under Dr. Janardhan Mydam.
          </p>
        </div>
      </section>

      <section className="section soft tight">
        <div className="container">
          <SectionDisclaimer sectionKey="research" />
          <StatStrip />
        </div>
      </section>

      {/* 2 MAIN HERO CARDS SECTION */}
      <section className="section" style={{ paddingTop: 30, paddingBottom: 40 }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 36px" }}>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>Dual Research Pathway</div>
            <h2 style={{ fontSize: "28px", marginTop: 6 }}>Choose Your Research Track</h2>
            <p style={{ color: "var(--muted)", fontSize: "15px", marginTop: 8 }}>
              Open community inquiries for all physicians, students, and guests — alongside formal, physician-supervised research mentorship for aspiring authors.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: 28, alignItems: "stretch" }}>
            {/* CARD 1: GLOBAL RESEARCH DISCUSSIONS */}
            <div
              className="card"
              style={{
                backgroundColor: "#FFFFFF",
                border: "2px solid #E2E8F0",
                borderRadius: "14px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      backgroundColor: "#EEF2FF",
                      color: "#4338CA",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Card 1 · Open Community Forum
                  </span>
                  <h3 style={{ margin: 0, fontSize: "22px" }}>Global Research Discussions</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewDiscModal(true)}
                  className="btn btn-sm btn-primary"
                  style={{ whiteSpace: "nowrap", backgroundColor: "#2563EB", borderColor: "#2563EB" }}
                >
                  + Post a Doubt / Question
                </button>
              </div>

              <p style={{ fontSize: "14px", color: "#64748B", marginBottom: 20 }}>
                Open to all visitors, guests, and medical students. Ask doubts about neonatal study design,
                share hypothesis suggestions, or review clinical commentary provided by Dr. Janardhan Mydam.
              </p>

              {/* Category Pills Filter */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                {DISCUSSION_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "5px 11px",
                      borderRadius: "20px",
                      fontSize: "11.5px",
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      backgroundColor: selectedCategory === cat ? "#0E182A" : "#F1F5F9",
                      color: selectedCategory === cat ? "#FFFFFF" : "#475569",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Discussion Accordion List */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", maxHeight: "460px", paddingRight: 4 }}>
                {filteredDiscussions.length === 0 ? (
                  <div style={{ padding: "30px", textAlign: "center", color: "#94A3B8", fontSize: "14px", backgroundColor: "#F8FAFC", borderRadius: "8px" }}>
                    No discussions found in this module. Be the first to ask a doubt!
                  </div>
                ) : (
                  filteredDiscussions.map((disc) => {
                    const isOpen = activeDiscId === disc.id;
                    return (
                      <div
                        key={disc.id}
                        style={{
                          border: isOpen ? "1.5px solid #3B82F6" : "1px solid #E2E8F0",
                          borderRadius: "10px",
                          backgroundColor: isOpen ? "#FAFCFF" : "#FFFFFF",
                          padding: "16px",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          onClick={() => setActiveDiscId(isOpen ? null : disc.id)}
                          style={{ cursor: "pointer" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#2563EB", backgroundColor: "#DBEAFE", padding: "2px 8px", borderRadius: "10px" }}>
                              {disc.category}
                            </span>
                            <span style={{ fontSize: "12px", color: "#64748B" }}>
                              💬 {disc.replies?.length || 0} {disc.replies?.length === 1 ? "reply" : "replies"}
                            </span>
                          </div>
                          <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", color: "#0F172A" }}>
                            {disc.title}
                          </h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "#475569", lineHeight: "1.4" }}>
                            {disc.content}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, fontSize: "11.5px", color: "#94A3B8" }}>
                            <span>By <strong>{disc.author_name}</strong></span>
                            <span style={{ padding: "1px 6px", borderRadius: "8px", fontSize: "10px", fontWeight: 600, backgroundColor: disc.author_role === "doctor" ? "#FEF3C7" : disc.author_role === "student" ? "#E0E7FF" : "#F1F5F9", color: disc.author_role === "doctor" ? "#92400E" : disc.author_role === "student" ? "#3730A3" : "#475569" }}>
                              {disc.author_role?.toUpperCase()}
                            </span>
                            <span>· {new Date(disc.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Expandable Replies Section */}
                        {isOpen && (
                          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #E2E8F0" }}>
                            <div style={{ fontWeight: 600, fontSize: "12.5px", color: "#334155", marginBottom: 8 }}>
                              Community &amp; Faculty Responses:
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                              {disc.replies && disc.replies.length > 0 ? (
                                disc.replies.map((r) => (
                                  <div
                                    key={r.id}
                                    style={{
                                      padding: "10px 12px",
                                      backgroundColor: r.author_role === "doctor" ? "#FFFBEB" : "#F8FAFC",
                                      borderLeft: r.author_role === "doctor" ? "3px solid #F59E0B" : "3px solid #CBD5E1",
                                      borderRadius: "4px",
                                      fontSize: "12.5px",
                                    }}
                                  >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                                      <span style={{ fontWeight: 700, color: r.author_role === "doctor" ? "#B45309" : "#1E293B" }}>
                                        {r.author_name}
                                      </span>
                                      <span style={{ fontSize: "10.5px", color: "#94A3B8" }}>
                                        {new Date(r.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div style={{ color: "#334155", lineHeight: "1.45" }}>{r.content}</div>
                                  </div>
                                ))
                              ) : (
                                <p style={{ fontSize: "12px", color: "#94A3B8", fontStyle: "italic", margin: "4px 0" }}>
                                  No responses yet. Share your clinical suggestion below.
                                </p>
                              )}
                            </div>

                            {/* Reply Input Form */}
                            {replyingTo === disc.id ? (
                              <div style={{ backgroundColor: "#F1F5F9", padding: "12px", borderRadius: "8px" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                                  <input
                                    type="text"
                                    placeholder="Your Name (e.g. Dr. John / Alex)"
                                    value={replyAuthor}
                                    onChange={(e) => setReplyAuthor(e.target.value)}
                                    style={{ padding: "6px 10px", fontSize: "12px", borderRadius: 5, border: "1px solid #CBD5E1" }}
                                  />
                                  <select
                                    value={replyRole}
                                    onChange={(e) => setReplyRole(e.target.value)}
                                    style={{ padding: "6px 10px", fontSize: "12px", borderRadius: 5, border: "1px solid #CBD5E1" }}
                                  >
                                    <option value="guest">Guest / Community</option>
                                    <option value="student">Medical Student</option>
                                  </select>
                                </div>
                                <textarea
                                  rows={2}
                                  placeholder="Write your clinical insight or suggestion..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  style={{ width: "100%", padding: "8px 10px", fontSize: "12.5px", borderRadius: 5, border: "1px solid #CBD5E1", marginBottom: 8 }}
                                />
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                  <button
                                    type="button"
                                    onClick={() => setReplyingTo(null)}
                                    style={{ padding: "5px 10px", fontSize: "12px", border: "none", background: "none", cursor: "pointer", color: "#64748B" }}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handlePostReply(disc.id)}
                                    disabled={submittingReply}
                                    style={{ padding: "6px 14px", backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: 5, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                                  >
                                    {submittingReply ? "Posting..." : "Submit Reply"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingTo(disc.id);
                                  setReplyText("");
                                }}
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: "#2563EB",
                                  background: "none",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                }}
                              >
                                ✍️ Add Your Suggestion or Clinical Opinion &rarr;
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* CARD 2: RESEARCH HELP BY OUR DOCTOR (MENTORSHIP TRACK) */}
            <div
              className="card"
              style={{
                backgroundColor: "#FFFFFF",
                border: "2px solid #B4832A",
                borderRadius: "14px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 20px rgba(180, 131, 42, 0.08)",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 10px",
                      borderRadius: "16px",
                      backgroundColor: "#FEF3C7",
                      color: "#92400E",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Card 2 · Physician Mentorship Track
                  </span>
                  <h3 style={{ margin: 0, fontSize: "22px" }}>Research Help by Dr. Janardhan Mydam</h3>
                </div>
                {/* Tuition Status Badge */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", color: "#166534" }}>
                    Tuition Status
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#15803D" }}>
                    {settings.pricing_type === "Free" ? "FREE ($0)" : settings.price}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "14px", color: "#64748B", marginBottom: 18 }}>
                Structured clinical inquiry track akin to Tele-Rotation. Submit your research interests,
                CV, and co-investigator team members. Dr. Janardhan Mydam evaluates proposals, admits candidates,
                and establishes dedicated collaborative research groups with live group chat, document review, and Microsoft Teams meetings.
              </p>

              {/* Mentorship Highlights Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div style={{ backgroundColor: "#F8FAFC", padding: "12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#0E182A", marginBottom: 2 }}>
                    📑 IRB Protocol &amp; Design
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>
                    Draft hypothesis, ethical disclosures, and multicenter cohort variables.
                  </div>
                </div>
                <div style={{ backgroundColor: "#F8FAFC", padding: "12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#0E182A", marginBottom: 2 }}>
                    💬 Collaborative Group Chat
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>
                    Dedicated group chat for you and friends to share datasets, links, and documents.
                  </div>
                </div>
                <div style={{ backgroundColor: "#F8FAFC", padding: "12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#0E182A", marginBottom: 2 }}>
                    🎥 MS Teams Research Sync
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>
                    Weekly virtual case conferences and statistical analysis reviews.
                  </div>
                </div>
                <div style={{ backgroundColor: "#F8FAFC", padding: "12px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#0E182A", marginBottom: 2 }}>
                    📜 PubMed Co-Authorship
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>
                    Strict compliance with ICMJE authorship criteria for peer-reviewed journals.
                  </div>
                </div>
              </div>

              {/* Call to action & Multi-friend highlight */}
              <div style={{ backgroundColor: "#FEF9EE", border: "1px dashed #D97706", padding: "12px 16px", borderRadius: 8, marginBottom: 20 }}>
                <div style={{ fontSize: "12.5px", color: "#92400E" }}>
                  👥 <strong>Group Applications Supported:</strong> Multiple friends or classmates conducting the same study can apply together. Upon Dr. Mydam&apos;s approval, a unified collaborative research group will be provisioned for your entire team.
                </div>
              </div>

              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  className="btn btn-primary"
                  style={{
                    backgroundColor: "#B4832A",
                    borderColor: "#B4832A",
                    color: "#FFFFFF",
                    fontSize: "14px",
                    fontWeight: 700,
                    padding: "14px",
                    textAlign: "center",
                  }}
                >
                  Apply for Research Mentorship ({settings.pricing_type === "Free" ? "Currently Free" : settings.price}) &rarr;
                </button>
                <div style={{ textAlign: "center", fontSize: "12px", color: "#64748B" }}>
                  Already approved? Access your collaborative group in the{" "}
                  <Link href="/student/research" style={{ color: "#2563EB", fontWeight: 600 }}>
                    Student Research Hub &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL 1: POST A DOUBT / QUESTION */}
      {showNewDiscModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(14, 24, 42, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              padding: "26px",
              maxWidth: "540px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: "20px" }}>Post a Research Doubt / Inquiry</h3>
              <button
                type="button"
                onClick={() => setShowNewDiscModal(false)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748B" }}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: 16 }}>
              Share your clinical or research question with the JVM Medical Services community. Anyone can view and reply.
            </p>

            <form onSubmit={handlePostDiscussion} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Research Module / Field
                </label>
                <select
                  value={discForm.category}
                  onChange={(e) => setDiscForm({ ...discForm, category: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                >
                  {DISCUSSION_CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ayesha Siddiqui"
                    value={discForm.author_name}
                    onChange={(e) => setDiscForm({ ...discForm, author_name: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Your Role
                  </label>
                  <select
                    value={discForm.author_role}
                    onChange={(e) => setDiscForm({ ...discForm, author_role: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  >
                    <option value="guest">Guest / Public Visitor</option>
                    <option value="student">Medical Student / Resident</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Question Title / Hypothesis Summary
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near-infrared spectroscopy in delayed cord clamping..."
                  value={discForm.title}
                  onChange={(e) => setDiscForm({ ...discForm, title: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Details &amp; Clinical Context
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the clinical dilemma, trial parameters, or question you would like answered..."
                  value={discForm.content}
                  onChange={(e) => setDiscForm({ ...discForm, content: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowNewDiscModal(false)}
                  style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 6, background: "#FFFFFF", cursor: "pointer", fontSize: "13px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDisc}
                  style={{ padding: "8px 18px", backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: 6, fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
                >
                  {submittingDisc ? "Publishing..." : "Publish Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: APPLY FOR DOCTOR RESEARCH MENTORSHIP */}
      {showApplyModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(14, 24, 42, 0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              padding: "28px",
              maxWidth: "600px",
              width: "100%",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#92400E", backgroundColor: "#FEF3C7", padding: "2px 8px", borderRadius: 10 }}>
                  ADMISSIONS &amp; PROPOSAL FORM
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: "20px" }}>Research Mentorship Application</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#64748B" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: 16 }}>
              Under Dr. Janardhan Mydam&apos;s direct mentorship. Currently offered <strong>FREE ($0)</strong>.
              If multiple colleagues are collaborating on the same paper, list them in the team field below.
            </p>

            {applySuccessMsg ? (
              <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #86EFAC", color: "#166534", padding: "16px", borderRadius: 8, fontSize: "13.5px", lineHeight: "1.5" }}>
                ✅ {applySuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleApplyMentorship} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera, MD"
                      value={applyForm.full_name}
                      onChange={(e) => setApplyForm({ ...applyForm, full_name: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex.rivera@medschool.edu"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Current Medical School / Hospital Institution
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Windsor University School of Medicine / Cook County Hospital"
                    value={applyForm.institution}
                    onChange={(e) => setApplyForm({ ...applyForm, institution: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Research Topic of Interest *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Less Invasive Surfactant Administration in Moderate Preterms"
                    value={applyForm.research_topic}
                    onChange={(e) => setApplyForm({ ...applyForm, research_topic: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Hypothesis, Project Description &amp; Goals
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Outline your background, target journal, and what you hope to achieve under Dr. Mydam..."
                    value={applyForm.topic_description}
                    onChange={(e) => setApplyForm({ ...applyForm, topic_description: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    CV / Resume Link or Reference URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/your-cv.pdf or LinkedIn URL"
                    value={applyForm.resume_url}
                    onChange={(e) => setApplyForm({ ...applyForm, resume_url: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Friends / Co-Investigators (if doing this research together)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Vance (marcus@email.com), Sarah Jenkins (sarah@email.com)"
                    value={applyForm.team_members}
                    onChange={(e) => setApplyForm({ ...applyForm, team_members: e.target.value })}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                  <span style={{ fontSize: "11px", color: "#64748B", marginTop: 2, display: "block" }}>
                    If approved, Dr. Mydam creates a unified research group where all friends can chat, share files, and meet.
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 6, background: "#FFFFFF", cursor: "pointer", fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    style={{ padding: "8px 20px", backgroundColor: "#B4832A", color: "#FFFFFF", border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontSize: "13px" }}
                  >
                    {applying ? "Submitting..." : "Submit Mentorship Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ONGOING STUDIES & PUBLICATIONS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Clinical Trials</div>
              <h2>Currently active studies &amp; clinical cohorts</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {c.ongoing.map((o) => (
              <div className="card" key={o.heading}>
                <div className="pill accent">{o.status}</div>
                <h3 style={{ marginTop: 16 }}>{o.heading}</h3>
                <p>{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Publications</div>
              <h2>Selected peer-reviewed literature</h2>
            </div>
          </div>
          <div className="panel" style={{ padding: 0 }}>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Focus</th>
                    <th>Year</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {c.publications.map((p) => (
                    <tr key={p.title}>
                      <td className="strong">{p.title}</td>
                      <td>{p.focus}</td>
                      <td>{p.year}</td>
                      <td>
                        <span className={`status ${p.status}`}>{statusLabel[p.status]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
