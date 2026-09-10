"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import MandatoryStar from "@/components/MandatoryStar";
import ExportButton from "@/components/ExportButton";

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingNotes, setUploadingNotes] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New Class Form State
  const [formData, setFormData] = useState({
    week_number: 1,
    title: "",
    description: "",
    date_time: "",
    duration_minutes: 90,
    meeting_platform: "Microsoft Teams",
    meeting_link: "",
    recording_url: "",
    meeting_passcode: "",
    teams_meeting_id: "",
    notes_url: "",
    notes_title: "",
    assignment_title: "",
    assignment_description: "",
    assignment_due_date: "",
  });

  const loadClasses = async () => {
    try {
      const res = await fetch("/api/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data.classes || []);
      }
    } catch (err) {
      console.error("Failed to load classes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleNotesUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingNotes(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");

      setFormData((prev) => ({
        ...prev,
        notes_url: json.file.url,
        notes_title: prev.notes_title || json.file.originalName,
      }));
      setSuccess("Lecture notes uploaded successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingNotes(false);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.week_number || !formData.date_time) {
      setError("Week number, title, and date/time are mandatory (*).");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to schedule class");

      setSuccess("New class scheduled successfully and published to Student Portal!");
      setFormData({
        week_number: Number(formData.week_number) + 1,
        title: "",
        description: "",
        date_time: "",
        duration_minutes: 90,
        meeting_platform: "Microsoft Teams",
        meeting_link: "",
        notes_url: "",
        notes_title: "",
        assignment_title: "",
        assignment_description: "",
        assignment_due_date: "",
      });
      loadClasses();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!confirm("Are you sure you want to delete this scheduled class?")) return;
    try {
      const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setClasses(classes.filter((c) => c.id !== id));
      }
    } catch (e) {
      alert("Failed to delete class");
    }
  };

  return (
    <AdminShell>
      <div className="dash-head">
        <div>
          <div className="eyebrow">Priority 1 Module</div>
          <h1>Weekly Online Classes &amp; Microsoft Teams Manager</h1>
          <p className="sub">
            Schedule live weekly classes, distribute Microsoft Teams meeting links, upload lecture notes, and assign clinical vignettes to students.
          </p>
        </div>
        <div>
          <ExportButton type="classes" label="Export Schedule (CSV)" />
        </div>
      </div>

      {error && <div className="form-note error" style={{ color: "#8A2A34", marginBottom: 20 }}>{error}</div>}
      {success && <div className="form-note" style={{ color: "#2E7D3A", marginBottom: 20 }}>{success}</div>}

      {/* Add Class Form */}
      <div className="dash-card" style={{ marginBottom: 36 }}>
        <h3 style={{ marginBottom: 18 }}>Schedule a New Weekly Class</h3>
        <form onSubmit={handleAddClass}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="wNum">
                Cohort Week Number <MandatoryStar />
              </label>
              <input
                id="wNum"
                type="number"
                min="1"
                max="52"
                required
                value={formData.week_number}
                onChange={(e) => setFormData({ ...formData, week_number: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="cDateTime">
                Date &amp; Time (e.g. 2026-09-18 18:00 CST) <MandatoryStar />
              </label>
              <input
                id="cDateTime"
                type="text"
                required
                placeholder="2026-09-18 18:00 CST"
                value={formData.date_time}
                onChange={(e) => setFormData({ ...formData, date_time: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row single">
            <div className="field">
              <label htmlFor="cTitle">
                Class Title &amp; Topic <MandatoryStar />
              </label>
              <input
                id="cTitle"
                type="text"
                required
                placeholder="e.g. Week 1: Delivery Room Neonatal Resuscitation & T-Piece Mechanics"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row single">
            <div className="field">
              <label htmlFor="cDesc">Clinical Overview &amp; Learning Objectives</label>
              <textarea
                id="cDesc"
                rows={3}
                placeholder="Core topics, clinical cases discussed, guidelines reviewed..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="cPlatform">Meeting Platform</label>
              <select
                id="cPlatform"
                value={formData.meeting_platform}
                onChange={(e) => setFormData({ ...formData, meeting_platform: e.target.value })}
              >
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Zoom">Zoom</option>
                <option value="Google Meet">Google Meet</option>
              </select>
            </div>
            <div className="field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label htmlFor="cLink" style={{ margin: 0 }}>Microsoft Teams Meeting Join Link</label>
                <button
                  type="button"
                  onClick={() => {
                    const clean = (formData.title || `week-${formData.week_number}-lecture`).toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 24);
                    const token = Math.random().toString(36).substring(2, 10);
                    const ts = Date.now().toString(36);
                    const autoUrl = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${clean}_${token}%40thread.v2/0?context=%7b%22Tid%22%3a%22jva-medical-system%22%2c%22Oid%22%3a%22dr-janardhan-mydam%22%2c%22Session%22%3a%22${ts}%22%7d`;
                    setFormData({ ...formData, meeting_link: autoUrl });
                  }}
                  style={{
                    background: "linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "5px",
                    padding: "2px 8px",
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
                id="cLink"
                type="url"
                placeholder="https://teams.microsoft.com/l/meetup-join/..."
                value={formData.meeting_link}
                onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
              />
            </div>
          </div>

          {/* Microsoft Teams Pro Extras */}
          <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px", padding: "14px", margin: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#166534" }}>
                🛡️ Microsoft Teams Pro Integration
              </span>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "4px", backgroundColor: "#DCFCE7", color: "#15803D" }}>
                Cloud Playback
              </span>
            </div>
            <div className="form-row">
              <div className="field">
                <label>Teams Room ID</label>
                <input
                  type="text"
                  placeholder="e.g. 291 049 2038"
                  value={formData.teams_meeting_id}
                  onChange={(e) => setFormData({ ...formData, teams_meeting_id: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Meeting Passcode</label>
                <input
                  type="text"
                  placeholder="e.g. NICU2026"
                  value={formData.meeting_passcode}
                  onChange={(e) => setFormData({ ...formData, meeting_passcode: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row single" style={{ marginTop: "8px" }}>
              <div className="field">
                <label>Cloud Recording URL (Teams Pro Recording / Stream Link)</label>
                <input
                  type="url"
                  placeholder="https://teams.microsoft.com/l/recording/..."
                  value={formData.recording_url}
                  onChange={(e) => setFormData({ ...formData, recording_url: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Notes & Reading Material Upload */}
          <div style={{ backgroundColor: "#F7F4EE", padding: 18, borderRadius: 8, margin: "20px 0" }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 15, color: "var(--bg-navy)" }}>Lecture Notes &amp; Slides Upload</h4>
            <div className="form-row">
              <div className="field">
                <label htmlFor="notesTitle">Document Title</label>
                <input
                  id="notesTitle"
                  type="text"
                  placeholder="e.g. NRP 8th Edition Flow Algorithm Notes"
                  value={formData.notes_title}
                  onChange={(e) => setFormData({ ...formData, notes_title: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="notesFile">Upload PDF / Presentation</label>
                <input id="notesFile" type="file" accept=".pdf,.doc,.docx,.pptx" onChange={handleNotesUpload} />
                {uploadingNotes && <small style={{ color: "var(--accent)" }}>Uploading to server...</small>}
                {formData.notes_url && <small style={{ color: "var(--green)" }}>&#10003; Attached: {formData.notes_url}</small>}
              </div>
            </div>
          </div>

          {/* Assignment Creation */}
          <div style={{ backgroundColor: "#F7F4EE", padding: 18, borderRadius: 8, marginBottom: 24 }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 15, color: "var(--accent)" }}>Weekly Clinical Assignment</h4>
            <div className="form-row">
              <div className="field">
                <label htmlFor="assTitle">Assignment Title</label>
                <input
                  id="assTitle"
                  type="text"
                  placeholder="e.g. Preterm Delivery Room Thermal Strategy"
                  value={formData.assignment_title}
                  onChange={(e) => setFormData({ ...formData, assignment_title: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="assDue">Due Date</label>
                <input
                  id="assDue"
                  type="text"
                  placeholder="e.g. 2026-09-24 23:59 CST"
                  value={formData.assignment_due_date}
                  onChange={(e) => setFormData({ ...formData, assignment_due_date: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row single">
              <div className="field">
                <label htmlFor="assDesc">Assignment Description &amp; Questions</label>
                <textarea
                  id="assDesc"
                  rows={2}
                  placeholder="Prompt for students to answer..."
                  value={formData.assignment_description}
                  onChange={(e) => setFormData({ ...formData, assignment_description: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={saving || uploadingNotes}>
            {saving ? "Publishing Class..." : "Publish Class to Student Portal"}
          </button>
        </form>
      </div>

      {/* Scheduled Classes List */}
      <h3>Currently Scheduled Classes ({classes.length})</h3>
      {loading ? (
        <p>Loading classes...</p>
      ) : classes.length === 0 ? (
        <p>No classes scheduled yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          {classes.map((c) => (
            <div key={c.id} className="dash-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div style={{ maxWidth: 720 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                  <span className="pill accent">Week {c.week_number}</span>
                  <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                    {c.date_time} ({c.duration_minutes} min)
                  </span>
                  <span className="pill muted">{c.meeting_platform}</span>
                </div>
                <h4 style={{ margin: "4px 0 8px", fontSize: 17 }}>{c.title}</h4>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 10 }}>{c.description}</p>
                {c.meeting_link && (
                  <div style={{ fontSize: 13, color: "var(--bg-navy)", marginBottom: 6 }}>
                    <strong>Teams Link: </strong>
                    <a href={c.meeting_link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", color: "var(--accent)" }}>
                      {c.meeting_link}
                    </a>
                  </div>
                )}
                {c.notes_title && (
                  <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                    <strong>Notes: </strong>{c.notes_title} ({c.notes_url})
                  </div>
                )}
                {c.assignment_title && (
                  <div style={{ fontSize: 13, color: "var(--accent)", marginTop: 4 }}>
                    <strong>Assignment: </strong>{c.assignment_title} (Due: {c.assignment_due_date || "N/A"})
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => handleDeleteClass(c.id)}
                  className="btn btn-outline btn-sm"
                  style={{ color: "#8A2A34", borderColor: "#8A2A34" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
