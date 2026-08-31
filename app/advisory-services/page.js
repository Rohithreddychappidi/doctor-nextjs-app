"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";
import { ADVISORY_SERVICES_SUBPAGES } from "@/lib/defaultData";

export default function AdvisoryServicesPage() {
  const { content } = useSiteData();
  const c = content.advisoryServices;
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
          <div className="grid grid-2">
            {ADVISORY_SERVICES_SUBPAGES.map((sub) => (
              <Link href={sub.href} key={sub.key} className="card" style={{ display: "block" }}>
                <h3 style={{ marginBottom: 10 }}>{sub.label}</h3>
                <p>{sub.blurb}</p>
                <span style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                  Learn more &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Representing an institution?</div>
          <h2 style={{ marginBottom: 16 }}>Reach out to discuss your specific needs</h2>
          <Link href="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
