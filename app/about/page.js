"use client";

import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import StatStrip from "@/components/StatStrip";
import JourneyTimeline from "@/components/JourneyTimeline";
import { Accordion, AccordionItem } from "@/components/Accordion";
import { useSiteData } from "@/lib/DataContext";

const COUNT_LABELS = [
  ["publications", "Publications"],
  ["oralPresentations", "Oral Presentations"],
  ["posterPresentations", "Poster Presentations"],
  ["manuscriptReviews", "Manuscript Reviews"],
  ["journalsReviewed", "Journals Reviewed For"],
  ["citedByInvestigators", "Cited By Investigators"],
];

export default function AboutPage() {
  const { content } = useSiteData();
  const c = content.about;

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-grid" style={{ gridTemplateColumns: "0.85fr 1.15fr" }}>
          <ImagePlaceholder label="Doctor photo — to be added" height={320} />
          <div>
            <div className="eyebrow">{c.eyebrow}</div>
            <h1 style={{ marginBottom: 14 }}>{c.heading}</h1>
            <p className="lede" style={{ marginBottom: 10 }}>
              <strong>{c.tagline}</strong> {c.intro}
            </p>
            <p style={{ fontSize: 14, marginBottom: 26 }}>{c.note}</p>
            <div className="hero-actions">
              <Link href="/clinical-services" className="btn btn-primary">Request a Free Consultation</Link>
              <Link href="/research" className="btn btn-outline">View Research</Link>
            </div>
          </div>
        </div>
      </section>

      <StatStrip />

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The journey</div>
              <h2>From India, to the world — year by year</h2>
            </div>
            <p className="lede">Scroll to follow the path from medical school in India
              through specialist training in the UK to neonatology practice and research
              leadership in Chicago.</p>
          </div>
          <JourneyTimeline items={c.journey} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The full record</div>
              <h2>Employment, education, research &amp; more</h2>
            </div>
            <p className="lede">Click any section to expand it. Where a section links to a
              full supporting document, a button appears at the bottom of that section.</p>
          </div>

          {c.sections.map((section, idx) => (
            <Accordion
              key={section.key}
              index={idx + 1}
              label={section.label}
              count={section.items.length}
              defaultOpen={idx === 0}
            >
              {section.items.map((item) => (
                <AccordionItem key={item.title} title={item.title} meta={item.meta} body={item.body} />
              ))}
              {section.driveLink && (
                <a
                  href={section.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 16 }}
                >
                  View Full Document &#8599;
                </a>
              )}
            </Accordion>
          ))}
        </div>
      </section>

      {/* Awards & Honors — dedicated layout: image left, timeline right */}
      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Recognition</div>
              <h2>Awards &amp; Honors</h2>
            </div>
          </div>
          <div className="awards-grid">
            <div className="awards-gallery">
              {c.awardsGallery.map((img, idx) => (
                <ImagePlaceholder
                  key={idx}
                  label={img.caption || "Awards photo — to be added"}
                  imageUrl={img.imageUrl}
                  height="auto"
                />
              ))}
            </div>
            <div className="steps">
              {c.awards.map((award) => (
                <div className="step" key={award.title}>
                  <span className="meta" style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)", display: "block", marginBottom: 4 }}>{award.year}</span>
                  <h4>{award.title}</h4>
                  <p>{award.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* End-of-page counts */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">By the numbers</div>
              <h2>A career&apos;s worth of research, in one place</h2>
            </div>
          </div>
          <div className="grid grid-3">
            {COUNT_LABELS.map(([key, label]) => (
              <div className="card center" key={key}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", color: "var(--accent)" }}>{c.counts[key]}+</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section navy center">
        <div className="container">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>Talk to Dr. Mydam directly</div>
          <h2 style={{ marginBottom: 24 }}>Every consultation is a free phone call — no cost, ever</h2>
          <Link href="/clinical-services" className="btn btn-primary">Request a Free Consultation</Link>
        </div>
      </section>
    </>
  );
}
