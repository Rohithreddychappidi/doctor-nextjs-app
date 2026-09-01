"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

const ICONS = ["In", "Gl", "Vo"];

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
            {c.initiatives.map((it, idx) => (
              <div className="card" key={it.heading}>
                <div className="icon">{ICONS[idx] || "Ci"}</div>
                <h3>{it.heading}</h3>
                <p>{it.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="icon">&#10084;</div>
            <h3 style={{ marginBottom: 10 }}>{c.supportHeading}</h3>
            <p style={{ marginBottom: 16 }}>{c.supportBody}</p>
            <p style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.supportNote}</p>
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
