"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { useSiteData } from "@/lib/DataContext";
import { ObjectArrayEditor, NestedGroupEditor, CountsEditor } from "@/components/AdminEditors";

const ABOUT_HERO_FIELDS = [
  { key: "eyebrow", label: "Eyebrow label", type: "input" },
  { key: "heading", label: "Heading (name + credentials)", type: "input" },
  { key: "tagline", label: "Tagline (bold lead-in)", type: "input" },
  { key: "intro", label: "Intro sentence", type: "textarea" },
  { key: "note", label: "Note under intro", type: "textarea" },
];

function AboutHeroPanel() {
  const { content, updateContent } = useSiteData();
  const [form, setForm] = useState(content.about);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(content.about); }, [content]);

  const handleChange = (fieldKey) => (e) => {
    setForm((f) => ({ ...f, [fieldKey]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateContent("about", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Hero Text (top of the About page)</h3>
        <button className="btn btn-primary btn-sm" onClick={handleSave}>{saved ? "Saved ✓" : "Save"}</button>
      </div>
      {ABOUT_HERO_FIELDS.map((f) => (
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

export default function AdminAboutPage() {
  const { resetAllContent } = useSiteData();

  return (
    <AdminShell>
      <div className="dash-top">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Admin · About Page</div>
          <h2>Doctor&apos;s Full Profile &amp; CV</h2>
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
        <span>This page has its own dedicated editor since it holds by far the most
          content on the site — 18 CV sections, an awards timeline, and career counts.
          Each of the 18 sections below is individually collapsible; click one to expand
          and edit it. Each section can also carry a Google Drive link — when set, a
          &quot;View Full Document&quot; button appears on the public page for anyone who
          wants the complete, un-tightened detail.</span>
      </div>

      <AboutHeroPanel />

      <ObjectArrayEditor
        pageKey="about"
        arrayKey="journey"
        label="Career Journey Timeline (animated, shown right after the stats)"
        columns={3}
        fields={[
          { key: "year", label: "Year" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "imageUrl", label: "Mini photo URL (optional)" },
        ]}
      />

      <div className="panel">
        <div className="panel-head"><h3>CV Sections (18) — click any to expand</h3></div>
        <NestedGroupEditor
          pageKey="about"
          arrayKey="sections"
          itemArrayKey="items"
          fields={[
            { key: "title", label: "Title" },
            { key: "meta", label: "Meta (date/context)" },
            { key: "body", label: "Body", type: "textarea" },
          ]}
        />
      </div>

      <ObjectArrayEditor
        pageKey="about"
        arrayKey="awardsGallery"
        label="Awards & Honors Photo Gallery (2-column grid, left side of the timeline)"
        columns={4}
        fields={[
          { key: "imageUrl", label: "Photo URL" },
          { key: "caption", label: "Caption (shown if no photo)" },
        ]}
      />

      <ObjectArrayEditor
        pageKey="about"
        arrayKey="awards"
        label="Awards & Honors Timeline (shown after all sections, image + timeline layout)"
        columns={3}
        fields={[
          { key: "year", label: "Year" },
          { key: "title", label: "Award Title" },
          { key: "description", label: "Description", type: "textarea" },
        ]}
      />

      <CountsEditor
        pageKey="about"
        label="End-of-Page Counts Strip"
        fields={[
          { key: "publications", label: "PUBLICATIONS" },
          { key: "oralPresentations", label: "ORAL PRESENTATIONS" },
          { key: "posterPresentations", label: "POSTER PRESENTATIONS" },
          { key: "manuscriptReviews", label: "MANUSCRIPT REVIEWS" },
          { key: "journalsReviewed", label: "JOURNALS REVIEWED FOR" },
          { key: "citedByInvestigators", label: "CITED BY INVESTIGATORS" },
        ]}
      />
    </AdminShell>
  );
}
