"use client";

import { useState } from "react";
import AdminShell from "@/components/AdminShell";
import MeetingCard from "@/components/MeetingCard";
import { useSiteData } from "@/lib/DataContext";

const EMPTY_FORM = { title: "", description: "", date: "", imageUrl: "", joinLink: "", isFree: true, price: 0 };

export default function AdminMeetingsPage() {
  const { meetings, addMeeting, updateMeeting, deleteMeeting } = useSiteData();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: form.isFree ? 0 : Number(form.price) || 0,
    };
    if (editingId) {
      updateMeeting(editingId, payload);
    } else {
      addMeeting(payload);
    }
    resetForm();
  };

  const startEdit = (m) => {
    setForm({
      title: m.title, description: m.description, date: m.date,
      imageUrl: m.imageUrl || "", joinLink: m.joinLink || "", isFree: m.isFree, price: m.price,
    });
    setEditingId(m.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AdminShell>
      <div className="dash-top">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Admin · Education &amp; Training · Live Learning</div>
          <h2>Manage Meeting &amp; Event Cards</h2>
        </div>
        <a href="/education-training/live-learning" className="btn btn-outline btn-sm">View public meetings page</a>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>{editingId ? "Edit Meeting" : "Add a New Meeting"}</h3></div>
        <form onSubmit={handleSubmit}>
          <div className="form-row single">
            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. Pediatric Case Review — Live Session" />
            </div>
          </div>
          <div className="form-row single">
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" required value={form.description} onChange={handleChange} placeholder="What happens in this session?" />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="date">Date / schedule text</label>
              <input id="date" name="date" required value={form.date} onChange={handleChange} placeholder="e.g. Every Tuesday · 7:00 PM IST" />
            </div>
            <div className="field">
              <label htmlFor="imageUrl">Image URL (optional)</label>
              <input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://... (leave blank for a placeholder)" />
            </div>
          </div>
          <div className="form-row single">
            <div className="field">
              <label htmlFor="joinLink">Meeting join link (Zoom / Google Meet)</label>
              <input id="joinLink" name="joinLink" value={form.joinLink} onChange={handleChange} placeholder="https://zoom.us/j/... or https://meet.google.com/..." />
              <span className="hint">Only shown to students once they're logged in — never posted publicly on the site.</span>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label>Pricing</label>
              <div className="radio-group" style={{ display: "flex", gap: 10 }}>
                <label className={`radio-chip${form.isFree ? " checked" : ""}`}>
                  <input type="radio" name="isFree" checked={form.isFree} onChange={() => setForm((f) => ({ ...f, isFree: true }))} />
                  Free
                </label>
                <label className={`radio-chip${!form.isFree ? " checked" : ""}`}>
                  <input type="radio" name="isFree" checked={!form.isFree} onChange={() => setForm((f) => ({ ...f, isFree: false }))} />
                  Paid
                </label>
              </div>
            </div>
            {!form.isFree && (
              <div className="field">
                <label htmlFor="price">Price (USD) — fully admin-controlled</label>
                <input id="price" name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="25" />
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="submit" className="btn btn-primary">{editingId ? "Save Changes" : "Add Meeting"}</button>
            {editingId && <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel Edit</button>}
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-head"><h3>Current Meetings ({meetings.length})</h3></div>
        {meetings.length === 0 ? (
          <p style={{ fontSize: 14 }}>No meetings yet — add one above.</p>
        ) : (
          <div className="grid grid-3">
            {meetings.map((m) => (
              <div key={m.id}>
                <MeetingCard meeting={m} />
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => startEdit(m)}>Edit</button>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, color: "var(--accent)", borderColor: "var(--accent-soft)" }}
                    onClick={() => { if (confirm("Remove this meeting?")) deleteMeeting(m.id); }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
