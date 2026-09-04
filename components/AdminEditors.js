"use client";

import { useEffect, useState } from "react";
import { useSiteData } from "@/lib/DataContext";

// ---------------------------------------------------------------------
// Generic editor for an array of flat objects (e.g. cards, service
// blurbs, schedule rows) living at content[pageKey][arrayKey]. Pass a
// `fields` schema describing each object's keys, and this renders one
// editable card per item with Save/Delete, plus an Add button that
// appends a blank item using the same schema.
// ---------------------------------------------------------------------
export function ObjectArrayEditor({ pageKey, arrayKey, label, fields, columns = 3 }) {
  const { content, updateContentArrayItem, addContentArrayItem, deleteContentArrayItem } = useSiteData();
  const items = content[pageKey]?.[arrayKey] || [];
  const [forms, setForms] = useState(items);
  const [savedIdx, setSavedIdx] = useState(null);

  useEffect(() => { setForms(items); }, [items]);

  const handleChange = (idx, key) => (e) => {
    const next = [...forms];
    next[idx] = { ...next[idx], [key]: e.target.value };
    setForms(next);
  };

  const handleSave = (idx) => {
    updateContentArrayItem(pageKey, arrayKey, idx, forms[idx]);
    setSavedIdx(idx);
    setTimeout(() => setSavedIdx(null), 1500);
  };

  const handleAdd = () => {
    const blank = {};
    fields.forEach((f) => { blank[f.key] = ""; });
    addContentArrayItem(pageKey, arrayKey, blank);
  };

  const handleDelete = (idx) => {
    if (confirm("Remove this item?")) deleteContentArrayItem(pageKey, arrayKey, idx);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>{label}</h3>
        <button className="btn btn-outline btn-sm" onClick={handleAdd}>+ Add</button>
      </div>
      <div className={`grid grid-${columns}`}>
        {forms.map((item, idx) => (
          <div className="card" key={idx}>
            {fields.map((f) => (
              <div className="field" key={f.key} style={{ marginBottom: 12 }}>
                <label>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea value={item[f.key] || ""} onChange={handleChange(idx, f.key)} />
                ) : (
                  <input type="text" value={item[f.key] || ""} onChange={handleChange(idx, f.key)} />
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleSave(idx)}>
                {savedIdx === idx ? "Saved ✓" : "Save"}
              </button>
              <button className="btn btn-outline btn-sm" style={{ color: "var(--accent)" }} onClick={() => handleDelete(idx)}>Delete</button>
            </div>
          </div>
        ))}
        {forms.length === 0 && <p style={{ fontSize: 13.5, color: "var(--muted)" }}>No items yet — click Add.</p>}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Generic editor for an array of plain strings (e.g. purpose bullets,
// safety disclosures, completion standards).
// ---------------------------------------------------------------------
export function StringArrayEditor({ pageKey, arrayKey, label }) {
  const { content, updateContentArrayItem, addContentArrayItem, deleteContentArrayItem } = useSiteData();
  const items = content[pageKey]?.[arrayKey] || [];
  const [forms, setForms] = useState(items);
  const [savedIdx, setSavedIdx] = useState(null);

  useEffect(() => { setForms(items); }, [items]);

  const handleChange = (idx) => (e) => {
    const next = [...forms];
    next[idx] = e.target.value;
    setForms(next);
  };

  const handleSave = (idx) => {
    updateContentArrayItem(pageKey, arrayKey, idx, forms[idx]);
    setSavedIdx(idx);
    setTimeout(() => setSavedIdx(null), 1500);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>{label}</h3>
        <button className="btn btn-outline btn-sm" onClick={() => addContentArrayItem(pageKey, arrayKey, "")}>+ Add line</button>
      </div>
      {forms.map((val, idx) => (
        <div key={idx} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
          <textarea style={{ flex: 1 }} value={val} onChange={handleChange(idx)} />
          <button className="btn btn-primary btn-sm" onClick={() => handleSave(idx)}>{savedIdx === idx ? "Saved ✓" : "Save"}</button>
          <button
            className="btn btn-outline btn-sm"
            style={{ color: "var(--accent)" }}
            onClick={() => { if (confirm("Remove this line?")) deleteContentArrayItem(pageKey, arrayKey, idx); }}
          >
            Delete
          </button>
        </div>
      ))}
      {forms.length === 0 && <p style={{ fontSize: 13.5, color: "var(--muted)" }}>No lines yet — click Add.</p>}
    </div>
  );
}

// ---------------------------------------------------------------------
// Nested editor for content[pageKey][arrayKey][groupIndex][itemArrayKey]
// — used for About's "sections -> items" structure (accordion groups
// each containing a list of employment/education/etc. entries).
// ---------------------------------------------------------------------
export function NestedGroupEditor({ pageKey, arrayKey, itemArrayKey, fields }) {
  const { content, updateNestedArrayItem, addNestedArrayItem, deleteNestedArrayItem, updateNestedGroupMeta } = useSiteData();
  const groups = content[pageKey]?.[arrayKey] || [];

  return (
    <div className="panel">
      <div className="panel-head"><h3>About — Accordion Sections</h3></div>
      {groups.map((group, gIdx) => (
        <GroupBlock
          key={group.key || gIdx}
          label={group.label}
          items={group.items || []}
          driveLink={group.driveLink || ""}
          fields={fields}
          onSave={(iIdx, updates) => updateNestedArrayItem(pageKey, arrayKey, gIdx, itemArrayKey, iIdx, updates)}
          onSaveDriveLink={(link) => updateNestedGroupMeta(pageKey, arrayKey, gIdx, { driveLink: link })}
          onAdd={() => {
            const blank = {};
            fields.forEach((f) => { blank[f.key] = ""; });
            addNestedArrayItem(pageKey, arrayKey, gIdx, itemArrayKey, blank);
          }}
          onDelete={(iIdx) => { if (confirm("Remove this entry?")) deleteNestedArrayItem(pageKey, arrayKey, gIdx, itemArrayKey, iIdx); }}
        />
      ))}
    </div>
  );
}

function GroupBlock({ label, items, driveLink, fields, onSave, onSaveDriveLink, onAdd, onDelete }) {
  const [forms, setForms] = useState(items);
  const [savedIdx, setSavedIdx] = useState(null);
  const [linkValue, setLinkValue] = useState(driveLink);
  const [linkSaved, setLinkSaved] = useState(false);

  useEffect(() => { setForms(items); }, [items]);
  useEffect(() => { setLinkValue(driveLink); }, [driveLink]);

  const handleChange = (idx, key) => (e) => {
    const next = [...forms];
    next[idx] = { ...next[idx], [key]: e.target.value };
    setForms(next);
  };

  return (
    <div style={{ marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h4 style={{ fontSize: "1rem", fontWeight: 700 }}>{label} ({forms.length} entries)</h4>
        <button className="btn btn-outline btn-sm" onClick={onAdd}>+ Add entry</button>
      </div>
      <div className="field" style={{ marginBottom: 16, maxWidth: 560 }}>
        <label style={{ fontSize: 12 }}>Google Drive link for the full document (shown as a &quot;View Full Document&quot; button on the public page — leave blank to hide it)</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            style={{ flex: 1 }}
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            placeholder="https://drive.google.com/..."
          />
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { onSaveDriveLink(linkValue); setLinkSaved(true); setTimeout(() => setLinkSaved(false), 1500); }}
          >
            {linkSaved ? "Saved ✓" : "Save Link"}
          </button>
        </div>
      </div>
      <div className="grid grid-3">
        {forms.map((item, idx) => (
          <div className="card" key={idx}>
            {fields.map((f) => (
              <div className="field" key={f.key} style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12 }}>{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea value={item[f.key] || ""} onChange={handleChange(idx, f.key)} />
                ) : (
                  <input type="text" value={item[f.key] || ""} onChange={handleChange(idx, f.key)} />
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { onSave(idx, forms[idx]); setSavedIdx(idx); setTimeout(() => setSavedIdx(null), 1500); }}>
                {savedIdx === idx ? "Saved ✓" : "Save"}
              </button>
              <button className="btn btn-outline btn-sm" style={{ color: "var(--accent)" }} onClick={() => onDelete(idx)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Question Bank topics editor — each topic has a label/count plus a
// nested array of subtopic strings, edited as a comma-separated line
// for simplicity (subtopics are short tags, not prose).
// ---------------------------------------------------------------------
export function QuestionTopicsEditor() {
  const { content, updateContentArrayItem, addContentArrayItem, deleteContentArrayItem } = useSiteData();
  const topics = content.questionBanks?.topics || [];
  const [forms, setForms] = useState(topics.map((t) => ({ ...t, subtopicsText: (t.subtopics || []).join(", ") })));
  const [savedIdx, setSavedIdx] = useState(null);

  useEffect(() => {
    setForms(topics.map((t) => ({ ...t, subtopicsText: (t.subtopics || []).join(", ") })));
  }, [topics]);

  const handleChange = (idx, key) => (e) => {
    const next = [...forms];
    next[idx] = { ...next[idx], [key]: e.target.value };
    setForms(next);
  };

  const handleSave = (idx) => {
    const f = forms[idx];
    updateContentArrayItem("questionBanks", "topics", idx, {
      label: f.label,
      count: Number(f.count) || 0,
      subtopics: f.subtopicsText.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSavedIdx(idx);
    setTimeout(() => setSavedIdx(null), 1500);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Question Bank Topics</h3>
        <button className="btn btn-outline btn-sm" onClick={() => addContentArrayItem("questionBanks", "topics", { label: "New Topic", count: 0, subtopics: [] })}>+ Add topic</button>
      </div>
      <div className="grid grid-3">
        {forms.map((t, idx) => (
          <div className="card" key={idx}>
            <div className="field" style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12 }}>Topic label</label>
              <input type="text" value={t.label} onChange={handleChange(idx, "label")} />
            </div>
            <div className="field" style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12 }}>Item count</label>
              <input type="number" value={t.count} onChange={handleChange(idx, "count")} />
            </div>
            <div className="field" style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12 }}>Sub-topics (comma-separated)</label>
              <textarea value={t.subtopicsText} onChange={handleChange(idx, "subtopicsText")} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleSave(idx)}>{savedIdx === idx ? "Saved ✓" : "Save"}</button>
              <button
                className="btn btn-outline btn-sm"
                style={{ color: "var(--accent)" }}
                onClick={() => { if (confirm("Remove this topic?")) deleteContentArrayItem("questionBanks", "topics", idx); }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Small flat-number editor for content[pageKey].counts (e.g. About's
// publication/presentation/review counts shown at the bottom of the page).
// ---------------------------------------------------------------------
export function CountsEditor({ pageKey, fields, label }) {
  const { content, updateContent } = useSiteData();
  const counts = content[pageKey]?.counts || {};
  const [form, setForm] = useState(counts);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(counts); }, [content, pageKey]);

  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: Number(e.target.value) || 0 }));
    setSaved(false);
  };

  const handleSave = () => {
    updateContent(pageKey, { counts: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>{label}</h3>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>{saved ? "Saved ✓" : "Save"}</button>
      </div>
      <div className="kpi-row" style={{ marginBottom: 0 }}>
        {fields.map((f) => (
          <div className="kpi" key={f.key}>
            <div className="lbl">{f.label}</div>
            <input type="number" value={form[f.key] ?? 0} onChange={handleChange(f.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}
