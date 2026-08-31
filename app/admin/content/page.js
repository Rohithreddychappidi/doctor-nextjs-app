"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { useSiteData } from "@/lib/DataContext";

// Schema describing the simple (flat-field) pages. Each entry becomes
// one editable panel in the admin UI. Adding a new editable field
// anywhere on the site just means adding it to DEFAULT_CONTENT in
// defaultData.js and listing it here — no new bespoke form needed.
const SIMPLE_PAGES = [
  { key: "about", label: "About", fields: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "tagline", label: "Tagline (bold lead-in)", type: "input" },
    { key: "intro", label: "Intro sentence", type: "textarea" },
    { key: "note", label: "Note under intro", type: "textarea" },
  ]},
  { key: "educationTraining", label: "Education & Training", fields: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ]},
  { key: "clinicalServices", label: "Clinical Services", fields: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ]},
  { key: "advisoryServices", label: "Advisory Services", fields: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ]},
  { key: "communityImpact", label: "Community Impact", fields: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ]},
  { key: "research", label: "Research", fields: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ]},
  { key: "testimonials", label: "Testimonials (intro text)", fields: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ]},
  { key: "contact", label: "Contact (intro text)", fields: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ]},
];

function SimplePagePanel({ pageKey, label, fields }) {
  const { content, updateContent } = useSiteData();
  const [form, setForm] = useState(content[pageKey]);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(content[pageKey]); }, [content, pageKey]);

  const handleChange = (fieldKey) => (e) => {
    setForm((f) => ({ ...f, [fieldKey]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateContent(pageKey, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>{label}</h3>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>{saved ? "Saved ✓" : "Save"}</button>
      </div>
      {fields.map((f) => (
        <div className="field" key={f.key} style={{ marginBottom: 14 }}>
          <label>{f.label}</label>
          {f.type === "textarea" ? (
            <textarea value={form?.[f.key] || ""} onChange={handleChange(f.key)} />
          ) : (
            <input type="text" value={form?.[f.key] || ""} onChange={handleChange(f.key)} />
          )}
        </div>
      ))}
    </div>
  );
}

function HomeBannerSlidesPanel() {
  const { content, updateContentArrayItem } = useSiteData();
  const slides = content.home.bannerSlides;
  const [forms, setForms] = useState(slides);
  const [savedIdx, setSavedIdx] = useState(null);

  useEffect(() => { setForms(slides); }, [slides]);

  const handleChange = (idx, key) => (e) => {
    const next = [...forms];
    next[idx] = { ...next[idx], [key]: e.target.value };
    setForms(next);
  };

  const handleSave = (idx) => {
    updateContentArrayItem("home", "bannerSlides", idx, forms[idx]);
    setSavedIdx(idx);
    setTimeout(() => setSavedIdx(null), 1800);
  };

  return (
    <div className="panel">
      <div className="panel-head"><h3>Home Banner Slides</h3></div>
      <div className="grid grid-3">
        {forms.map((slide, idx) => (
          <div className="card" key={idx}>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Tag</label>
              <input type="text" value={slide.tag} onChange={handleChange(idx, "tag")} />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Heading</label>
              <input type="text" value={slide.heading} onChange={handleChange(idx, "heading")} />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Body</label>
              <textarea value={slide.body} onChange={handleChange(idx, "body")} />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Button label</label>
              <input type="text" value={slide.ctaLabel} onChange={handleChange(idx, "ctaLabel")} />
            </div>
            <button className="btn btn-primary btn-sm btn-block" onClick={() => handleSave(idx)}>
              {savedIdx === idx ? "Saved ✓" : "Save Slide"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeCardsPanel() {
  const { content, updateContentArrayItem } = useSiteData();
  const cards = content.home.cards;
  const [forms, setForms] = useState(cards);
  const [savedIdx, setSavedIdx] = useState(null);

  useEffect(() => { setForms(cards); }, [cards]);

  const handleChange = (idx, key) => (e) => {
    const next = [...forms];
    next[idx] = { ...next[idx], [key]: e.target.value };
    setForms(next);
  };

  const handleSave = (idx) => {
    updateContentArrayItem("home", "cards", idx, forms[idx]);
    setSavedIdx(idx);
    setTimeout(() => setSavedIdx(null), 1800);
  };

  return (
    <div className="panel">
      <div className="panel-head"><h3>Home — &quot;What this practice offers&quot; Cards</h3></div>
      <div className="grid grid-3">
        {forms.map((card, idx) => (
          <div className="card" key={idx}>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Heading</label>
              <input type="text" value={card.heading} onChange={handleChange(idx, "heading")} />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Body</label>
              <textarea value={card.body} onChange={handleChange(idx, "body")} />
            </div>
            <button className="btn btn-primary btn-sm btn-block" onClick={() => handleSave(idx)}>
              {savedIdx === idx ? "Saved ✓" : "Save Card"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  const { resetAllContent } = useSiteData();

  return (
    <AdminShell>
      <div className="dash-top">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Admin · Site Content</div>
          <h2>Edit Text Across the Whole Site</h2>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => { if (confirm("Reset ALL content, stats, meetings, testimonials and requests back to the original defaults? This cannot be undone.")) resetAllContent(); }}
        >
          Reset everything to defaults
        </button>
      </div>

      <div className="form-note" style={{ marginBottom: 24 }}>
        <span>&#9432;</span>
        <span>This covers the hero/intro text on every page, the Home banner slides, and
          the Home service cards. Structured content — the About page&apos;s accordion
          entries, the Tele-Rotation curriculum, Question Bank topics — lives in code for
          now and will move here once the client&apos;s real content makes clear which
          fields change often enough to need it.</span>
      </div>

      <HomeBannerSlidesPanel />
      <HomeCardsPanel />

      {SIMPLE_PAGES.map((p) => (
        <SimplePagePanel key={p.key} pageKey={p.key} label={p.label} fields={p.fields} />
      ))}
    </AdminShell>
  );
}
