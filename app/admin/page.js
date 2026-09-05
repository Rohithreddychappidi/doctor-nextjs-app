"use client";

import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import { useSiteData } from "@/lib/DataContext";

export default function AdminOverviewPage() {
  const { stats, updateStats, requests, meetings, testimonials, hydrated } = useSiteData();
  const [form, setForm] = useState(stats);
  const [saved, setSaved] = useState(false);

  useEffect(() => setForm(stats), [stats]);

  const handleChange = (key) => (e) => {
    const val = Number(e.target.value) || 0;
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    updateStats(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const newThisWeek = requests.filter((r) => r.status === "new").length;
  const awaiting = requests.filter((r) => r.status === "progress").length;
  const confirmed = requests.filter((r) => r.status === "done").length;

  return (
    <AdminShell>
      <div className="dash-top">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Admin · Overview</div>
          <h2>Site Stats &amp; Snapshot</h2>
        </div>
        <a href="/about" className="btn btn-outline btn-sm">View public profile page</a>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Homepage &amp; Profile Stats (editable)</h3>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            {saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
        <div className="kpi-row" style={{ marginBottom: 0 }}>
          <div className="kpi">
            <div className="lbl">STUDENTS HELPED</div>
            <input type="number" value={form.studentsHelped} onChange={handleChange("studentsHelped")} />
          </div>
          <div className="kpi">
            <div className="lbl">FREE CONSULTATIONS GIVEN</div>
            <input type="number" value={form.consultationsGiven} onChange={handleChange("consultationsGiven")} />
          </div>
          <div className="kpi">
            <div className="lbl">HOSPITALS WORKED AT</div>
            <input type="number" value={form.hospitalsWorked} onChange={handleChange("hospitalsWorked")} />
          </div>
          <div className="kpi">
            <div className="lbl">RESEARCH CONTRIBUTIONS</div>
            <input type="number" value={form.researchesPublished} onChange={handleChange("researchesPublished")} />
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 16 }}>
          These numbers power the stat strip on the Home and About pages. Update
          them any time — changes save to this browser (a real backend will replace this
          storage later).
        </p>
      </div>

      <div className="kpi-row">
        <div className="kpi"><div className="lbl">NEW CONSULTATION REQUESTS</div><div className="val">{newThisWeek}</div></div>
        <div className="kpi"><div className="lbl">AWAITING FOLLOW-UP</div><div className="val">{awaiting}</div></div>
        <div className="kpi"><div className="lbl">CONFIRMED / COMPLETED</div><div className="val">{confirmed}</div></div>
        <div className="kpi"><div className="lbl">ACTIVE MEETINGS LISTED</div><div className="val">{meetings.length}</div></div>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Quick links</h3></div>
        <div className="grid grid-3">
          <a href="/admin/about" className="card"><h3>Edit About Page</h3><p>The doctor&apos;s full CV — 18 sections, awards timeline, and career counts.</p></a>
          <a href="/admin/meetings" className="card"><h3>Manage Meetings</h3><p>Add, edit or remove event cards — image, description and price.</p></a>
          <a href="/admin/testimonials" className="card"><h3>Manage Testimonials</h3><p>Add or remove student and family testimonials.</p></a>
          <a href="/admin/requests" className="card"><h3>Consultation Records</h3><p>{requests.length} logged requests — your record book of who we&apos;ve helped.</p></a>
        </div>
      </div>

      <div className="form-note">
        <span>&#9432;</span>
        <span>This is a front-end preview. Stats, meetings, testimonials and consultation
          records currently save to this browser&apos;s local storage only — a real
          database will replace this once the backend is built.</span>
      </div>
    </AdminShell>
  );
}
