"use client";

import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import StatStrip from "@/components/StatStrip";
import { Accordion, AccordionItem } from "@/components/Accordion";
import { useSiteData } from "@/lib/DataContext";

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

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">The record</div>
              <h2>Employment, education, leadership &amp; more</h2>
            </div>
            <p className="lede">Click any section to expand it — this page is designed to
              hold a lot of detail without overwhelming the page at first glance.</p>
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
            </Accordion>
          ))}

          <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 18 }}>
            All entries above are placeholder content, structured to hold the full record
            once the client shares complete employment, education, research and publication history.
          </p>
        </div>
      </section>

      <section className="section navy center">
        <div className="container">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>Talk to Dr. Doctor Name directly</div>
          <h2 style={{ marginBottom: 24 }}>Every consultation is a free phone call — no cost, ever</h2>
          <Link href="/clinical-services" className="btn btn-primary">Request a Free Consultation</Link>
        </div>
      </section>
    </>
  );
}
