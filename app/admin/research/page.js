"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import MandatoryStar from "@/components/MandatoryStar";

export default function AdminResearchPage() {
  const [activeTab, setActiveTab] = useState("applications"); // "applications" | "groups" | "pricing"

  // Applications State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [approvalGroupId, setApprovalGroupId] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [resendNotificationAlert, setResendNotificationAlert] = useState(null);

  // Groups & Chat State
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [activeGroup, setActiveGroup] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [attachmentType, setAttachmentType] = useState("none"); // "none" | "link" | "doc" | "image"
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // New Group Modal
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupForm, setNewGroupForm] = useState({
    title: "",
    focus_area: "",
    teams_link: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_research_dr_mydam_chicago%40thread.v2/0",
    initial_member_name: "",
    initial_member_email: "",
  });
  const [creatingGroup, setCreatingGroup] = useState(false);

  // Pricing & Settings State
  const [settings, setSettings] = useState({
    pricing_type: "Free",
    price: "$0",
    is_accepting: true,
    default_teams_meeting_url: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_research_dr_mydam_chicago%40thread.v2/0",
    notification_service: "Resend",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Load Data
  const loadApplications = async () => {
    try {
      const res = await fetch("/api/admin/research/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingApps(false);
    }
  };

  const loadGroups = async () => {
    try {
      const res = await fetch("/api/admin/research/groups");
      if (res.ok) {
        const data = await res.json();
        const grps = data.groups || [];
        setGroups(grps);
        if (grps.length > 0 && !activeGroup) {
          setActiveGroup(grps[0]);
          setChatMessages(grps[0].messages || []);
          setApprovalGroupId(grps[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGroups(false);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/research/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadApplications();
    loadGroups();
    loadSettings();
  }, []);

  // Update messages when active group changes
  const handleSelectGroup = (grp) => {
    setActiveGroup(grp);
    setChatMessages(grp.messages || []);
  };

  // Handle Application Status Update
  const handleUpdateAppStatus = async (appId, status) => {
    setActionLoading(true);
    setResendNotificationAlert(null);
    try {
      const res = await fetch("/api/admin/research/applications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: appId,
          status,
          assigned_group_id: status === "Approved" ? approvalGroupId || groups[0]?.id : null,
          notes: approvalNotes || (status === "Approved" ? "Approved for collaborative study" : "Declined"),
        }),
      });
      const data = await res.json();
      if (res.ok && data.application) {
        setApplications((prev) =>
          prev.map((a) => (a.id === appId ? data.application : a))
        );
        setSelectedApp(null);
        setApprovalNotes("");

        if (data.resend_dispatch) {
          setResendNotificationAlert(data.resend_dispatch);
          setTimeout(() => setResendNotificationAlert(null), 7000);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Send Group Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!activeGroup) return;
    if (!newMessageText.trim() && attachmentType === "none") return;

    setSendingMessage(true);
    try {
      let attachments = [];
      if (attachmentType !== "none" && attachmentUrl.trim()) {
        attachments.push({
          name: attachmentName.trim() || (attachmentType === "link" ? "Reference Resource" : "Clinical Attachment"),
          type: attachmentType,
          url: attachmentUrl.trim(),
          size: attachmentType === "doc" ? "1.2 MB" : attachmentType === "image" ? "750 KB" : "Web URL",
        });
      }

      const res = await fetch(`/api/admin/research/groups/${activeGroup.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMessageText.trim(),
          attachments,
        }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setChatMessages((prev) => [...prev, data.message]);
        setNewMessageText("");
        setAttachmentType("none");
        setAttachmentName("");
        setAttachmentUrl("");

        // Also update local groups state
        setGroups((prev) =>
          prev.map((g) =>
            g.id === activeGroup.id ? { ...g, messages: [...(g.messages || []), data.message] } : g
          )
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle Create Group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupForm.title) return;
    setCreatingGroup(true);
    try {
      const members = [
        { id: "usr_admin", name: "Dr. Janardhan Mydam, MD, FAAP", email: "admin@jvmmedicalservices.com", role: "doctor" },
      ];
      if (newGroupForm.initial_member_email) {
        members.push({
          id: `usr_${Date.now()}`,
          name: newGroupForm.initial_member_name || "Trainee Researcher",
          email: newGroupForm.initial_member_email,
          role: "student",
        });
      }

      const res = await fetch("/api/admin/research/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newGroupForm.title,
          focus_area: newGroupForm.focus_area,
          teams_link: newGroupForm.teams_link,
          members,
        }),
      });
      const data = await res.json();
      if (res.ok && data.group) {
        setGroups([data.group, ...groups]);
        setActiveGroup(data.group);
        setChatMessages(data.group.messages || []);
        setShowNewGroupModal(false);
        setNewGroupForm({
          title: "",
          focus_area: "",
          teams_link: "https://teams.microsoft.com/l/meetup-join/19%3ameeting_research_dr_mydam_chicago%40thread.v2/0",
          initial_member_name: "",
          initial_member_email: "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingGroup(false);
    }
  };

  // Handle Save Pricing & Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/research/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <AdminShell>
      {/* Top Header */}
      <div className="dash-head" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", backgroundColor: "#EEF2FF", color: "#4338CA", borderRadius: 6, textTransform: "uppercase" }}>
              Core Pillar 1 of 4
            </span>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", backgroundColor: "#EDE9FE", color: "#5B21B6", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
              🟣 Microsoft Teams Pro: Connected
            </span>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", backgroundColor: "#ECFDF5", color: "#065F46", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
              ✉️ Resend Email: Live Dispatch
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: "26px" }}>Research Hub &amp; Mentorship Command Center</h1>
          <p className="sub" style={{ marginTop: 6, fontSize: "14px", color: "#64748B" }}>
            Direct governance by Dr. Janardhan Mydam. Review trainee applications, provision collaborative groups for friends &amp; colleagues, facilitate group chat discussions, and configure dynamic tuition pricing.
          </p>
        </div>
      </div>

      {/* Resend Email Dispatch Simulated Toast */}
      {resendNotificationAlert && (
        <div
          style={{
            backgroundColor: "#ECFDF5",
            border: "1.5px solid #10B981",
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 20,
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)",
          }}
        >
          <span style={{ fontSize: "20px" }}>✉️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#065F46" }}>
              Resend Email Service Triggered · Notification Dispatched
            </div>
            <div style={{ fontSize: "12.5px", color: "#047857", marginTop: 2 }}>
              To: <strong>{resendNotificationAlert.to}</strong> · Subject: <em>&ldquo;{resendNotificationAlert.subject}&rdquo;</em>
            </div>
            <div style={{ fontSize: "11.5px", color: "#059669", marginTop: 4, fontStyle: "italic" }}>
              &ldquo;{resendNotificationAlert.preview}&rdquo;
            </div>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#047857", backgroundColor: "#D1FAE5", padding: "2px 8px", borderRadius: 10 }}>
            DELIVERED (200 OK)
          </span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: 8, borderBottom: "1px solid #E2E8F0", paddingBottom: 12, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: "13px",
            fontWeight: activeTab === "applications" ? 700 : 500,
            backgroundColor: activeTab === "applications" ? "#0E182A" : "#FFFFFF",
            color: activeTab === "applications" ? "#FFFFFF" : "#475569",
            border: activeTab === "applications" ? "none" : "1px solid #CBD5E1",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          📋 Trainee Applications ({applications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("groups")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: "13px",
            fontWeight: activeTab === "groups" ? 700 : 500,
            backgroundColor: activeTab === "groups" ? "#0E182A" : "#FFFFFF",
            color: activeTab === "groups" ? "#FFFFFF" : "#475569",
            border: activeTab === "groups" ? "none" : "1px solid #CBD5E1",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          💬 Research Groups &amp; Group Chat ({groups.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pricing")}
          style={{
            padding: "8px 16px",
            borderRadius: 6,
            fontSize: "13px",
            fontWeight: activeTab === "pricing" ? 700 : 500,
            backgroundColor: activeTab === "pricing" ? "#0E182A" : "#FFFFFF",
            color: activeTab === "pricing" ? "#FFFFFF" : "#475569",
            border: activeTab === "pricing" ? "none" : "1px solid #CBD5E1",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ⚙️ Tuition Pricing &amp; Settings
        </button>
      </div>

      {/* TAB 1: TRAINEE APPLICATIONS PIPELINE */}
      {activeTab === "applications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px" }}>Trainee Mentorship Admissions Queue</h2>
              <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#64748B" }}>
                Evaluate student proposals. Approving an applicant automatically dispatches a simulated Resend confirmation email and attaches them to a research group.
              </p>
            </div>
          </div>

          {loadingApps ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>Loading research proposals...</div>
          ) : applications.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748B", backgroundColor: "#FFFFFF", borderRadius: 8, border: "1px solid #E2E8F0" }}>
              No research applications pending review.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {applications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: app.status === "Approved" ? "1px solid #86EFAC" : app.status === "Pending" ? "1.5px solid #FCD34D" : "1px solid #E2E8F0",
                    borderRadius: 10,
                    padding: "20px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <h3 style={{ margin: 0, fontSize: "17px", color: "#0F172A" }}>{app.full_name}</h3>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 10,
                            backgroundColor: app.status === "Approved" ? "#DCFCE7" : app.status === "Rejected" ? "#FEE2E2" : "#FEF3C7",
                            color: app.status === "Approved" ? "#15803D" : app.status === "Rejected" ? "#B91C1C" : "#B45309",
                          }}
                        >
                          {app.status.toUpperCase()}
                        </span>
                        <span style={{ fontSize: "11.5px", color: "#64748B" }}>
                          · {app.institution || "Medical School"}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", color: "#475569" }}>
                        📧 <strong>{app.email}</strong> · Applied on: {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      {app.status === "Pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setSelectedApp(app)}
                            className="btn btn-sm btn-primary"
                            style={{ backgroundColor: "#15803D", borderColor: "#15803D", fontSize: "12.5px" }}
                          >
                            ✓ Review &amp; Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateAppStatus(app.id, "Rejected")}
                            disabled={actionLoading}
                            style={{ padding: "6px 12px", border: "1px solid #FCA5A5", color: "#B91C1C", backgroundColor: "#FEF2F2", borderRadius: 6, fontSize: "12.5px", cursor: "pointer" }}
                          >
                            ✕ Decline
                          </button>
                        </>
                      ) : (
                        <div style={{ fontSize: "12.5px", color: "#64748B", fontStyle: "italic", alignSelf: "center" }}>
                          Status: <strong>{app.status}</strong> · Group: {app.assigned_group_id ? `#${app.assigned_group_id}` : "Unassigned"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Proposal Details */}
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #F1F5F9", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#334155", textTransform: "uppercase" }}>
                        Research Topic
                      </div>
                      <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#1E293B", marginTop: 2 }}>
                        {app.research_topic}
                      </div>
                      <div style={{ fontSize: "12.5px", color: "#475569", marginTop: 4, lineHeight: "1.4" }}>
                        {app.topic_description || "No specific hypothesis provided."}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#334155", textTransform: "uppercase" }}>
                        Team Collaborators / Friends
                      </div>
                      <div style={{ fontSize: "13px", color: "#1E293B", marginTop: 2 }}>
                        👥 {app.team_members || "Solo Trainee Application"}
                      </div>

                      <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#334155", textTransform: "uppercase" }}>
                          CV / Credentials Link
                        </div>
                        {app.resume_url ? (
                          <a
                            href={app.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: "12.5px", color: "#2563EB", fontWeight: 600, textDecoration: "underline" }}
                          >
                            📄 View Trainee CV / Credentials &rarr;
                          </a>
                        ) : (
                          <span style={{ fontSize: "12.5px", color: "#94A3B8" }}>Not provided</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* APPROVAL MODAL */}
          {selectedApp && (
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
                  borderRadius: 12,
                  padding: "26px",
                  maxWidth: "520px",
                  width: "100%",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: "19px" }}>Approve Candidate: {selectedApp.full_name}</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748B" }}
                  >
                    ✕
                  </button>
                </div>

                <p style={{ fontSize: "13px", color: "#64748B", marginBottom: 16 }}>
                  Approving this trainee will activate their research portal access and send an automated official acceptance letter via <strong>Resend</strong>.
                </p>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Assign to Collaborative Research Group
                  </label>
                  <select
                    value={approvalGroupId}
                    onChange={(e) => setApprovalGroupId(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title} ({g.focus_area})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                    Welcome Note from Dr. Mydam (Included in Resend Email)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Delighted to have you in the PREMOD2 study group. Review Table 1 in the group chat before Thursday's Teams sync."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 6, background: "#FFFFFF", cursor: "pointer", fontSize: "13px" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateAppStatus(selectedApp.id, "Approved")}
                    disabled={actionLoading}
                    style={{ padding: "8px 18px", backgroundColor: "#15803D", color: "#FFFFFF", border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontSize: "13px" }}
                  >
                    {actionLoading ? "Dispatching..." : "Confirm & Send Resend Email"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COLLABORATIVE RESEARCH GROUPS & ACTIVE GROUP CHAT */}
      {activeTab === "groups" && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20, minHeight: "600px", alignItems: "stretch" }}>
          {/* Groups Sidebar */}
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0", padding: "16px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: "16px" }}>Active Cohort Groups</h3>
              <button
                type="button"
                onClick={() => setShowNewGroupModal(true)}
                style={{ padding: "4px 8px", backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: 5, fontSize: "11.5px", fontWeight: 600, cursor: "pointer" }}
              >
                + New Group
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", flex: 1 }}>
              {groups.map((grp) => {
                const isSelected = activeGroup?.id === grp.id;
                return (
                  <div
                    key={grp.id}
                    onClick={() => handleSelectGroup(grp)}
                    style={{
                      padding: "12px",
                      borderRadius: 8,
                      border: isSelected ? "1.5px solid #2563EB" : "1px solid #E2E8F0",
                      backgroundColor: isSelected ? "#EFF6FF" : "#F8FAFC",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "13.5px", color: isSelected ? "#1D4ED8" : "#1E293B", marginBottom: 2 }}>
                      {grp.title}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#64748B", marginBottom: 6 }}>
                      {grp.focus_area}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94A3B8" }}>
                      <span>👥 {grp.members?.length || 1} members</span>
                      <span>💬 {grp.messages?.length || 0} messages</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Chat Main Window */}
          {activeGroup ? (
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Chat Header with MS Teams Button */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F8FAFC" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px", color: "#0F172A" }}>{activeGroup.title}</h3>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: 2 }}>
                    Led by <strong>{activeGroup.lead_doctor}</strong> · Members:{" "}
                    {activeGroup.members?.map((m) => m.name).join(", ") || "Dr. Janardhan Mydam"}
                  </div>
                </div>

                {/* MS Teams Integration Launch Button */}
                <a
                  href={activeGroup.teams_link || "https://teams.microsoft.com"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    backgroundColor: "#5B21B6",
                    color: "#FFFFFF",
                    borderRadius: 6,
                    fontSize: "12.5px",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 2px 6px rgba(91, 33, 182, 0.2)",
                  }}
                >
                  🟣 Launch MS Teams Call &#8599;
                </a>
              </div>

              {/* Chat Messages Stream */}
              <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, backgroundColor: "#F8FAFC", maxHeight: "480px" }}>
                {chatMessages.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#94A3B8", fontSize: "13px", padding: "40px" }}>
                    No messages in this group yet. Send a note, paper link, or document below!
                  </div>
                ) : (
                  chatMessages.map((msg) => {
                    const isDoctor = msg.sender_role === "doctor";
                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: isDoctor ? "flex-start" : "flex-end",
                          maxWidth: "80%",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", color: "#64748B", alignSelf: isDoctor ? "flex-start" : "flex-end" }}>
                          <strong>{msg.sender_name}</strong>
                          <span style={{ padding: "1px 6px", borderRadius: 8, fontSize: "10px", fontWeight: 700, backgroundColor: isDoctor ? "#FEF3C7" : "#EFF6FF", color: isDoctor ? "#92400E" : "#1D4ED8" }}>
                            {msg.sender_role?.toUpperCase()}
                          </span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>

                        {/* Message Bubble */}
                        <div
                          style={{
                            padding: "12px 16px",
                            borderRadius: isDoctor ? "0 12px 12px 12px" : "12px 0 12px 12px",
                            backgroundColor: isDoctor ? "#FFFFFF" : "#2563EB",
                            color: isDoctor ? "#1E293B" : "#FFFFFF",
                            border: isDoctor ? "1px solid #E2E8F0" : "none",
                            fontSize: "13.5px",
                            lineHeight: "1.45",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                          }}
                        >
                          <div>{msg.message}</div>

                          {/* Attachments */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                              {msg.attachments.map((att, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    padding: "8px 10px",
                                    borderRadius: 6,
                                    backgroundColor: isDoctor ? "#F1F5F9" : "rgba(255,255,255,0.15)",
                                    fontSize: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 8,
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    <span>
                                      {att.type === "image" ? "🖼️" : att.type === "doc" ? "📄" : "🔗"}
                                    </span>
                                    <span style={{ fontWeight: 600, textDecoration: "underline" }}>
                                      {att.name}
                                    </span>
                                    <span style={{ fontSize: "10px", opacity: 0.8 }}>({att.size})</span>
                                  </div>
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      color: isDoctor ? "#2563EB" : "#FFFFFF",
                                      fontWeight: 700,
                                      fontSize: "11.5px",
                                      textDecoration: "none",
                                    }}
                                  >
                                    Open &#8599;
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input & Attachments Controls */}
              <form onSubmit={handleSendMessage} style={{ padding: "16px", borderTop: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
                {/* Attachment Selection Row */}
                {attachmentType !== "none" && (
                  <div style={{ backgroundColor: "#F1F5F9", padding: "10px", borderRadius: 6, marginBottom: 10, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>
                      Attach {attachmentType.toUpperCase()}:
                    </span>
                    <input
                      type="text"
                      placeholder="Display Title / Label"
                      value={attachmentName}
                      onChange={(e) => setAttachmentName(e.target.value)}
                      style={{ padding: "5px 8px", fontSize: "12px", borderRadius: 4, border: "1px solid #CBD5E1", width: "160px" }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="URL or Upload Path (e.g. /uploads/sample_irb.pdf)"
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      style={{ padding: "5px 8px", fontSize: "12px", borderRadius: 4, border: "1px solid #CBD5E1", flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setAttachmentType("none");
                        setAttachmentName("");
                        setAttachmentUrl("");
                      }}
                      style={{ background: "none", border: "none", color: "#64748B", fontSize: "14px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {/* Attachment Type Selector */}
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      type="button"
                      title="Attach Web Link"
                      onClick={() => setAttachmentType("link")}
                      style={{ padding: "8px 10px", backgroundColor: attachmentType === "link" ? "#DBEAFE" : "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 6, cursor: "pointer", fontSize: "13px" }}
                    >
                      🔗
                    </button>
                    <button
                      type="button"
                      title="Attach Document (PDF/DOCX)"
                      onClick={() => setAttachmentType("doc")}
                      style={{ padding: "8px 10px", backgroundColor: attachmentType === "doc" ? "#DBEAFE" : "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 6, cursor: "pointer", fontSize: "13px" }}
                    >
                      📄
                    </button>
                    <button
                      type="button"
                      title="Attach Medical Image / Graph"
                      onClick={() => setAttachmentType("image")}
                      style={{ padding: "8px 10px", backgroundColor: attachmentType === "image" ? "#DBEAFE" : "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 6, cursor: "pointer", fontSize: "13px" }}
                    >
                      🖼️
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Type message to research cohort or share guidance..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                  />

                  <button
                    type="submit"
                    disabled={sendingMessage}
                    style={{ padding: "10px 20px", backgroundColor: "#0E182A", color: "#FFFFFF", border: "none", borderRadius: 6, fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                  >
                    {sendingMessage ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ padding: "60px", textAlign: "center", color: "#94A3B8" }}>
              Select a research group to open the collaborative chat.
            </div>
          )}

          {/* CREATE GROUP MODAL */}
          {showNewGroupModal && (
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
                  borderRadius: 12,
                  padding: "26px",
                  maxWidth: "540px",
                  width: "100%",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: "19px" }}>Create Collaborative Research Group</h3>
                  <button
                    type="button"
                    onClick={() => setShowNewGroupModal(false)}
                    style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748B" }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateGroup} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                      Group Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Non-Invasive High-Frequency Ventilation Registry"
                      value={newGroupForm.title}
                      onChange={(e) => setNewGroupForm({ ...newGroupForm, title: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                      Focus Area / Subspecialty
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Neonatal Pulmonology & BPD Prevention"
                      value={newGroupForm.focus_area}
                      onChange={(e) => setNewGroupForm({ ...newGroupForm, focus_area: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                      Microsoft Teams Meeting Link
                    </label>
                    <input
                      type="text"
                      value={newGroupForm.teams_link}
                      onChange={(e) => setNewGroupForm({ ...newGroupForm, teams_link: e.target.value })}
                      style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                        Lead Student Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Marcus Chen"
                        value={newGroupForm.initial_member_name}
                        onChange={(e) => setNewGroupForm({ ...newGroupForm, initial_member_name: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                        Lead Student Email
                      </label>
                      <input
                        type="email"
                        placeholder="marcus.chen@medschool.edu"
                        value={newGroupForm.initial_member_email}
                        onChange={(e) => setNewGroupForm({ ...newGroupForm, initial_member_email: e.target.value })}
                        style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                    <button
                      type="button"
                      onClick={() => setShowNewGroupModal(false)}
                      style={{ padding: "8px 14px", border: "1px solid #CBD5E1", borderRadius: 6, background: "#FFFFFF", cursor: "pointer", fontSize: "13px" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingGroup}
                      style={{ padding: "8px 18px", backgroundColor: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontSize: "13px" }}
                    >
                      {creatingGroup ? "Creating..." : "Create Group & Teams Hub"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TUITION PRICING & GLOBAL SETTINGS */}
      {activeTab === "pricing" && (
        <div style={{ maxWidth: "700px", backgroundColor: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0", padding: "26px" }}>
          <h2 style={{ margin: "0 0 4px", fontSize: "19px" }}>Research Mentorship Tuition &amp; Policy Controls</h2>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: 20 }}>
            Configure whether clinical research mentorship is offered free or as a paid enrollment. Changes take effect on the public research portal immediately.
          </p>

          {settingsSuccess && (
            <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #86EFAC", color: "#166534", padding: "12px", borderRadius: 6, fontSize: "13px", marginBottom: 18 }}>
              ✅ Research tuition and platform settings updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveSettings} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Free vs Paid Toggle */}
            <div style={{ backgroundColor: "#F8FAFC", padding: "16px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>
                Mentorship Tuition Model
              </label>
              <div style={{ display: "flex", gap: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "13.5px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="pricing_type"
                    value="Free"
                    checked={settings.pricing_type === "Free"}
                    onChange={() => setSettings({ ...settings, pricing_type: "Free", price: "$0" })}
                  />
                  <span><strong>Free ($0)</strong> — Trainee scholarship model (Current Default)</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "13.5px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="pricing_type"
                    value="Paid"
                    checked={settings.pricing_type === "Paid"}
                    onChange={() => setSettings({ ...settings, pricing_type: "Paid", price: "$650" })}
                  />
                  <span><strong>Paid</strong> — Custom tuition fee</span>
                </label>
              </div>
            </div>

            {settings.pricing_type === "Paid" && (
              <div>
                <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                  Tuition Fee (USD) <MandatoryStar />
                </label>
                <input
                  type="text"
                  required
                  value={settings.price}
                  onChange={(e) => setSettings({ ...settings, price: e.target.value })}
                  placeholder="e.g. $650"
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13.5px" }}
                />
              </div>
            )}

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Default Microsoft Teams Room URL
              </label>
              <input
                type="text"
                value={settings.default_teams_meeting_url || ""}
                onChange={(e) => setSettings({ ...settings, default_teams_meeting_url: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: 4 }}>
                Automated Notification Provider
              </label>
              <input
                type="text"
                disabled
                value="Resend Email Service (research-admissions@jvmmedicalservices.com)"
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: "13px", backgroundColor: "#F1F5F9", color: "#64748B" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button
                type="submit"
                disabled={savingSettings}
                style={{ padding: "10px 24px", backgroundColor: "#0E182A", color: "#FFFFFF", border: "none", borderRadius: 6, fontWeight: 700, fontSize: "13.5px", cursor: "pointer" }}
              >
                {savingSettings ? "Saving..." : "Save Tuition & Settings"}
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
