"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

export default function CurriculumDevelopmentPage() {
  const { content } = useSiteData();
  const c = content.curriculumDevelopment;
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
            {c.services.map((s) => (
              <div className="card" key={s.heading}><h3 style={{ marginBottom: 8 }}>{s.heading}</h3><p>{s.body}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Building a program at your institution?</div>
          <h2 style={{ marginBottom: 16 }}>Reach out via Contact and select Advisory Services</h2>
          <Link href="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
