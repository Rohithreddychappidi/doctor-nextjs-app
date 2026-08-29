"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import { useSiteData } from "@/lib/DataContext";

const STATUS_LABEL = { new: "New", progress: "Follow-up needed", done: "Completed", hold: "On hold" };

export default function AdminRequestsPage() {
  const { requests, updateRequestStatus } = useSiteData();
  const [openId, setOpenId] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");

  const openRow = (r) => { setOpenId(r.id); setNoteDraft(r.notes || ""); };
  const closeDrawer = () => setOpenId(null);
  const active = requests.find((r) => r.id === openId);

  return (
    <AdminShell>
      <div className="dash-top">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Admin · Consultation Records</div>
          <h2>Our Record Book</h2>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi"><div className="lbl">TOTAL LOGGED</div><div className="val">{requests.length}</div></div>
        <div className="kpi"><div className="lbl">NEW</div><div className="val">{requests.filter(r => r.status === "new").length}</div></div>
        <div className="kpi"><div className="lbl">FOLLOW-UP NEEDED</div><div className="val">{requests.filter(r => r.status === "progress").length}</div></div>
        <div className="kpi"><div className="lbl">COMPLETED</div><div className="val">{requests.filter(r => r.status === "done").length}</div></div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>All Requests</h3></div>
        <div className="table-scroll">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Reason</th><th>Preferred time</th><th>Submitted</th><th>Status</th></tr></thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => openRow(r)}>
                  <td className="strong">{r.name}</td>
                  <td>{r.reason}</td>
                  <td>{r.preferredTime || "—"}</td>
                  <td>{r.submitted}</td>
                  <td><span className={`status ${r.status}`}>{STATUS_LABEL[r.status]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {requests.length === 0 && <p style={{ fontSize: 14, marginTop: 14 }}>No consultation requests logged yet.</p>}
      </div>

      <div className="form-note">
        <span>&#9432;</span>
        <span>Since every consultation is free, this table exists purely as a record — a
          way to track how many people we&apos;ve helped and follow up reliably, not to
          manage payments.</span>
      </div>

      {active && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(18,32,59,0.4)", display: "flex", justifyContent: "flex-end", zIndex: 300 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeDrawer(); }}
        >
          <div style={{ width: "min(420px, 92vw)", height: "100vh", background: "#fff", padding: 32, overflowY: "auto" }}>
            <button onClick={closeDrawer} style={{ float: "right", background: "none", border: "none", fontSize: 20, color: "var(--muted)" }}>&times;</button>
            <div className="eyebrow" style={{ marginTop: 6 }}>Request</div>
            <h3 style={{ marginBottom: 20 }}>{active.name}</h3>
            <div style={{ fontSize: 14 }}>
              <p style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}><strong>Contact:</strong> {active.contact}</p>
              <p style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}><strong>Reason:</strong> {active.reason}</p>
              <p style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}><strong>Preferred time:</strong> {active.preferredTime || "—"}</p>
              <p style={{ padding: "10px 0" }}><strong>Submitted:</strong> {active.submitted}</p>
            </div>
            <div className="field" style={{ marginTop: 20, marginBottom: 16 }}>
              <label htmlFor="statusSelect">Update status</label>
              <select id="statusSelect" defaultValue={active.status} onChange={(e) => updateRequestStatus(active.id, e.target.value, noteDraft)}>
                <option value="new">New</option>
                <option value="progress">Follow-up needed</option>
                <option value="done">Completed</option>
                <option value="hold">On hold</option>
              </select>
            </div>
            <div className="field" style={{ marginBottom: 20 }}>
              <label htmlFor="noteInput">Notes</label>
              <textarea id="noteInput" value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" onClick={() => { updateRequestStatus(active.id, active.status, noteDraft); closeDrawer(); }}>
              Save Notes
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
