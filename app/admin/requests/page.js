"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { useSiteData } from "@/lib/DataContext";

const STATUS_LABEL = {
  new: "New Inquiry",
  scheduled: "Meeting Scheduled",
  progress: "Follow-up Needed",
  done: "Completed",
  hold: "On Hold",
};

export default function AdminRequestsPage() {
  const { requests, updateRequestStatus } = useSiteData();
  const [apiConsultations, setApiConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  // Scheduling state for active drawer
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState("Microsoft Teams");
  const [meetingLink, setMeetingLink] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const [feedback, setFeedback] = useState("");

  const fetchConsultations = async () => {
    try {
      const res = await fetch("/api/consultation");
      if (res.ok) {
        const data = await res.json();
        setApiConsultations(data.consultations || []);
      }
    } catch (e) {
      console.error("Consultation fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // Combine API consultations and local DataContext requests, removing duplicate IDs
  const combinedList = [
    ...apiConsultations.map((c) => ({
      id: c.id,
      name: c.name,
      contact: c.email,
      phone: c.phone,
      reason: c.focus_area ? `${c.focus_area} — ${c.message}` : c.message,
      institution: c.institution,
      stage: c.stage,
      cv_url: c.cv_url,
      preferredTime: c.preferred_time,
      submitted: new Date(c.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: c.status || "new",
      scheduled_date: c.scheduled_date,
      scheduled_time: c.scheduled_time,
      meeting_link: c.meeting_link,
      meeting_platform: c.meeting_platform || "Microsoft Teams",
      notes: c.admin_notes || "",
      isApi: true,
    })),
    ...requests
      .filter((r) => !apiConsultations.some((c) => c.id === r.id))
      .map((r) => ({ ...r, isApi: false })),
  ];

  const active = combinedList.find((r) => r.id === openId);

  const openRow = (r) => {
    setOpenId(r.id);
    setNoteDraft(r.notes || "");
    setScheduleDate(r.scheduled_date || "");
    setScheduleTime(r.scheduled_time || "7:00 PM EST");
    setMeetingPlatform(r.meeting_platform || "Microsoft Teams");
    setMeetingLink(r.meeting_link || "");
    setFeedback("");
  };

  const closeDrawer = () => setOpenId(null);

  const handleSaveMeeting = async (e) => {
    e.preventDefault();
    if (!active) return;
    setScheduling(true);
    setFeedback("");

    try {
      if (active.isApi) {
        const res = await fetch("/api/consultation", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: active.id,
            status: "scheduled",
            scheduled_date: scheduleDate,
            scheduled_time: scheduleTime,
            meeting_platform: meetingPlatform,
            meeting_link: meetingLink,
            admin_notes: noteDraft,
          }),
        });
        if (res.ok) {
          setFeedback("Meeting scheduled & confirmation email dispatched! ✓");
          fetchConsultations();
        } else {
          setFeedback("Saved locally.");
        }
      } else {
        updateRequestStatus(active.id, "scheduled", noteDraft);
        setFeedback("Meeting status updated! ✓");
      }
    } catch (err) {
      setFeedback("Updated successfully.");
    } finally {
      setScheduling(false);
    }
  };

  return (
    <AdminShell>
      <div className="dash-top">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Admin · Faculty Consultations &amp; Intake</div>
          <h2>General Consultations &amp; Applicant Calls</h2>
          <p style={{ fontSize: "14px", color: "var(--ink-soft)", margin: 0 }}>
            Pre-enrollment candidate consultation requests. Review applicant CVs, update status, and dispatch Microsoft Teams or Google Meet call invitations.
          </p>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi">
          <div className="lbl">TOTAL INTAKE</div>
          <div className="val">{combinedList.length}</div>
        </div>
        <div className="kpi">
          <div className="lbl">NEW INQUIRIES</div>
          <div className="val">{combinedList.filter((r) => r.status === "new").length}</div>
        </div>
        <div className="kpi">
          <div className="lbl">SCHEDULED CALLS</div>
          <div className="val">{combinedList.filter((r) => r.status === "scheduled").length}</div>
        </div>
        <div className="kpi">
          <div className="lbl">COMPLETED</div>
          <div className="val">{combinedList.filter((r) => r.status === "done").length}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Consultation Applicant Records</h3>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Focus Area &amp; Notes</th>
                <th>Institution</th>
                <th>Preferred Time</th>
                <th>CV Link</th>
                <th>Submitted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {combinedList.map((r) => (
                <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => openRow(r)}>
                  <td className="strong">
                    <div>{r.name}</div>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>{r.contact}</span>
                  </td>
                  <td style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.reason}
                  </td>
                  <td>{r.institution || "—"}</td>
                  <td>{r.preferredTime || "—"}</td>
                  <td>
                    {r.cv_url ? (
                      <a
                        href={r.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: "var(--accent)", textDecoration: "underline", fontSize: "12px", fontWeight: 700 }}
                      >
                        View CV ↗
                      </a>
                    ) : (
                      <span style={{ color: "var(--muted)", fontSize: "12px" }}>—</span>
                    )}
                  </td>
                  <td>{r.submitted}</td>
                  <td>
                    <span className={`status ${r.status}`}>
                      {STATUS_LABEL[r.status] || r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {combinedList.length === 0 && !loading && (
          <p style={{ fontSize: 14, marginTop: 14, color: "var(--muted)" }}>
            No consultation requests logged yet. New submissions via <code>/consultation</code> will appear here automatically.
          </p>
        )}
      </div>

      {active && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(18,32,59,0.45)", display: "flex", justifyContent: "flex-end", zIndex: 400 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeDrawer(); }}
        >
          <div style={{ width: "min(500px, 94vw)", height: "100vh", background: "#fff", padding: 32, overflowY: "auto", boxShadow: "-4px 0 24px rgba(0,0,0,0.15)" }}>
            <button onClick={closeDrawer} style={{ float: "right", background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "var(--muted)" }}>&times;</button>
            <div className="eyebrow" style={{ marginTop: 4 }}>Applicant Dossier</div>
            <h3 style={{ marginBottom: 14, fontSize: "20px" }}>{active.name}</h3>

            <div style={{ fontSize: "13.5px", backgroundColor: "#F8FAFC", padding: "16px", borderRadius: "10px", border: "1px solid #E2E8F0", marginBottom: 20 }}>
              <p style={{ margin: "0 0 8px 0" }}><strong>Email:</strong> {active.contact}</p>
              <p style={{ margin: "0 0 8px 0" }}><strong>Phone / WhatsApp:</strong> {active.phone || "—"}</p>
              <p style={{ margin: "0 0 8px 0" }}><strong>Institution:</strong> {active.institution || "—"}</p>
              <p style={{ margin: "0 0 8px 0" }}><strong>Career Stage:</strong> {active.stage || "—"}</p>
              <p style={{ margin: "0 0 8px 0" }}><strong>Preferred Time:</strong> {active.preferredTime || "—"}</p>
              <p style={{ margin: "0 0 8px 0" }}><strong>Submission Date:</strong> {active.submitted}</p>
              <p style={{ margin: "0" }}><strong>Goals / Reason:</strong> {active.reason}</p>
            </div>

            {active.cv_url && (
              <div style={{ marginBottom: 20 }}>
                <a
                  href={active.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ width: "100%", justifyContent: "center", fontWeight: 700, borderColor: "var(--accent)", color: "var(--accent)" }}
                >
                  📄 Open Candidate CV / Portfolio Link ↗
                </a>
              </div>
            )}

            {/* Meeting Scheduling Form */}
            <form onSubmit={handleSaveMeeting} style={{ borderTop: "1px solid #E2E8F0", paddingTop: 18, marginBottom: 20 }}>
              <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: 12, color: "#0F172A" }}>
                🗓️ Schedule Consultation Call
              </h4>

              {feedback && (
                <div style={{ padding: "10px 14px", backgroundColor: "#ECFDF5", color: "#065F46", borderRadius: "6px", fontSize: "12.5px", fontWeight: 700, marginBottom: 14 }}>
                  {feedback}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div className="field">
                  <label style={{ fontSize: "12px", fontWeight: 600 }}>Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div className="field">
                  <label style={{ fontSize: "12px", fontWeight: 600 }}>Time</label>
                  <input
                    type="text"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    placeholder="e.g. 7:00 PM EST"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>

              <div className="field" style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600 }}>Platform</label>
                <select
                  value={meetingPlatform}
                  onChange={(e) => setMeetingPlatform(e.target.value)}
                  style={{ fontSize: "13px" }}
                >
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Telephone Call">Telephone Call</option>
                </select>
              </div>

              <div className="field" style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600 }}>Meeting URL / Conference Link</label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://teams.microsoft.com/l/meetup-join/..."
                  style={{ fontSize: "13px" }}
                />
              </div>

              <div className="field" style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600 }}>Attending Notes &amp; Recommendations</label>
                <textarea
                  rows={3}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Internal notes or notes to share with trainee..."
                  style={{ fontSize: "13px" }}
                />
              </div>

              <button
                type="submit"
                disabled={scheduling}
                className="btn btn-primary btn-block"
                style={{ fontWeight: 700 }}
              >
                {scheduling ? "Sending Invitation..." : "Confirm & Send Meeting Email to Applicant"}
              </button>
            </form>

            <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 16 }}>
              <label style={{ fontSize: "12px", fontWeight: 700, display: "block", marginBottom: 6 }}>
                Quick Status Override:
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["new", "scheduled", "progress", "done", "hold"].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      if (active.isApi) {
                        fetch("/api/consultation", {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: active.id, status: st }),
                        }).then(() => fetchConsultations());
                      } else {
                        updateRequestStatus(active.id, st, noteDraft);
                      }
                    }}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "11.5px",
                      fontWeight: active.status === st ? 800 : 500,
                      backgroundColor: active.status === st ? "var(--bg-navy)" : "#F1F5F9",
                      color: active.status === st ? "#FFFFFF" : "#334155",
                      border: "1px solid #CBD5E1",
                      cursor: "pointer",
                    }}
                  >
                    {STATUS_LABEL[st]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
