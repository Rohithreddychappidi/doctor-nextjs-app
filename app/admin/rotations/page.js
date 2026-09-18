"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

const MEETING_TYPES = [
  { type: "Live Teaching Session", icon: "🎥", desc: "Standard clinical teaching rounds / case conference", color: "#2563EB", bg: "#EFF6FF" },
  { type: "Examine Call", icon: "⚖️", desc: "Formal assessment / oral OSCE meeting with score & grading", color: "#B45309", bg: "#FEF3C7" },
  { type: "Mentor Check-in", icon: "👨‍⚕️", desc: "1-on-1 progress & ERAS advisory conversation", color: "#0D9488", bg: "#F0FDFA" },
  { type: "Make-up Session", icon: "🔄", desc: "Rescheduled session for missed clinical rounds", color: "#4F46E5", bg: "#EEF2FF" },
  { type: "Orientation Call", icon: "🧭", desc: "First-week cohort kickoff and EMR onboarding", color: "#059669", bg: "#ECFDF5" },
];

export default function AdminRotationsPage() {
  const [activeTab, setActiveTab] = useState("applications");
  const [applications, setApplications] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [recordedSessions, setRecordedSessions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  // Announcement Form
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    category: "General Clinical Notice",
    priority: "Normal",
    requires_ack: false,
    action_url: "",
    target_cohort: "cohort_fall_2026",
  });
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  // Recorded Session Form
  const [newRecording, setNewRecording] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    duration: "1 hr 15 min",
    preceptor: "Dr. Janardhan Mydam, MD, FAAP",
    video_url: "",
    notes: "",
    tags: "NRP, Neonatology, Bedside Rounds"
  });
  const [addingRecording, setAddingRecording] = useState(false);

  // Filters
  const [appFilter, setAppFilter] = useState("ALL");
  const [appSearch, setAppSearch] = useState("");
  const [meetingTypeFilter, setMeetingTypeFilter] = useState("ALL");

  // Modals & Actions
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(null); // holds meeting object
  const [showDocRequestModal, setShowDocRequestModal] = useState(null); // holds application object
  const [showEvaluationModal, setShowEvaluationModal] = useState(null); // holds enrollment object
  const [toastMsg, setToastMsg] = useState("");

  // New Meeting Form
  const [newMeeting, setNewMeeting] = useState({
    rotation_enrollment_id: "rot_enr_a",
    cohort_id: "cohort_fall_2026",
    meeting_type: "Live Teaching Session",
    title: "",
    scheduled_at: "",
    duration_minutes: 60,
    physician: "Dr. Janardhan Mydam, MD, FAAP",
    attendee_scope: "cohort",
    student_id: "",
    teams_join_url: "",
    teams_meeting_id: "",
    teams_passcode: "",
    recording_url: "",
    ai_summary: "",
    is_pro: true,
    materials_url: "",
    notes: "",
    repeat_weeks: 1,
  });

  // Grade Form
  const [gradeForm, setGradeForm] = useState({ score: 85, pass_fail: "Pass", grader_notes: "" });

  // Doc Request Form
  const [docRequestItems, setDocRequestItems] = useState([
    "Official Medical School Transcript",
    "Dean's Letter of Good Standing",
  ]);

  // Evaluation Form
  const [evalForm, setEvalForm] = useState({ grade_letter: "Honors", written_evaluation: "" });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/admin/rotations");
      if (res.ok) {
        const json = await res.json();
        setApplications(json.applications || []);
        setMeetings(json.meetings || []);
        setEnrollments(json.enrollments || []);
        setAnnouncements(json.announcements || []);
        setStats(json.stats || {});
      }
      const rotRes = await fetch("/api/student/rotations");
      if (rotRes.ok) {
        const rotJson = await rotRes.json();
        setRecordedSessions(rotJson.recorded_sessions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handlePostAnnouncement(e) {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.message) {
      alert("Title and message are required.");
      return;
    }
    setPostingAnnouncement(true);
    try {
      const res = await fetch("/api/admin/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "post_announcement",
          ...newAnnouncement,
        }),
      });
      if (res.ok) {
        notify("📢 Clinical announcement posted to trainee portal!");
        setNewAnnouncement({
          title: "",
          message: "",
          category: "General Clinical Notice",
          priority: "Normal",
          requires_ack: false,
          action_url: "",
          target_cohort: "cohort_fall_2026",
        });
        loadData();
      }
    } catch (err) {
      alert("Error posting announcement: " + err.message);
    } finally {
      setPostingAnnouncement(false);
    }
  }

  async function handleAddRecording(e) {
    e.preventDefault();
    if (!newRecording.title || !newRecording.video_url) {
      alert("Recording Title and Video URL are required.");
      return;
    }
    setAddingRecording(true);
    try {
      const res = await fetch("/api/admin/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_recorded_session",
          ...newRecording,
          tags: newRecording.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        notify("Recorded clinical session link published successfully!");
        setNewRecording({
          title: "",
          date: new Date().toISOString().split("T")[0],
          duration: "1 hr",
          preceptor: "Dr. Janardhan Mydam, MD, FAAP",
          video_url: "",
          notes: "",
          tags: "NRP, NICU, Rounds",
        });
        loadData();
      }
    } catch (err) {
      alert("Error adding recording: " + err.message);
    } finally {
      setAddingRecording(false);
    }
  }

  function notify(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 5000);
  }

  // Application Actions
  async function handleAppStatus(appId, newStatus, tierType = "paid", tuitionFee = 1250) {
    try {
      const res = await fetch("/api/admin/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_app_status",
          applicationId: appId,
          status: newStatus,
          tier_type: tierType,
          tuition_fee: tuitionFee
        }),
      });
      if (res.ok) {
        notify(`Application marked as ${newStatus} (${tierType === "free" ? "Free Scholarship" : `Paid Tuition $${tuitionFee}`})`);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSendDocRequest(e) {
    e.preventDefault();
    if (!showDocRequestModal) return;
    try {
      const res = await fetch("/api/admin/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_documents",
          applicationId: showDocRequestModal.id,
          requested_documents: docRequestItems,
        }),
      });
      if (res.ok) {
        notify(`Document request email sent to ${showDocRequestModal.applicant_email}`);
        setShowDocRequestModal(null);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Meeting Creation
  async function handleCreateMeeting(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_meeting",
          ...newMeeting,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (newMeeting.repeat_weeks > 1) {
          // Trigger duplicate
          await fetch("/api/admin/rotations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "duplicate_meetings",
              base_meeting_id: json.meeting.id,
              repeat_weeks: newMeeting.repeat_weeks,
            }),
          });
          notify(`Scheduled meeting & generated ${newMeeting.repeat_weeks} weekly instances!`);
        } else {
          notify("New rotation meeting scheduled successfully!");
        }
        setShowAddMeetingModal(false);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Grade Examine Call
  async function handleSaveGrade(e) {
    e.preventDefault();
    if (!showGradeModal) return;
    try {
      const res = await fetch("/api/admin/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grade_examine_call",
          meeting_id: showGradeModal.id,
          score: gradeForm.score,
          pass_fail: gradeForm.pass_fail,
          grader_notes: gradeForm.grader_notes,
        }),
      });
      if (res.ok) {
        notify(`Examine Call graded: ${gradeForm.score}% (${gradeForm.pass_fail}) recorded!`);
        setShowGradeModal(null);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Final Evaluation & Certificate
  async function handlePublishEvaluation(e) {
    e.preventDefault();
    if (!showEvaluationModal) return;
    try {
      const res = await fetch("/api/admin/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish_evaluation",
          enrollmentId: showEvaluationModal.id,
          grade_letter: evalForm.grade_letter,
          written_evaluation: evalForm.written_evaluation,
        }),
      });
      if (res.ok) {
        notify("Attending final evaluation published & certificate issued!");
        setShowEvaluationModal(null);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchStatus = appFilter === "ALL" || app.status === appFilter;
    const matchText = (app.applicant_name || "").toLowerCase().includes(appSearch.toLowerCase()) ||
      (app.medical_school || "").toLowerCase().includes(appSearch.toLowerCase());
    return matchStatus && matchText;
  });

  // Filtered Meetings
  const filteredMeetings = meetings.filter((m) => {
    return meetingTypeFilter === "ALL" || m.meeting_type === meetingTypeFilter;
  });

  return (
    <AdminShell>
      <div style={{ maxWidth: "1200px", padding: "28px 32px" }}>
        {/* Title & Eyebrow */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#B4832A", marginBottom: "4px" }}>
            Clinical &amp; Rotations Administration
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#12203B", margin: 0 }}>
            Tele-Rotation Cohort &amp; Meeting Management Hub
          </h1>
          <p style={{ fontSize: "13px", color: "#64748B", marginTop: "4px", margin: 0 }}>
            Streamlined pipeline for applicant queue, flexible multi-meeting cohort scheduling, Examine Call grading, and certificate issuance.
          </p>
        </div>

        {toastMsg && (
          <div style={{ padding: "12px 18px", backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", borderRadius: "8px", fontSize: "13px", fontWeight: 700, marginBottom: "20px" }}>
            ✓ {toastMsg}
          </div>
        )}

        {/* Section 1: KPI Summary Strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "14px", marginBottom: "24px" }}>
          <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "10px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Pending Applications</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#B45309", marginTop: "4px" }}>{stats.pending_review || 0}</div>
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>Awaiting review</span>
          </div>
          <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "10px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Documents Required</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#0284C7", marginTop: "4px" }}>{stats.documents_required || 0}</div>
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>In upload status</span>
          </div>
          <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "10px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Active Cohort Learners</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#059669", marginTop: "4px" }}>{stats.active_enrollments || 0}</div>
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>Currently in clinical rotation</span>
          </div>
          <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "10px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Scheduled Meetings</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#4F46E5", marginTop: "4px" }}>{stats.upcoming_meetings || 0}</div>
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>Includes multi-sessions/wk</span>
          </div>
          <div style={{ backgroundColor: "#FFFFFF", padding: "16px", borderRadius: "10px", border: "1px solid #E2E8F0", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#64748B" }}>Examine Calls</span>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#8A2A34", marginTop: "4px" }}>{stats.upcoming_examine_calls || 0}</div>
            <span style={{ fontSize: "11px", color: "#94A3B8" }}>Formal oral exam meetings</span>
          </div>
        </div>

        {/* Section 2: Clear Section-Wise Tab Navigation */}
        <div style={{ display: "flex", gap: "8px", borderBottom: "2px solid #E2E8F0", marginBottom: "24px", overflowX: "auto" }}>
          {[
            { id: "applications", label: "📋 Inbound Applications Queue", count: applications.length },
            { id: "announcements", label: "📢 Attending Announcements", count: announcements.length },
            { id: "schedule", label: "📅 Flexible Meeting Scheduler", count: meetings.length },
            { id: "recordings", label: "🎥 Recorded Clinical Sessions", count: recordedSessions.length },
            { id: "examine", label: "⚖️ Graded Examine Calls", count: meetings.filter(m => m.meeting_type === "Examine Call").length },
            { id: "deliverables", label: "📁 Deliverables & Documents", count: enrollments.length },
            { id: "certificates", label: "🎓 Completion & Certificates", count: enrollments.filter(e => e.certificate_issued).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 16px",
                border: "none",
                backgroundColor: "transparent",
                borderBottom: activeTab === tab.id ? "3px solid #12203B" : "3px solid transparent",
                color: activeTab === tab.id ? "#12203B" : "#64748B",
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: "13.5px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "-2px",
                transition: "all 0.15s ease",
              }}
            >
              <span>{tab.label}</span>
              <span style={{ fontSize: "11px", padding: "1px 6px", borderRadius: "10px", backgroundColor: activeTab === tab.id ? "#12203B" : "#F1F5F9", color: activeTab === tab.id ? "#FFFFFF" : "#64748B", fontWeight: 700 }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB 1: INBOUND APPLICATIONS QUEUE */}
        {activeTab === "applications" && (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            {/* Search and Filters bar */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", backgroundColor: "#F8FAFC" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Status Filter:</span>
                {["ALL", "Submitted", "Under Review", "Documents Required", "Approved", "Rejected"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setAppFilter(st)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "11.5px",
                      fontWeight: appFilter === st ? 700 : 500,
                      backgroundColor: appFilter === st ? "#12203B" : "#FFFFFF",
                      color: appFilter === st ? "#FFFFFF" : "#475569",
                      border: "1px solid #CBD5E1",
                      cursor: "pointer"
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Search applicant or school..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", width: "220px" }}
              />
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F1F5F9", color: "#475569", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.5px", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "12px 18px" }}>Applicant &amp; School</th>
                    <th style={{ padding: "12px 18px" }}>Stage &amp; Timing</th>
                    <th style={{ padding: "12px 18px" }}>Status</th>
                    <th style={{ padding: "12px 18px" }}>Applied Date</th>
                    <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: "30px", textAlign: "center", color: "#94A3B8" }}>No applications match criteria.</td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => {
                      const badgeColor = {
                        Submitted: { bg: "#FEF3C7", text: "#B45309", border: "#FDE68A" },
                        "Under Review": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
                        "Documents Required": { bg: "#F0FDFA", text: "#0D9488", border: "#99F6E4" },
                        Approved: { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" },
                        Rejected: { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
                      }[app.status] || { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" };

                      return (
                        <tr key={app.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 700, color: "#0F172A" }}>{app.applicant_name}</div>
                            <div style={{ fontSize: "11.5px", color: "#64748B" }}>{app.applicant_email}</div>
                            {app.applicant_phone && (
                              <div style={{ fontSize: "11.5px", color: "#0F766E", marginTop: "2px" }}>📞 {app.applicant_phone}</div>
                            )}
                            <div style={{ fontSize: "11.5px", color: "#475569", marginTop: "2px" }}>{app.medical_school || "Medical Candidate"} ({app.graduation_year || "2026"})</div>
                            {app.document_url && (
                              <a
                                href={app.document_url}
                                target="_blank"
                                rel="noreferrer"
                                style={{ display: "inline-block", marginTop: "4px", fontSize: "11px", color: "#4F46E5", textDecoration: "underline", fontWeight: 600 }}
                              >
                                📄 View Uploaded Document / CV
                              </a>
                            )}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <div style={{ fontWeight: 600, color: "#1E293B" }}>{app.usmle_stage || "Step 1 / 2 CK"}</div>
                            <div style={{ fontSize: "11.5px", color: "#64748B" }}>Pref: {app.timing_preference || "Flexible"}</div>
                            <div style={{ fontSize: "11.5px", color: "#94A3B8" }}>Start: {app.preferred_start || "Fall 2026"}</div>
                            {app.notes && (
                              <div style={{ fontSize: "11px", color: "#334155", backgroundColor: "#F8FAFC", padding: "4px 8px", borderRadius: "4px", marginTop: "4px", maxWidth: "240px", fontStyle: "italic", border: "1px solid #E2E8F0" }}>
                                &ldquo;{app.notes}&rdquo;
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "999px", backgroundColor: badgeColor.bg, color: badgeColor.text, border: `1px solid ${badgeColor.border}` }}>
                              {app.status}
                            </span>
                            {app.requested_documents && (
                              <div style={{ fontSize: "10.5px", color: "#0D9488", marginTop: "4px" }}>
                                Req: {app.requested_documents.join(", ")}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: "14px 18px", color: "#64748B", fontSize: "12px" }}>
                            {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : "Recent"}
                          </td>
                          <td style={{ padding: "14px 18px", textAlign: "right" }}>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px", flexWrap: "wrap" }}>
                              {app.status !== "Under Review" && app.status !== "Approved" && (
                                <button
                                  onClick={() => handleAppStatus(app.id, "Under Review")}
                                  style={{ padding: "4px 8px", borderRadius: "5px", backgroundColor: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
                                >
                                  Mark Review
                                </button>
                              )}
                              <button
                                onClick={() => setShowDocRequestModal(app)}
                                style={{ padding: "4px 8px", borderRadius: "5px", backgroundColor: "#F0FDFA", color: "#0D9488", border: "1px solid #99F6E4", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
                              >
                                Request Docs ✉️
                              </button>
                              {app.status !== "Approved" && (
                                <>
                                  <button
                                    onClick={() => handleAppStatus(app.id, "Approved", "free", 0)}
                                    style={{ padding: "4px 8px", borderRadius: "5px", backgroundColor: "#ECFDF5", color: "#065F46", border: "1px solid #A7F3D0", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                                    title="Approve without charging tuition"
                                  >
                                    ✓ Approve (Free)
                                  </button>
                                  <button
                                    onClick={() => handleAppStatus(app.id, "Approved", "paid", 1250)}
                                    style={{ padding: "4px 8px", borderRadius: "5px", backgroundColor: "#047857", color: "#FFFFFF", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
                                    title="Approve requiring $1,250 tuition payment before entering rotation"
                                  >
                                    💳 Approve (Paid $1,250)
                                  </button>
                                </>
                              )}
                              {app.status !== "Rejected" && (
                                <button
                                  onClick={() => handleAppStatus(app.id, "Rejected")}
                                  style={{ padding: "4px 8px", borderRadius: "5px", backgroundColor: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
                                >
                                  Decline
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ATTENDING ANNOUNCEMENTS */}
        {activeTab === "announcements" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px" }}>
            {/* Create Announcement Form */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <span style={{ fontSize: "20px" }}>📢</span>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>Post Attending Clinical Notice</h3>
              </div>
              <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 16px" }}>
                Broadcast immediate clinical directives, patient case prep notes, or schedule alerts directly to enrolled rotation trainees.
              </p>

              <form onSubmit={handlePostAnnouncement}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Announcement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NICU Morning Rounds: Congenital Diaphragmatic Hernia Prep"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Category</label>
                    <select
                      value={newAnnouncement.category}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value })}
                      style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
                    >
                      <option value="General Clinical Notice">General Clinical Notice</option>
                      <option value="Ward Round Schedule">Ward Round Schedule</option>
                      <option value="Case Prep & Articles">Case Prep & Articles</option>
                      <option value="Examine Call Notice">Examine Call Notice</option>
                      <option value="Urgent Preceptor Alert">Urgent Preceptor Alert</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Priority Level</label>
                    <select
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                      style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
                    >
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="High Priority">High Priority ⚠️</option>
                      <option value="Urgent Action Required">Urgent Action Required 🚨</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Notice / Message Body</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide specific clinical instructions, required reading citations before tomorrow's ward rounds, or procedural reminders..."
                    value={newAnnouncement.message}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Action / Reading Material Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newAnnouncement.action_url}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, action_url: e.target.value })}
                    style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="checkbox"
                    id="req_ack"
                    checked={newAnnouncement.requires_ack}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, requires_ack: e.target.checked })}
                  />
                  <label htmlFor="req_ack" style={{ fontSize: "12px", color: "#475569", cursor: "pointer" }}>
                    Require student acknowledgment / sign-off in student portal
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={postingAnnouncement}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #12203B 0%, #1E3A8A 100%)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "13px",
                    border: "none",
                    cursor: postingAnnouncement ? "not-allowed" : "pointer"
                  }}
                >
                  {postingAnnouncement ? "Publishing Notice..." : "📢 Publish Notice to Student Hub"}
                </button>
              </form>
            </div>

            {/* Announcement Feed */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1E293B" }}>
                  Live Broadcast Notices ({announcements.length})
                </h3>
                <span style={{ fontSize: "12px", color: "#64748B" }}>Visible to all enrolled students</span>
              </div>

              {announcements.length === 0 ? (
                <div style={{ backgroundColor: "#FFFFFF", padding: "40px 20px", textAlign: "center", borderRadius: "12px", border: "1px solid #E2E8F0", color: "#64748B" }}>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>No announcements published yet.</p>
                  <p style={{ margin: "6px 0 0", fontSize: "12px" }}>Use the form to post case prep notes or rotation updates.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {announcements.map((item) => {
                    const isHigh = item.priority?.includes("High") || item.priority?.includes("Urgent");
                    return (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "10px",
                          border: isHigh ? "1px solid #FCA5A5" : "1px solid #E2E8F0",
                          borderLeft: isHigh ? "4px solid #DC2626" : "4px solid #2563EB",
                          padding: "16px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>{item.title}</h4>
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontWeight: 700,
                              backgroundColor: isHigh ? "#FEE2E2" : "#EFF6FF",
                              color: isHigh ? "#B91C1C" : "#1D4ED8",
                              whiteSpace: "nowrap"
                            }}
                          >
                            {item.priority || "Normal"}
                          </span>
                        </div>

                        <p style={{ margin: "0 0 10px", fontSize: "13px", color: "#334155", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                          {item.message}
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", color: "#64748B", paddingTop: "8px", borderTop: "1px solid #F1F5F9" }}>
                          <span>🏷️ {item.category} • ✍️ {item.posted_by || "Attending Physician"}</span>
                          <span>🗓️ {item.created_at ? new Date(item.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}</span>
                        </div>

                        {item.action_url && (
                          <div style={{ marginTop: "8px" }}>
                            <a
                              href={item.action_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ fontSize: "11.5px", fontWeight: 700, color: "#2563EB", textDecoration: "none" }}
                            >
                              🔗 View Attached Reference Material &rarr;
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FLEXIBLE MEETING SCHEDULER */}
        {activeTab === "schedule" && (
          <div>
            {/* Header & Add Action */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B" }}>Filter Meeting Type:</span>
                <select
                  value={meetingTypeFilter}
                  onChange={(e) => setMeetingTypeFilter(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600, backgroundColor: "#FFFFFF" }}
                >
                  <option value="ALL">All Meeting Types ({meetings.length})</option>
                  {MEETING_TYPES.map(m => (
                    <option key={m.type} value={m.type}>{m.icon} {m.type}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowAddMeetingModal(true)}
                style={{
                  padding: "9px 18px",
                  borderRadius: "8px",
                  backgroundColor: "#12203B",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "12.5px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 6px rgba(18,32,59,0.15)"
                }}
              >
                <span>+</span> Schedule New Rotation Meeting
              </button>
            </div>

            {/* Meetings Cards Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "16px" }}>
              {filteredMeetings.map((meet) => {
                const typeObj = MEETING_TYPES.find(t => t.type === meet.meeting_type) || MEETING_TYPES[0];
                const isExamine = meet.meeting_type === "Examine Call";
                const isCompleted = meet.status === "Completed";

                return (
                  <div
                    key={meet.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: isExamine ? "2px solid #FCD34D" : "1px solid #E2E8F0",
                      padding: "20px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      position: "relative"
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            backgroundColor: typeObj.bg,
                            color: typeObj.color,
                            display: "flex",
                            alignItems: "center",
                            gap: "5px"
                          }}
                        >
                          <span>{typeObj.icon}</span> {meet.meeting_type}
                        </span>

                        <span style={{ fontSize: "11px", fontWeight: 700, color: isCompleted ? "#059669" : "#64748B" }}>
                          {isCompleted ? "● Done" : "Upcoming"}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "15.5px", fontWeight: 700, color: "#0F172A", margin: "0 0 6px", lineHeight: 1.35 }}>
                        {meet.title}
                      </h3>
                      <p style={{ fontSize: "12px", color: "#64748B", margin: "0 0 12px" }}>
                        🗓 {meet.scheduled_at ? new Date(meet.scheduled_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Scheduled"} ({meet.duration_minutes} mins)
                      </p>

                      {meet.notes && (
                        <p style={{ fontSize: "11.5px", color: "#475569", backgroundColor: "#F8FAFC", padding: "8px 10px", borderRadius: "6px", margin: "0 0 12px", border: "1px solid #F1F5F9" }}>
                          <strong>Notes:</strong> {meet.notes}
                        </p>
                      )}

                      {/* If Examine Call, show score banner */}
                      {isExamine && (
                        <div style={{ padding: "10px 12px", backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", marginBottom: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#B45309", textTransform: "uppercase" }}>Oral Exam Result:</span>
                            <span style={{ fontSize: "13px", fontWeight: 800, color: meet.score ? (meet.score >= 70 ? "#059669" : "#DC2626") : "#94A3B8" }}>
                              {meet.score ? `${meet.score}% (${meet.pass_fail})` : "Pending Grading"}
                            </span>
                          </div>
                          {meet.grader_notes && (
                            <p style={{ fontSize: "11px", color: "#78350F", margin: "4px 0 0" }}>{meet.grader_notes}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #F1F5F9", paddingTop: "12px", flexWrap: "wrap" }}>
                      {meet.teams_join_url && (
                        <a
                          href={meet.teams_join_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            flex: 1,
                            textAlign: "center",
                            padding: "7px 10px",
                            borderRadius: "6px",
                            backgroundColor: "#4F46E5",
                            color: "#FFFFFF",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            textDecoration: "none"
                          }}
                        >
                          Teams Link ↗
                        </a>
                      )}

                      {isExamine && (
                        <button
                          type="button"
                          onClick={() => {
                            setShowGradeModal(meet);
                            setGradeForm({
                              score: meet.score || 85,
                              pass_fail: meet.pass_fail || "Pass",
                              grader_notes: meet.grader_notes || ""
                            });
                          }}
                          style={{
                            padding: "7px 12px",
                            borderRadius: "6px",
                            backgroundColor: "#F59E0B",
                            color: "#FFFFFF",
                            fontSize: "11.5px",
                            fontWeight: 700,
                            border: "none",
                            cursor: "pointer"
                          }}
                        >
                          {meet.score ? "Edit Score" : "Grade Call ⚖️"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: EXAMINE CALLS & ORAL EXAMS */}
        {activeTab === "examine" && (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "20px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
              Examine Calls &amp; Oral Clinical Assessments
            </h3>
            <p style={{ fontSize: "12.5px", color: "#64748B", margin: "0 0 20px" }}>
              Formal clinical examine meetings. Scores entered here feed directly into the student&apos;s rotation running completion percentage.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              {meetings.filter(m => m.meeting_type === "Examine Call").map(call => (
                <div key={call.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderRadius: "8px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#B45309", backgroundColor: "#FEF3C7", padding: "2px 8px", borderRadius: "4px" }}>Examine Call</span>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: "4px 0 2px" }}>{call.title}</h4>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>🗓 {new Date(call.scheduled_at).toLocaleString()} • Attending: {call.physician}</div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: call.score ? "#059669" : "#B45309" }}>
                        {call.score ? `${call.score}% • ${call.pass_fail}` : "Not Graded Yet"}
                      </div>
                      {call.grader_notes && <div style={{ fontSize: "11px", color: "#64748B", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{call.grader_notes}</div>}
                    </div>

                    <button
                      onClick={() => {
                        setShowGradeModal(call);
                        setGradeForm({
                          score: call.score || 85,
                          pass_fail: call.pass_fail || "Pass",
                          grader_notes: call.grader_notes || ""
                        });
                      }}
                      style={{ padding: "8px 14px", backgroundColor: "#B4832A", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                    >
                      {call.score ? "Update Grade" : "Enter Grade ✍️"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DELIVERABLES & DOCUMENT REVIEW */}
        {activeTab === "deliverables" && (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "24px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
              Weekly Deliverables &amp; EMR Note Verification
            </h3>
            <p style={{ fontSize: "12.5px", color: "#64748B", margin: "0 0 20px" }}>
              Review weekly student pediatric admission notes, NICU progress notes, and OSCE documentation.
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { title: "Week 1: Pediatric History & Physical (H&P) Note", student: "Alex Rivera", week: "Week 1", status: "Approved" },
                { title: "Week 2: Extreme Hyperbilirubinemia Management Plan", student: "Alex Rivera", week: "Week 2", status: "Approved" },
                { title: "Week 3: Neonatal Respiratory Distress Syndrome Note", student: "Alex Rivera", week: "Week 3", status: "Approved" },
                { title: "Week 4: De-Identified EMR Pediatric Sepsis Workflow", student: "Alex Rivera", week: "Week 4", status: "Pending Review" },
                { title: "Week 5: Research Mini-Proposal (Delayed Cord Clamping)", student: "Alex Rivera", week: "Week 5", status: "Pending Review" },
              ].map((del, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", borderRadius: "8px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: "#0F172A" }}>{del.title}</div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>Student: {del.student} • Deliverable Stage: {del.week}</div>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", backgroundColor: del.status === "Approved" ? "#ECFDF5" : "#FEF3C7", color: del.status === "Approved" ? "#047857" : "#B45309" }}>
                      {del.status}
                    </span>
                    <button
                      onClick={() => notify(`Deliverable "${del.title}" marked as Approved!`)}
                      style={{ padding: "6px 12px", backgroundColor: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600, cursor: "pointer" }}
                    >
                      Approve Deliverable ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: COMPLETION & CERTIFICATES */}
        {activeTab === "certificates" && (
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "24px" }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
              Cohort Completion, Attending Evaluation &amp; Certificate Issuance
            </h3>
            <p style={{ fontSize: "12.5px", color: "#64748B", margin: "0 0 20px" }}>
              Once all required meetings and deliverables are fulfilled, publish the written evaluation and release verifiable certificates.
            </p>

            <div style={{ display: "grid", gap: "14px" }}>
              {enrollments.map((enr) => (
                <div key={enr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px", borderRadius: "10px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: "0 0 3px" }}>{enr.student_name}</h4>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>
                      Hospital Site: {enr.hospital_site} • Progress: Week {enr.current_week} of {enr.total_weeks}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "#0D9488", fontWeight: 600, marginTop: "4px" }}>
                      Status: {enr.evaluation_status}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {enr.certificate_issued ? (
                      <span style={{ padding: "6px 12px", borderRadius: "6px", backgroundColor: "#ECFDF5", color: "#047857", fontWeight: 700, fontSize: "12px" }}>
                        ✓ Certificate Active
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setShowEvaluationModal(enr);
                          setEvalForm({
                            grade_letter: "Honors",
                            written_evaluation: `Dr. Janardhan Mydam: Outstanding clinical reasoning and diligent case presentations during the 6-week tele-rotation.`
                          });
                        }}
                        style={{ padding: "8px 16px", backgroundColor: "#12203B", color: "#FFFFFF", border: "none", borderRadius: "6px", fontSize: "12.5px", fontWeight: 700, cursor: "pointer" }}
                      >
                        Submit Evaluation &amp; Issue Certificate 🎓
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: RECORDED SESSIONS ARCHIVE (MANUAL ENTRY) */}
        {activeTab === "recordings" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Add Recording Card */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#12203B", margin: "0 0 4px" }}>
                + Add / Publish Clinical Lecture Recording
              </h3>
              <p style={{ fontSize: "12.5px", color: "#64748B", margin: "0 0 16px" }}>
                Enter Microsoft Teams or cloud video recording links manually. Students in the clinical rotation will immediately see these in their Recorded Sessions tab.
              </p>

              <form onSubmit={handleAddRecording}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Session Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Week 2: LISA Surfactant Technique & RDS Case Discussion"
                      value={newRecording.title}
                      onChange={(e) => setNewRecording({ ...newRecording, title: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Video Recording URL (Teams / Drive / Stream) *
                    </label>
                    <input
                      type="url"
                      placeholder="https://teams.microsoft.com/l/recording/..."
                      value={newRecording.video_url}
                      onChange={(e) => setNewRecording({ ...newRecording, video_url: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Date Recorded
                    </label>
                    <input
                      type="date"
                      value={newRecording.date}
                      onChange={(e) => setNewRecording({ ...newRecording, date: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="1 hr 25 min"
                      value={newRecording.duration}
                      onChange={(e) => setNewRecording({ ...newRecording, duration: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="NRP, NICU, Rounds"
                      value={newRecording.tags}
                      onChange={(e) => setNewRecording({ ...newRecording, tags: e.target.value })}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "4px" }}>
                    Clinical Notes &amp; Teaching Pearls Summary
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe key cases presented, algorithms reviewed, or guidance given..."
                    value={newRecording.notes}
                    onChange={(e) => setNewRecording({ ...newRecording, notes: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingRecording}
                  style={{
                    padding: "9px 20px",
                    backgroundColor: "#12203B",
                    color: "#FFFFFF",
                    fontSize: "13px",
                    fontWeight: 700,
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {addingRecording ? "Publishing..." : "Publish Recording Link to Students →"}
                </button>
              </form>
            </div>

            {/* List of Published Recordings */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#12203B", margin: "0 0 12px" }}>
                Active Published Recordings ({recordedSessions.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {recordedSessions.map((rec) => (
                  <div key={rec.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", backgroundColor: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "14px" }}>{rec.title}</div>
                      <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                        🗓️ {rec.date} • ⏱️ {rec.duration} • Preceptor: {rec.preceptor}
                      </div>
                      {rec.notes && <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>{rec.notes}</div>}
                    </div>

                    <a
                      href={rec.video_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: "6px 14px", backgroundColor: "#7C3AED", color: "#FFF", borderRadius: "6px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}
                    >
                      ▶ Open Video Link
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: ADD FLEXIBLE MEETING */}
        {showAddMeetingModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", width: "100%", maxWidth: "560px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F8FAFC" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", margin: 0 }}>Schedule Rotation Meeting (Flexible)</h3>
                <button onClick={() => setShowAddMeetingModal(false)} style={{ border: "none", background: "none", fontSize: "18px", color: "#94A3B8", cursor: "pointer" }}>✕</button>
              </div>

              <form onSubmit={handleCreateMeeting} style={{ padding: "24px" }}>
                {/* Meeting Type Selector */}
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Meeting Type</label>
                  <select
                    value={newMeeting.meeting_type}
                    onChange={(e) => setNewMeeting({ ...newMeeting, meeting_type: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 600 }}
                  >
                    {MEETING_TYPES.map(t => (
                      <option key={t.type} value={t.type}>{t.icon} {t.type} — {t.desc}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Meeting Title / Clinical Focus</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Week 2: Case Discussion or Mid-Rotation Examine Call"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                {/* Attendee Audience Selector (Cohort vs Individual 1-on-1) */}
                <div style={{ marginBottom: "14px", backgroundColor: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                    🎯 Target Learner Audience
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: newMeeting.attendee_scope === "individual" ? "10px" : "0" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#334155", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="attendee_scope"
                        checked={newMeeting.attendee_scope === "cohort"}
                        onChange={() => setNewMeeting({ ...newMeeting, attendee_scope: "cohort", student_id: "" })}
                      />
                      👥 Full Cohort (All Students)
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, color: "#334155", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="attendee_scope"
                        checked={newMeeting.attendee_scope === "individual"}
                        onChange={() => setNewMeeting({ ...newMeeting, attendee_scope: "individual" })}
                      />
                      👤 1-on-1 Individual Trainee
                    </label>
                  </div>

                  {newMeeting.attendee_scope === "individual" && (
                    <div style={{ marginTop: "10px" }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#475569", marginBottom: "4px" }}>
                        Select Enrolled Trainee:
                      </label>
                      <select
                        required
                        value={newMeeting.student_id}
                        onChange={(e) => setNewMeeting({ ...newMeeting, student_id: e.target.value })}
                        style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px" }}
                      >
                        <option value="">-- Choose student for private examine/advisory --</option>
                        {applications.filter(a => a.status === "Approved").map(a => (
                          <option key={a.id} value={a.student_id || a.applicant_email || a.id}>
                            {a.applicant_name} ({a.applicant_email})
                          </option>
                        ))}
                        {applications.filter(a => a.status === "Approved").length === 0 && (
                          <option value="test_student">Dr. Trainee Candidate (Sample)</option>
                        )}
                      </select>
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Date &amp; Time (CST)</label>
                    <input
                      type="datetime-local"
                      required
                      value={newMeeting.scheduled_at}
                      onChange={(e) => setNewMeeting({ ...newMeeting, scheduled_at: e.target.value })}
                      style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Duration (Minutes)</label>
                    <input
                      type="number"
                      value={newMeeting.duration_minutes}
                      onChange={(e) => setNewMeeting({ ...newMeeting, duration_minutes: e.target.value })}
                      style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                {/* Recurrence Convenience Generator */}
                <div style={{ marginBottom: "14px", backgroundColor: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>
                    🔁 Recurrence Generator (Optional)
                  </label>
                  <p style={{ fontSize: "11.5px", color: "#64748B", margin: "0 0 8px" }}>
                    Duplicate this meeting weekly for N weeks. Each generated session remains individually editable.
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={newMeeting.repeat_weeks}
                      onChange={(e) => setNewMeeting({ ...newMeeting, repeat_weeks: Number(e.target.value) })}
                      style={{ width: "70px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "13px" }}
                    />
                    <span style={{ fontSize: "12px", color: "#475569" }}>week(s) sequence</span>
                  </div>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 700, color: "#334155" }}>Microsoft Teams Meeting Join Link</label>
                    <button
                      type="button"
                      onClick={() => {
                        const clean = (newMeeting.title || "clinical-session").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 24);
                        const token = Math.random().toString(36).substring(2, 10);
                        const ts = Date.now().toString(36);
                        const autoUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${clean}_${token}%40thread.v2/0?context=%7b%22Tid%22%3a%22jva-medical-system%22%2c%22Oid%22%3a%22dr-janardhan-mydam%22%2c%22Session%22%3a%22${ts}%22%7d`;
                        setNewMeeting({ ...newMeeting, teams_join_url: autoUrl });
                      }}
                      style={{
                        background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      ⚡ Auto-Generate Teams Link
                    </button>
                  </div>
                  <input
                    type="url"
                    placeholder="https://teams.microsoft.com/l/meetup-join/..."
                    value={newMeeting.teams_join_url}
                    onChange={(e) => setNewMeeting({ ...newMeeting, teams_join_url: e.target.value })}
                    style={{ width: "100%", padding: "9px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", boxSizing: "border-box" }}
                  />
                </div>

                {/* Microsoft Teams Pro Advanced Features */}
                <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px", padding: "12px", marginBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 800, color: "#166534", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span>🛡️</span> Microsoft Teams Pro Features
                    </span>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "4px", backgroundColor: "#DCFCE7", color: "#15803D" }}>
                      Cloud Recording &amp; AI
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "8px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "3px" }}>Teams Room ID</label>
                      <input
                        type="text"
                        placeholder="e.g. 284 194 0921"
                        value={newMeeting.teams_meeting_id}
                        onChange={(e) => setNewMeeting({ ...newMeeting, teams_meeting_id: e.target.value })}
                        style={{ width: "100%", padding: "7px 9px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "3px" }}>Room Passcode</label>
                      <input
                        type="text"
                        placeholder="e.g. NICU2026"
                        value={newMeeting.teams_passcode}
                        onChange={(e) => setNewMeeting({ ...newMeeting, teams_passcode: e.target.value })}
                        style={{ width: "100%", padding: "7px 9px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "3px" }}>Cloud Recording URL (Teams Pro Playback)</label>
                    <input
                      type="url"
                      placeholder="https://teams.microsoft.com/l/recording/..."
                      value={newMeeting.recording_url}
                      onChange={(e) => setNewMeeting({ ...newMeeting, recording_url: e.target.value })}
                      style={{ width: "100%", padding: "7px 9px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "3px" }}>AI Clinical Summary &amp; Transcript Notes</label>
                    <textarea
                      rows={2}
                      placeholder="AI-synthesized diagnostic decisions, key differential diagnoses, and preceptor takeaways..."
                      value={newMeeting.ai_summary}
                      onChange={(e) => setNewMeeting({ ...newMeeting, ai_summary: e.target.value })}
                      style={{ width: "100%", padding: "7px 9px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #E2E8F0", paddingTop: "16px" }}>
                  <button type="button" onClick={() => setShowAddMeetingModal(false)} style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" style={{ padding: "8px 20px", borderRadius: "6px", backgroundColor: "#12203B", color: "#FFFFFF", fontWeight: 700, border: "none", cursor: "pointer" }}>Confirm Schedule ✓</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: GRADE EXAMINE CALL */}
        {showGradeModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", width: "100%", maxWidth: "480px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", backgroundColor: "#FFFBEB" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#78350F", margin: 0 }}>Grade Examine Call (Oral Assessment)</h3>
                <p style={{ fontSize: "12px", color: "#92400E", margin: "4px 0 0" }}>{showGradeModal.title}</p>
              </div>

              <form onSubmit={handleSaveGrade} style={{ padding: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Score (0–100%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={gradeForm.score}
                      onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "16px", fontWeight: 700, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Result Status</label>
                    <select
                      value={gradeForm.pass_fail}
                      onChange={(e) => setGradeForm({ ...gradeForm, pass_fail: e.target.value })}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px", fontWeight: 700, backgroundColor: "#FFFFFF" }}
                    >
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail (Requires Retake)</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Physician Grading Feedback Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Enter assessment reasoning, clinical strengths, and recommendations..."
                    value={gradeForm.grader_notes}
                    onChange={(e) => setGradeForm({ ...gradeForm, grader_notes: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12.5px", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button type="button" onClick={() => setShowGradeModal(null)} style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" style={{ padding: "8px 20px", borderRadius: "6px", backgroundColor: "#B45309", color: "#FFFFFF", fontWeight: 700, border: "none", cursor: "pointer" }}>Record Score ✓</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: REQUEST DOCUMENTS */}
        {showDocRequestModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", width: "100%", maxWidth: "480px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", backgroundColor: "#F0FDFA" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F766E", margin: 0 }}>Request Compliance Documents</h3>
                <p style={{ fontSize: "12px", color: "#115E59", margin: "4px 0 0" }}>To: {showDocRequestModal.applicant_name} ({showDocRequestModal.applicant_email})</p>
              </div>

              <form onSubmit={handleSendDocRequest} style={{ padding: "24px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "8px" }}>Select Required Categories:</label>
                {["Official Medical School Transcript", "Dean's Letter of Good Standing", "Immunization Record", "Government Photo ID"].map((item) => {
                  const isChecked = docRequestItems.includes(item);
                  return (
                    <label key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#1E293B", marginBottom: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) setDocRequestItems([...docRequestItems, item]);
                          else setDocRequestItems(docRequestItems.filter(i => i !== item));
                        }}
                      />
                      {item}
                    </label>
                  );
                })}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                  <button type="button" onClick={() => setShowDocRequestModal(null)} style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" style={{ padding: "8px 18px", borderRadius: "6px", backgroundColor: "#0D9488", color: "#FFFFFF", fontWeight: 700, border: "none", cursor: "pointer" }}>Dispatch Email Notification ✉️</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: EVALUATION & CERTIFICATE */}
        {showEvaluationModal && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15,23,42,0.6)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "14px", width: "100%", maxWidth: "520px", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#12203B", margin: 0 }}>Final Evaluation &amp; Certificate Issuance</h3>
                <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0" }}>Student: {showEvaluationModal.student_name}</p>
              </div>

              <form onSubmit={handlePublishEvaluation} style={{ padding: "24px" }}>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Overall Cohort Standing</label>
                  <select
                    value={evalForm.grade_letter}
                    onChange={(e) => setEvalForm({ ...evalForm, grade_letter: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", fontWeight: 700 }}
                  >
                    <option value="Honors">Honors (Top 10% Clinical Reasoning)</option>
                    <option value="High Pass">High Pass</option>
                    <option value="Pass">Pass (Meets All Standards)</option>
                  </select>
                </div>

                <div style={{ marginBottom: "18px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#334155", marginBottom: "6px" }}>Attending Written Letter &amp; Clinical Appraisal</label>
                  <textarea
                    rows={4}
                    value={evalForm.written_evaluation}
                    onChange={(e) => setEvalForm({ ...evalForm, written_evaluation: e.target.value })}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12.5px", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button type="button" onClick={() => setShowEvaluationModal(null)} style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", cursor: "pointer" }}>Cancel</button>
                  <button type="submit" style={{ padding: "8px 20px", borderRadius: "6px", backgroundColor: "#12203B", color: "#FFFFFF", fontWeight: 700, border: "none", cursor: "pointer" }}>Publish &amp; Issue Certificate 🎓</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
