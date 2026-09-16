"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MandatoryStar from "@/components/MandatoryStar";
import CountryCodeSelect from "@/components/CountryCodeSelect";

export default function StudentResearchPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chat"); // chat | documents | meetings
  const [paying, setPaying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  // Chat message state
  const [newMsgText, setNewMsgText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Document upload state
  const [showDocModal, setShowDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocCategory, setNewDocCategory] = useState("Study Protocol");
  const [newDocUrl, setNewDocUrl] = useState("");

  const [countryCode, setCountryCode] = useState("+1");
  const [intakeForm, setIntakeForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    institution: "",
    research_topic: "Neonatal Respiratory Distress & Cord Management (PREMOD2)",
    proposal_summary: "",
    cv_url: "",
    prior_experience: "USMLE clinical clerkships completed; interested in academic pediatric research.",
  });

  const loadData = async () => {
    try {
      const res = await fetch("/api/student/research");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.application) {
          setIntakeForm({
            full_name: json.application.applicant_name || "",
            email: json.application.applicant_email || "",
            phone: json.application.phone || "",
            institution: json.application.institution || "",
            research_topic: json.application.research_topic || "Neonatal Respiratory Distress & Cord Management",
            proposal_summary: json.application.proposal_summary || "",
            cv_url: json.application.cv_url || "",
            prior_experience: json.application.prior_experience || "",
          });
        }
      }
    } catch (err) {
      console.error("Research load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIntakeSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!intakeForm.full_name || !intakeForm.email || !intakeForm.research_topic || !intakeForm.proposal_summary || !intakeForm.cv_url) {
      setErrorMsg("Full name, email, research topic, proposal summary, and CV link are mandatory (*).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/student/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply_intake",
          ...intakeForm,
          phone: `${countryCode} ${intakeForm.phone}`.trim(),
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Submission failed");

      setSuccessMsg("Research proposal and CV submitted successfully to Dr. Janardhan Mydam for review!");
      setShowEditForm(false);
      await loadData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayTuition = async () => {
    setPaying(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/student/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pay_tuition" }),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Payment failed");

      setSuccessMsg(resJson.message);
      await loadData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setPaying(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsgText.trim() && !attachmentUrl.trim()) return;

    setSendingMsg(true);
    try {
      const res = await fetch("/api/student/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_message",
          text: newMsgText.trim(),
          attachment_url: attachmentUrl.trim(),
          attachment_name: attachmentName.trim() || "Research Document",
        }),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Send message failed");

      setNewMsgText("");
      setAttachmentUrl("");
      setAttachmentName("");
      await loadData();
    } catch (err) {
      alert("Error sending message: " + err.message);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocUrl.trim()) return;

    try {
      const res = await fetch("/api/student/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upload_document",
          title: newDocTitle.trim(),
          category: newDocCategory,
          file_url: newDocUrl.trim(),
        }),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Upload failed");

      setNewDocTitle("");
      setNewDocUrl("");
      setShowDocModal(false);
      await loadData();
    } catch (err) {
      alert("Error sharing document: " + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748B" }}>
        <div style={{ width: 36, height: 36, border: "4px solid #0B1E36", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: "14px", fontWeight: 600 }}>Loading Research Mentorship status...</p>
        <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const app = data?.application;
  const isEnrolled = !!data?.is_enrolled;
  const isUnderReview = app && app.status === "Under Review";
  const isApprovedPendingPay = app && app.status === "Approved" && app.tier_type === "paid" && app.payment_status !== "Paid";

  // =========================================================================
  // STATE 1 & 2: NO APPLICATION OR EDITING INTAKE FORM
  // =========================================================================
  if (!app || showEditForm) {
    return (
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "30px 16px 60px" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, backgroundColor: "#EEF2F6", color: "#0B1E36", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 }}>
            🔬 Pediatric &amp; Neonatal Research Mentorship
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0B1E36", margin: "0 0 8px" }}>
            Research Mentorship Application &amp; Verification
          </h1>
          <p style={{ color: "#64748B", fontSize: "14.5px", maxWidth: 640, margin: "0 auto", lineHeight: 1.5 }}>
            Collaborate directly with <strong>Dr. Janardhan Mydam, MD, FAAP</strong> on clinical investigations, IRB protocols, and abstract publications. Submit your proposed topic and CV below for faculty approval.
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: "12px 16px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", borderRadius: 8, fontSize: "14px", marginBottom: 20 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: "12px 16px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", borderRadius: 8, fontSize: "14px", marginBottom: 20 }}>
            ✓ {successMsg}
          </div>
        )}

        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", padding: "28px 24px", boxShadow: "0 8px 30px rgba(11, 30, 54, 0.05)" }}>
          <form onSubmit={handleIntakeSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Full Candidate Name <MandatoryStar />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera, MD Candidate"
                  value={intakeForm.full_name}
                  onChange={(e) => setIntakeForm({ ...intakeForm, full_name: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Email Address <MandatoryStar />
                </label>
                <input
                  type="email"
                  placeholder="candidate@university.edu"
                  value={intakeForm.email}
                  onChange={(e) => setIntakeForm({ ...intakeForm, email: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Contact Mobile Number <MandatoryStar />
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                  <input
                    type="tel"
                    placeholder="555-0192"
                    value={intakeForm.phone}
                    onChange={(e) => setIntakeForm({ ...intakeForm, phone: e.target.value })}
                    style={{ flex: 1, height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: "0 6px 6px 0", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  University / Academic Affiliation <MandatoryStar />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Windsor University / Humboldt Park Health"
                  value={intakeForm.institution}
                  onChange={(e) => setIntakeForm({ ...intakeForm, institution: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Proposed Research Topic / Clinical Field <MandatoryStar />
              </label>
              <input
                type="text"
                placeholder="e.g. Neonatal Respiratory Distress Syndrome & Cord Milking (PREMOD2)"
                value={intakeForm.research_topic}
                onChange={(e) => setIntakeForm({ ...intakeForm, research_topic: e.target.value })}
                style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Resume / CV Link (Google Drive / Dropbox or URL) <MandatoryStar />
              </label>
              <input
                type="text"
                placeholder="https://drive.google.com/your-cv.pdf"
                value={intakeForm.cv_url}
                onChange={(e) => setIntakeForm({ ...intakeForm, cv_url: e.target.value })}
                style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                required
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Prior Research &amp; Academic Experience
              </label>
              <input
                type="text"
                placeholder="e.g. Completed systematic review, basic SPSS analysis, or clinical poster presentation"
                value={intakeForm.prior_experience}
                onChange={(e) => setIntakeForm({ ...intakeForm, prior_experience: e.target.value })}
                style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Research Proposal Summary &amp; Specific Aims <MandatoryStar />
              </label>
              <textarea
                rows={4}
                placeholder="Summarize the clinical question you wish to investigate with Dr. Mydam, your proposed methodology, and intended publication target (e.g. Pediatric Academic Societies / AAP National Conference)..."
                value={intakeForm.proposal_summary}
                onChange={(e) => setIntakeForm({ ...intakeForm, proposal_summary: e.target.value })}
                style={{ width: "100%", padding: "12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px 20px",
                backgroundColor: "#0B1E36",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "15px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(11, 30, 54, 0.15)",
              }}
            >
              {submitting ? "Submitting Proposal to Dr. Mydam..." : "Submit Research Proposal for Review →"}
            </button>

            {showEditForm && (
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                style={{ width: "100%", marginTop: 10, padding: "10px", backgroundColor: "transparent", border: "1px solid #CBD5E1", borderRadius: 8, color: "#64748B", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
              >
                Cancel &amp; Return
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 2: UNDER REVIEW
  // =========================================================================
  if (isUnderReview) {
    return (
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "40px 16px 60px" }}>
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "36px 28px", textAlign: "center", boxShadow: "0 8px 30px rgba(11, 30, 54, 0.05)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#FFFBEB", border: "2px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>
            🔬
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, backgroundColor: "#FEF3C7", color: "#92400E", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
            ● Proposal Under Faculty Evaluation
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0B1E36", margin: "0 0 10px" }}>
            Research Proposal Under Review
          </h2>

          <p style={{ color: "#64748B", fontSize: "15px", lineHeight: 1.6, maxWidth: 580, margin: "0 auto 24px" }}>
            Your research proposal submitted on <strong>{new Date(app.applied_at || Date.now()).toLocaleDateString()}</strong> is being evaluated by <strong>Dr. Janardhan Mydam, MD, FAAP</strong>. Dr. Mydam will review institutional IRB feasibility and approve your access.
          </p>

          <div style={{ backgroundColor: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", padding: "18px", textAlign: "left", maxWidth: 560, margin: "0 auto 24px", fontSize: "13.5px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", rowGap: 8, color: "#475569" }}>
              <div style={{ fontWeight: 600, color: "#0B1E36" }}>Applicant:</div>
              <div>{app.applicant_name} ({app.applicant_email})</div>
              <div style={{ fontWeight: 600, color: "#0B1E36" }}>Topic:</div>
              <div>{app.research_topic}</div>
              <div style={{ fontWeight: 600, color: "#0B1E36" }}>CV Document:</div>
              <div>
                <a href={app.cv_url} target="_blank" rel="noopener noreferrer" style={{ color: "#0284C7", textDecoration: "underline" }}>
                  View Submitted CV ↗
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowEditForm(true)}
            style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #CBD5E1", backgroundColor: "#FFF", color: "#334155", fontWeight: 600, fontSize: "13.5px", cursor: "pointer" }}
          >
            ✏️ Edit Research Proposal
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 3: APPROVED BUT PAYMENT PENDING
  // =========================================================================
  if (isApprovedPendingPay) {
    return (
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "40px 16px 60px" }}>
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, border: "1px solid #BBF7D0", padding: "36px 28px", textAlign: "center", boxShadow: "0 8px 30px rgba(11, 30, 54, 0.06)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#F0FDF4", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>
            🎉
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, backgroundColor: "#DCFCE7", color: "#166534", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
            ✓ Proposal Approved by Dr. Janardhan Mydam
          </div>

          <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0B1E36", margin: "0 0 10px" }}>
            Research Mentorship Admission Approved
          </h2>

          <p style={{ color: "#64748B", fontSize: "15px", lineHeight: 1.6, maxWidth: 580, margin: "0 auto 24px" }}>
            Dr. Mydam has approved your research proposal. Complete the mentorship tuition below to unlock the collaborative research group chat, protocol repository, and scheduled research conferences.
          </p>

          <div style={{ backgroundColor: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px", textAlign: "left", maxWidth: 480, margin: "0 auto 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 800, color: "#0B1E36", fontSize: "16px" }}>Research Mentorship Program</div>
                <div style={{ fontSize: "12.5px", color: "#64748B" }}>IRB Protocol, Biostatistics &amp; Co-Authorship Guidance</div>
              </div>
              <div style={{ fontSize: "24px", fontWeight: 900, color: "#0B1E36" }}>${app.fee || 350}</div>
            </div>
          </div>

          <button
            onClick={handlePayTuition}
            disabled={paying}
            style={{
              padding: "14px 32px",
              backgroundColor: "#166534",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "15px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(22, 101, 52, 0.25)",
            }}
          >
            {paying ? "Confirming..." : `💳 Confirm Admission & Pay Fee ($${app.fee || 350}) →`}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 4: APPROVED & ACTIVE (OR FREE) — FULL RESEARCH WORKSPACE
  // =========================================================================
  const messages = data?.messages || [];
  const documents = data?.documents || [];
  const meetings = data?.meetings || [];

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 16px 60px" }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: "#0B1E36", borderRadius: 14, padding: "24px 28px", color: "#FFFFFF", marginBottom: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)", color: "#93C5FD", fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
            ● Active Research Mentorship Workspace
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 4px" }}>
            Pediatric &amp; Neonatal Research Collaborative
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "13.5px", margin: 0 }}>
            Principal Faculty Investigator: <strong>Dr. Janardhan Mydam, MD, FAAP</strong> · Academic Clinical Preceptor
          </p>
        </div>

        {meetings[0] && (
          <a
            href={meetings[0].teams_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              borderRadius: 8,
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            <span>📹</span> Join Next Meeting
          </a>
        )}
      </div>

      {/* Navigation Sub-sections */}
      <div style={{ display: "flex", gap: 8, borderBottom: "2px solid #E2E8F0", paddingBottom: 0, marginBottom: 24 }}>
        {[
          { key: "chat", label: `💬 Collaborative Group Chat (${messages.length})` },
          { key: "documents", label: `📁 Documents & Protocol Vault (${documents.length})` },
          { key: "meetings", label: `🗓️ Doctor Scheduled Meetings (${meetings.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "12px 18px",
              border: "none",
              borderBottom: activeTab === tab.key ? "3px solid #0B1E36" : "3px solid transparent",
              backgroundColor: "transparent",
              color: activeTab === tab.key ? "#0B1E36" : "#64748B",
              fontWeight: activeTab === tab.key ? 800 : 500,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-SECTION 1: GROUP CHAT */}
      {activeTab === "chat" && (
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", height: 600 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 800, color: "#0B1E36", fontSize: "14.5px" }}>Research Cohort Roundtable Chat</div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>Dr. Janardhan Mydam &amp; Enrolled Trainees</div>
            </div>
          </div>

          {/* Messages Stream */}
          <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((m) => {
              const isDoctor = m.sender_role === "doctor";
              return (
                <div
                  key={m.id}
                  style={{
                    maxWidth: "80%",
                    alignSelf: isDoctor ? "flex-start" : "flex-end",
                    backgroundColor: isDoctor ? "#F8FAFC" : "#EFF6FF",
                    border: isDoctor ? "1px solid #E2E8F0" : "1px solid #BFDBFE",
                    borderRadius: 12,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 4 }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: isDoctor ? "#0B1E36" : "#1E40AF" }}>
                      {m.sender_name} {isDoctor && "⭐ (Faculty Preceptor)"}
                    </span>
                    <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: "13.5px", color: "#334155", lineHeight: 1.5 }}>
                    {m.text}
                  </p>

                  {m.attachments && m.attachments.length > 0 && (
                    <div style={{ marginTop: 8, paddingTop: 6, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      {m.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "12px", color: "#0284C7", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          📎 {att.name} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} style={{ padding: "14px 18px", borderTop: "1px solid #E2E8F0", backgroundColor: "#FAF9F6" }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <input
                type="text"
                placeholder="Type your message, clinical doubt, or research update..."
                value={newMsgText}
                onChange={(e) => setNewMsgText(e.target.value)}
                style={{ flex: 1, height: 42, padding: "0 14px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: "14px", outline: "none", backgroundColor: "#FFF" }}
              />
              <button
                type="submit"
                disabled={sendingMsg}
                style={{ padding: "0 22px", backgroundColor: "#0B1E36", color: "#FFF", fontWeight: 700, fontSize: "13.5px", borderRadius: 8, border: "none", cursor: "pointer" }}
              >
                {sendingMsg ? "Sending..." : "Send →"}
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="text"
                placeholder="Optional Drive / Document Link URL"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
                style={{ flex: 1, height: 32, padding: "0 10px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "12px", outline: "none", backgroundColor: "#FFF" }}
              />
              <input
                type="text"
                placeholder="Attachment Label (e.g. Table 1 Draft)"
                value={attachmentName}
                onChange={(e) => setAttachmentName(e.target.value)}
                style={{ width: 180, height: 32, padding: "0 10px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "12px", outline: "none", backgroundColor: "#FFF" }}
              />
            </div>
          </form>
        </div>
      )}

      {/* SUB-SECTION 2: DOCUMENTS & PROTOCOL VAULT */}
      {activeTab === "documents" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "14px", color: "#64748B" }}>
              Official research documents, study protocols, and institutional IRB consent templates.
            </div>
            <button
              onClick={() => setShowDocModal(true)}
              style={{ padding: "9px 16px", backgroundColor: "#0B1E36", color: "#FFF", borderRadius: 6, fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              + Share Document Link
            </button>
          </div>

          {showDocModal && (
            <div style={{ backgroundColor: "#F8FAFC", borderRadius: 10, border: "1px solid #CBD5E1", padding: "18px", marginBottom: 8 }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0B1E36", margin: "0 0 12px" }}>Share New Protocol / Manuscript Draft</h3>
              <form onSubmit={handleUploadDocument} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="text"
                  placeholder="Document Title (e.g. Statistical Analysis Plan v1.0)"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  style={{ height: 38, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "13.5px", outline: "none" }}
                  required
                />
                <input
                  type="text"
                  placeholder="Document Link (Google Drive / Dropbox URL)"
                  value={newDocUrl}
                  onChange={(e) => setNewDocUrl(e.target.value)}
                  style={{ height: 38, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "13.5px", outline: "none" }}
                  required
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button type="submit" style={{ padding: "8px 16px", backgroundColor: "#0B1E36", color: "#FFF", borderRadius: 6, border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}>
                    Add Document to Vault
                  </button>
                  <button type="button" onClick={() => setShowDocModal(false)} style={{ padding: "8px 14px", backgroundColor: "transparent", border: "1px solid #CBD5E1", borderRadius: 6, color: "#64748B", fontSize: "13px", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                padding: "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#EEF2F6", color: "#0B1E36", borderRadius: 4, marginRight: 8 }}>
                  {doc.category}
                </span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>🗓️ {doc.uploaded_at}</span>
                <h3 style={{ fontSize: "15.5px", fontWeight: 800, color: "#0B1E36", margin: "6px 0 2px" }}>
                  {doc.title}
                </h3>
                <div style={{ fontSize: "12.5px", color: "#64748B" }}>
                  Uploaded by: <strong>{doc.uploaded_by}</strong> ({doc.size})
                </div>
              </div>

              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#EEF2F6",
                  color: "#0B1E36",
                  fontWeight: 700,
                  fontSize: "13px",
                  borderRadius: 6,
                  textDecoration: "none",
                }}
              >
                View Document ↗
              </a>
            </div>
          ))}
        </div>
      )}

      {/* SUB-SECTION 3: DOCTOR SCHEDULED MEETINGS */}
      {activeTab === "meetings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "12px 18px", backgroundColor: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8, color: "#0369A1", fontSize: "13.5px" }}>
            🗓️ <strong>Faculty Research Conferences:</strong> Regularly scheduled meetings hosted by Dr. Janardhan Mydam on Microsoft Teams to review protocols, analyze data, and finalize abstracts.
          </div>

          {meetings.map((meet) => {
            const meetDate = new Date(meet.scheduled_time);
            return (
              <div
                key={meet.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  padding: "22px 24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#EEF2F6", color: "#0B1E36", borderRadius: 4, marginRight: 8 }}>
                      SCHEDULED CONFERENCE
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      🗓️ {meetDate.toLocaleDateString([], { month: "short", day: "numeric", weekday: "short" })} · ⏱️ {meetDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ({meet.duration})
                    </span>

                    <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0B1E36", margin: "8px 0 4px" }}>
                      {meet.title}
                    </h3>
                    <div style={{ fontSize: "13px", color: "#475569" }}>
                      Faculty Host: <strong>{meet.preceptor}</strong>
                    </div>
                  </div>

                  <a
                    href={meet.teams_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 18px",
                      backgroundColor: "#2563EB",
                      color: "#FFFFFF",
                      borderRadius: 6,
                      fontSize: "13px",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(37,99,235,0.25)",
                    }}
                  >
                    <span>📹</span> Join Teams Meeting
                  </a>
                </div>

                <p style={{ fontSize: "13.5px", color: "#64748B", margin: "8px 0 0", lineHeight: 1.5 }}>
                  <strong>Agenda:</strong> {meet.agenda}
                </p>

                <div style={{ fontSize: "12px", color: "#64748B", marginTop: 8 }}>
                  Meeting ID: <strong>{meet.meeting_id}</strong> · Passcode: <strong>{meet.passcode}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
