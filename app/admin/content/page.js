"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { Accordion } from "@/components/Accordion";
import { useSiteData } from "@/lib/DataContext";
import { ObjectArrayEditor, StringArrayEditor, QuestionTopicsEditor } from "@/components/AdminEditors";

// Flat-field schema for every "simple" page (hero eyebrow/heading/body
// and similar). Adding a new flat editable field anywhere = add it to
// DEFAULT_CONTENT in defaultData.js, then list it here.
const SIMPLE_FIELDS = {
  home: [
    { key: "offersEyebrow", label: "Offers section — eyebrow", type: "input" },
    { key: "offersHeading", label: "Offers section — heading", type: "input" },
    { key: "offersSubtext", label: "Offers section — subtext", type: "textarea" },
    { key: "liveLearningEyebrow", label: "Live Learning preview — eyebrow", type: "input" },
    { key: "liveLearningHeading", label: "Live Learning preview — heading", type: "input" },
    { key: "promoHeading", label: "Donation promo band — heading", type: "input" },
    { key: "promoBody", label: "Donation promo band — body", type: "textarea" },
    { key: "testimonialsEyebrow", label: "Testimonials preview — eyebrow", type: "input" },
    { key: "testimonialsHeading", label: "Testimonials preview — heading", type: "input" },
    { key: "closingEyebrow", label: "Closing CTA — eyebrow", type: "input" },
    { key: "closingHeading", label: "Closing CTA — heading", type: "input" },
    { key: "closingBody", label: "Closing CTA — body", type: "textarea" },
  ],
  educationTraining: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ],
  liveLearning: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ],
  questionBanks: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ],
  teleRotations: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ],
  physicalRotations: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
    { key: "eligibilityHeading", label: "Eligibility card — heading", type: "input" },
    { key: "eligibilityBody", label: "Eligibility card — body", type: "textarea" },
  ],
  clinicalServices: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
    { key: "privacyHeading", label: "Privacy card — heading", type: "input" },
    { key: "privacyBody", label: "Privacy card — body", type: "textarea" },
  ],
  advisoryServices: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ],
  nicuDevelopment: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ],
  curriculumDevelopment: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ],
  communityImpact: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
    { key: "supportHeading", label: "Support card — heading", type: "input" },
    { key: "supportBody", label: "Support card — body", type: "textarea" },
    { key: "supportNote", label: "Support card — small note", type: "textarea" },
  ],
  research: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ],
  testimonials: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
  ],
  contact: [
    { key: "eyebrow", label: "Eyebrow label", type: "input" },
    { key: "heading", label: "Heading", type: "input" },
    { key: "body", label: "Intro paragraph", type: "textarea" },
    { key: "email", label: "Contact email", type: "input" },
  ],
};

function FlatFieldsPanel({ pageKey, fields }) {
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
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Page text</h3>
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

function HomeHeroBannerEditor() {
  const { content, updateContent } = useSiteData();
  const currentHero = content?.home?.heroBanner || {
    tag: "NEONATOLOGY · PEDIATRICS · USCE TRAINING · CLINICAL RESEARCH",
    heading: "Elevating Newborn & Pediatric Healthcare Through Clinical Mentorship",
    subtitle: "Join premier clinical tele-rotations, high-yield board question banks, and weekly grand rounds mentored by Dr. Janardhan Mydam, MD, FAAP — Chair of Pediatrics at Humboldt Park Health.",
    pcImageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1600&auto=format&fit=crop",
    mobileImageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    primaryBtnText: "Explore Education & Training",
    primaryBtnLink: "/education-training",
    secondaryBtnText: "Doctor Portfolio & Bio",
    secondaryBtnLink: "/doctor-portfolio",
  };

  const [form, setForm] = useState(currentHero);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (content?.home?.heroBanner) {
      setForm(content.home.heroBanner);
    }
  }, [content]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    const updatedHome = {
      ...(content?.home || {}),
      heroBanner: form,
    };
    updateContent("home", updatedHome);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="panel" style={{ border: "2px solid #E9C989", backgroundColor: "#FCFBF8" }}>
      <div className="panel-head" style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "14px", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0E182A" }}>
            🖥️ Home Page Hero Banner CMS (PC &amp; Mobile Views)
          </h3>
          <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>
            Configure the full-bleed hero banner image, headline typography, and action buttons for desktop and mobile visitors.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleSave}>
          {saved ? "Saved to Live Site ✓" : "Save Banner Changes"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div className="field">
          <label style={{ fontWeight: 600, fontSize: "12px" }}>💻 PC / Desktop Banner Image URL</label>
          <input
            type="text"
            value={form.pcImageUrl || ""}
            onChange={handleChange("pcImageUrl")}
            placeholder="https://..."
            style={{ fontSize: "12px" }}
          />
          <span style={{ fontSize: "11px", color: "#64748B" }}>Recommended aspect ratio 16:9 or 21:9 (1600x900px)</span>
        </div>

        <div className="field">
          <label style={{ fontWeight: 600, fontSize: "12px" }}>📱 Mobile View Banner Image URL</label>
          <input
            type="text"
            value={form.mobileImageUrl || ""}
            onChange={handleChange("mobileImageUrl")}
            placeholder="https://..."
            style={{ fontSize: "12px" }}
          />
          <span style={{ fontSize: "11px", color: "#64748B" }}>Optimized for vertical/square mobile screens (800x800px)</span>
        </div>
      </div>

      <div className="field" style={{ marginBottom: "14px" }}>
        <label style={{ fontWeight: 600, fontSize: "12px" }}>Eyebrow Tag (Gold Badge)</label>
        <input
          type="text"
          value={form.tag || ""}
          onChange={handleChange("tag")}
          placeholder="NEONATOLOGY · PEDIATRICS..."
        />
      </div>

      <div className="field" style={{ marginBottom: "14px" }}>
        <label style={{ fontWeight: 600, fontSize: "12px" }}>Hero Main Heading</label>
        <input
          type="text"
          value={form.heading || ""}
          onChange={handleChange("heading")}
          placeholder="Headline text..."
        />
      </div>

      <div className="field" style={{ marginBottom: "14px" }}>
        <label style={{ fontWeight: 600, fontSize: "12px" }}>Hero Subtitle / Description</label>
        <textarea
          rows={3}
          value={form.subtitle || ""}
          onChange={handleChange("subtitle")}
          placeholder="Describe the clinical programs and mentorship..."
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div style={{ backgroundColor: "#FFFFFF", padding: "12px", borderRadius: "8px", border: "1px solid #CBD5E1" }}>
          <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#0D9488", marginBottom: "8px" }}>Primary Button</div>
          <div className="field" style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "11px" }}>Button Text</label>
            <input type="text" value={form.primaryBtnText || ""} onChange={handleChange("primaryBtnText")} />
          </div>
          <div className="field">
            <label style={{ fontSize: "11px" }}>Destination URL</label>
            <input type="text" value={form.primaryBtnLink || ""} onChange={handleChange("primaryBtnLink")} />
          </div>
        </div>

        <div style={{ backgroundColor: "#FFFFFF", padding: "12px", borderRadius: "8px", border: "1px solid #CBD5E1" }}>
          <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#B4832A", marginBottom: "8px" }}>Secondary Button</div>
          <div className="field" style={{ marginBottom: "8px" }}>
            <label style={{ fontSize: "11px" }}>Button Text</label>
            <input type="text" value={form.secondaryBtnText || ""} onChange={handleChange("secondaryBtnText")} />
          </div>
          <div className="field">
            <label style={{ fontSize: "11px" }}>Destination URL</label>
            <input type="text" value={form.secondaryBtnLink || ""} onChange={handleChange("secondaryBtnLink")} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Each entry: { key, label, extra: [React nodes rendered after the flat-field panel] }
function usePageGroups() {
  return [
    { key: "home", label: "Home", extra: ["hero-banner-editor", "home-banner", "home-cards"] },
    { key: "educationTraining", label: "Education & Training (hub)", extra: ["education-subpages"] },
    { key: "liveLearning", label: "Live Learning" },
    { key: "questionBanks", label: "Question Banks", extra: ["question-topics"] },
    { key: "teleRotations", label: "Tele-Rotations", extra: ["tele-purpose", "tele-outcomes", "tele-schedule", "tele-assessment", "tele-completion", "tele-safety"] },
    { key: "physicalRotations", label: "Physical Rotations", extra: ["physical-tracks", "physical-expect"] },
    { key: "clinicalServices", label: "Clinical Services", extra: ["clinical-features"] },
    { key: "advisoryServices", label: "Advisory Services (hub)", extra: ["advisory-subpages"] },
    { key: "nicuDevelopment", label: "NICU Development & Expansion", extra: ["nicu-services"] },
    { key: "curriculumDevelopment", label: "Curriculum Development", extra: ["curriculum-services"] },
    { key: "communityImpact", label: "Community Impact", extra: ["community-initiatives"] },
    { key: "research", label: "Research", extra: ["research-ongoing", "research-publications"] },
    { key: "testimonials", label: "Testimonials (intro text)" },
    { key: "contact", label: "Contact" },
  ];
}

function renderExtra(key) {
  switch (key) {
    case "hero-banner-editor":
      return <HomeHeroBannerEditor key={key} />;
    case "home-banner":
      return <ObjectArrayEditor key={key} pageKey="home" arrayKey="bannerSlides" label="Home Banner Slides" columns={3}
        fields={[{ key: "tag", label: "Tag" }, { key: "heading", label: "Heading" }, { key: "body", label: "Body", type: "textarea" }, { key: "ctaLabel", label: "Button label" }]} />;
    case "home-cards":
      return <ObjectArrayEditor key={key} pageKey="home" arrayKey="cards" label='"What this practice offers" Cards' columns={3}
        fields={[{ key: "heading", label: "Heading" }, { key: "body", label: "Body", type: "textarea" }]} />;
    case "education-subpages":
      return <ObjectArrayEditor key={key} pageKey="educationTraining" arrayKey="subpages" label="Hub Cards (Live Learning, Question Banks, etc.)" columns={2}
        fields={[{ key: "label", label: "Label" }, { key: "blurb", label: "Blurb", type: "textarea" }]} />;
    case "question-topics":
      return <QuestionTopicsEditor key={key} />;
    case "tele-purpose":
      return <StringArrayEditor key={key} pageKey="teleRotations" arrayKey="purpose" label="Purpose Bullets" />;
    case "tele-outcomes":
      return <StringArrayEditor key={key} pageKey="teleRotations" arrayKey="outcomes" label="Learning Outcomes" />;
    case "tele-schedule":
      return <ObjectArrayEditor key={key} pageKey="teleRotations" arrayKey="schedule" label="6-Week Learning Hub Modules" columns={2}
        fields={[
          { key: "week", label: "Week" },
          { key: "focus", label: "Clinical Focus", type: "textarea" },
          { key: "products", label: "Skills / Products", type: "textarea" },
          { key: "sessionDate", label: "Live session date/time (e.g. Tue Sept 9 · 7:00 PM IST)" },
          { key: "joinLink", label: "Join link (auto-filled by Zoom integration once backend is live — leave blank for now)" },
        ]} />;
    case "tele-assessment":
      return <ObjectArrayEditor key={key} pageKey="teleRotations" arrayKey="assessment" label="Assessment Weighting" columns={3}
        fields={[{ key: "component", label: "Component" }, { key: "weight", label: "Weight (e.g. 10%)" }]} />;
    case "tele-completion":
      return <StringArrayEditor key={key} pageKey="teleRotations" arrayKey="completionStandard" label="Completion Standard" />;
    case "tele-safety":
      return <StringArrayEditor key={key} pageKey="teleRotations" arrayKey="safety" label="Safety, Privacy & Scope" />;
    case "physical-tracks":
      return <ObjectArrayEditor key={key} pageKey="physicalRotations" arrayKey="tracks" label="Track Cards" columns={3}
        fields={[{ key: "pill", label: "Pill label" }, { key: "heading", label: "Heading" }, { key: "body", label: "Body", type: "textarea" }]} />;
    case "physical-expect":
      return <ObjectArrayEditor key={key} pageKey="physicalRotations" arrayKey="whatToExpect" label="What To Expect Steps" columns={3}
        fields={[{ key: "heading", label: "Heading" }, { key: "body", label: "Body", type: "textarea" }]} />;
    case "clinical-features":
      return <ObjectArrayEditor key={key} pageKey="clinicalServices" arrayKey="features" label="Feature Cards (Scheduling, Telehealth, Emergency)" columns={3}
        fields={[{ key: "heading", label: "Heading" }, { key: "body", label: "Body", type: "textarea" }]} />;
    case "advisory-subpages":
      return <ObjectArrayEditor key={key} pageKey="advisoryServices" arrayKey="subpages" label="Hub Cards" columns={2}
        fields={[{ key: "label", label: "Label" }, { key: "blurb", label: "Blurb", type: "textarea" }]} />;
    case "nicu-services":
      return <ObjectArrayEditor key={key} pageKey="nicuDevelopment" arrayKey="services" label="Service Cards" columns={3}
        fields={[{ key: "heading", label: "Heading" }, { key: "body", label: "Body", type: "textarea" }]} />;
    case "curriculum-services":
      return <ObjectArrayEditor key={key} pageKey="curriculumDevelopment" arrayKey="services" label="Service Cards" columns={3}
        fields={[{ key: "heading", label: "Heading" }, { key: "body", label: "Body", type: "textarea" }]} />;
    case "community-initiatives":
      return <ObjectArrayEditor key={key} pageKey="communityImpact" arrayKey="initiatives" label="Initiative Cards" columns={3}
        fields={[{ key: "heading", label: "Heading" }, { key: "body", label: "Body", type: "textarea" }]} />;
    case "research-ongoing":
      return <ObjectArrayEditor key={key} pageKey="research" arrayKey="ongoing" label="Ongoing Studies" columns={3}
        fields={[{ key: "status", label: "Status pill" }, { key: "heading", label: "Heading" }, { key: "body", label: "Body", type: "textarea" }]} />;
    case "research-publications":
      return <ObjectArrayEditor key={key} pageKey="research" arrayKey="publications" label="Publications Table" columns={3}
        fields={[{ key: "title", label: "Title" }, { key: "focus", label: "Focus" }, { key: "year", label: "Year" }, { key: "status", label: "Status (done/progress/new)" }]} />;
    default:
      return null;
  }
}

export default function AdminContentPage() {
  const { resetAllContent } = useSiteData();
  const groups = usePageGroups();

  return (
    <AdminShell>
      <div className="dash-top">
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Admin · Site Content</div>
          <h2>Complete Site CMS</h2>
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
        <span>Every page on the site is listed below. Click a page to expand it and edit
          its text, cards, and lists directly — changes save to this browser and appear
          immediately on the public site.</span>
      </div>

      {groups.map((g, idx) => (
        <Accordion key={g.key} index={idx + 1} label={g.label} defaultOpen={false}>
          <FlatFieldsPanel pageKey={g.key} fields={SIMPLE_FIELDS[g.key]} />
          {(g.extra || []).map((extraKey) => renderExtra(extraKey))}
        </Accordion>
      ))}
    </AdminShell>
  );
}
