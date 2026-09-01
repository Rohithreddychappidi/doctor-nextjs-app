"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

export default function PhysicalRotationsPage() {
  const { content } = useSiteData();
  const c = content.physicalRotations;
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
          <div className="grid grid-3" style={{ marginBottom: 40 }}>
            {c.tracks.map((t) => (
              <div className="card" key={t.heading}>
                <div className="pill accent">{t.pill}</div>
                <h3 style={{ marginTop: 16 }}>{t.heading}</h3>
                <p>{t.body}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-2">
            <div>
              <h3 style={{ marginBottom: 16 }}>What to expect</h3>
              <div className="steps">
                {c.whatToExpect.map((w) => (
                  <div className="step" key={w.heading}><h4>{w.heading}</h4><p>{w.body}</p></div>
                ))}
              </div>
            </div>
            <div className="card dark">
              <div className="icon">Ph</div>
              <h3>{c.eligibilityHeading}</h3>
              <p style={{ marginBottom: 14 }}>{c.eligibilityBody}</p>
              <Link href="/contact" className="btn btn-ghost-light btn-sm">Apply via Contact</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Not near a placement site?</div>
          <h2 style={{ marginBottom: 16 }}>See the Tele-Rotations program instead</h2>
          <Link href="/education-training/tele-rotations" className="btn btn-outline">View Tele-Rotations</Link>
        </div>
      </section>
    </>
  );
}
