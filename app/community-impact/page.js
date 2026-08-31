"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

export default function CommunityImpactPage() {
  const { content } = useSiteData();
  const c = content.communityImpact;
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">{c.eyebrow}</div>
          <h1 style={{ maxWidth: 720 }}>{c.heading}</h1>
          <p className="lede" style={{ marginTop: 16 }}>{c.body}</p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid grid-3">
            <div className="card">
              <div className="icon">In</div>
              <h3>India Initiatives</h3>
              <p>Community health outreach and mentorship programs based in India — placeholder detail, to be filled in with real program information.</p>
            </div>
            <div className="card">
              <div className="icon">Gl</div>
              <h3>Global Reach</h3>
              <p>Extending free consultations and mentorship to students and families beyond India — placeholder detail, to be filled in.</p>
            </div>
            <div className="card">
              <div className="icon">Vo</div>
              <h3>Volunteer With Us</h3>
              <p>Opportunities for students and professionals to volunteer time toward outreach and mentorship efforts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="icon">&#10084;</div>
            <h3 style={{ marginBottom: 10 }}>Support Our Work</h3>
            <p style={{ marginBottom: 16 }}>
              A formal donation option for website maintenance and program support is
              planned for this page, once the practice&apos;s legal donation process
              (nonprofit registration and payment compliance) is confirmed. Nothing is
              collected here yet.
            </p>
            <p style={{ fontSize: 12.5, color: "var(--muted)" }}>
              No consultation, rotation, or mentorship ever requires a donation — this is
              entirely optional and separate from clinical services.
            </p>
          </div>
        </div>
      </section>

      <section className="section navy center">
        <div className="container">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>Want to partner or volunteer?</div>
          <h2 style={{ marginBottom: 20 }}>Reach out and select Community Impact</h2>
          <Link href="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
