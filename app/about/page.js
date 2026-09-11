"use client";

import Link from "next/link";
import StatStrip from "@/components/StatStrip";
import JourneyTimeline from "@/components/JourneyTimeline";
import CitationChart from "@/components/CitationChart";
import ScholarCard from "@/components/ScholarCard";
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
        <div className="container hero-grid" style={{ gridTemplateColumns: "0.85fr 1.15fr", alignItems: "center" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.12)", maxWidth: 360, margin: "0 auto", border: "1px solid #E2E8F0" }}>
            <img
              src={c.photoUrl || "/images/dr-janardhan-mydam.jpg"}
              alt="Dr. Janardhan Mydam, MD, FAAP"
              style={{ width: "100%", height: 420, objectFit: "cover", objectPosition: "top center", display: "block" }}
            />
          </div>
          <div>
            <div className="eyebrow">{c.eyebrow || "About Dr. Mydam"}</div>
            <h1 style={{ marginBottom: 14 }}>{c.heading || "Dr. Janardhan Mydam, MD, FAAP"}</h1>
            <p className="lede" style={{ marginBottom: 12 }}>
              <strong>Clinical Experience. Academic Leadership. Commitment to Teaching.</strong>
            </p>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.65, marginBottom: 16 }}>
              Dr. Janardhan Mydam is a board-certified neonatologist and pediatrician with extensive experience in newborn medicine, pediatric care, medical education, clinical research, physician mentorship, and healthcare leadership. His work is centered on improving outcomes for newborns and children while developing the next generation of compassionate, knowledgeable, and research-oriented physicians.
            </p>
            <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 24 }}>{c.note}</p>
            <div className="hero-actions">
              <Link href="/clinical-services" className="btn btn-primary">Request Clinical Guidance</Link>
              <Link href="/research" className="btn btn-outline">View Research &amp; Publications</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ margin: "20px auto 40px" }}>
        <StatStrip />
      </div>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The journey</div>
              <h2>From Medical School in India to US Clinical Leadership</h2>
            </div>
            <p className="lede">
              A chronological journey spanning MBBS and MD in India, specialist training in the United Kingdom, and neonatology fellowship and hospital leadership in Chicago, USA.
            </p>
          </div>
          <JourneyTimeline items={c.journey} />
        </div>
      </section>

      <section className="section center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Academic Record</div>
          <h2 style={{ marginBottom: 12 }}>Citations by year</h2>
          <p className="lede mx-auto" style={{ marginBottom: 40 }}>
            Growth in clinical research impact over time, tracked on Google Scholar.
          </p>
          <CitationChart data={c.citationsByYear} />
          <ScholarCard profile={c.scholarProfile} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Comprehensive Academic CV</div>
              <h2>Appointments, Education, Certifications &amp; Research</h2>
            </div>
            <p className="lede">
              All 18 curriculum vitae sections are maintained in our CMS. Click any section to view detailed entries and supporting documents.
            </p>
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

      {/* Awards & Honors */}
      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Recognition</div>
              <h2>Awards &amp; Honors</h2>
            </div>
            <p className="lede">
              Milestones in clinical research grants, conference gold medals, and nationwide fellowship recognition.
            </p>
          </div>

          <div className="awards-parallel-grid">
            {/* Left Column: Photo & Recognition Gallery */}
            <div className="awards-photo-gallery">
              {((c.awardsGallery && c.awardsGallery.some(g => g.imageUrl || g.url)) ? c.awardsGallery : [
                { imageUrl: "/images/award-1.svg", caption: "NIH Site PI — PREMOD2 International Trial" },
                { imageUrl: "/images/award-2.svg", caption: "Gold Medal — AP PEDICON XXIII Annual Conference" },
                { imageUrl: "/images/award-3.svg", caption: "PAS Travel Grant — Pediatric Academic Societies" },
                { imageUrl: "/images/award-4.svg", caption: "Fellowship & In-Training Top Honors" },
              ]).map((img, idx) => (
                <div className="award-photo-card" key={idx}>
                  <img
                    src={img.imageUrl || img.url || `/images/award-${(idx % 4) + 1}.svg`}
                    alt={img.caption || `Award recognition photo ${idx + 1}`}
                    loading="lazy"
                  />
                  {img.caption && (
                    <div className="award-photo-caption">{img.caption}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Column: Animated Milestones Timeline */}
            <div className="awards-timeline-animated">
              {c.awards.map((a, idx) => (
                <div className="award-timeline-item" key={idx}>
                  <div className="award-timeline-node" />
                  <span className="award-timeline-year">{a.year}</span>
                  <h3 className="award-timeline-title">{a.title}</h3>
                  {(a.org || a.body || a.description) && (
                    <p className="award-timeline-desc">
                      {a.description || a.body || a.org}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Counts Strip */}
      <section className="section navy">
        <div className="container">
          <div className="grid grid-3" style={{ textAlign: "center", gap: 32 }}>
            {COUNT_LABELS.map(([k, label]) => (
              <div key={k}>
                <div style={{ fontSize: "2.8rem", fontWeight: "bold", color: "#E9C989", fontFamily: "var(--font-mono)" }}>
                  {c.counts[k] || 0}+
                </div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, textTransform: "uppercase", letterSpacing: 1 }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
