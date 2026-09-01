"use client";

import Link from "next/link";
import StatStrip from "@/components/StatStrip";
import { useSiteData } from "@/lib/DataContext";

const statusLabel = { done: "Published", progress: "Under review", new: "In progress" };

export default function ResearchPage() {
  const { content } = useSiteData();
  const c = content.research;
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">{c.eyebrow}</div>
          <h1 style={{ maxWidth: 720 }}>{c.heading}</h1>
          <p className="lede" style={{ marginTop: 16 }}>{c.body}</p>
        </div>
      </section>

      <section className="section soft tight">
        <div className="container"><StatStrip /></div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Ongoing studies</div><h2>Currently active research</h2></div>
          </div>
          <div className="grid grid-3">
            {c.ongoing.map((o) => (
              <div className="card" key={o.heading}>
                <div className="pill accent">{o.status}</div>
                <h3 style={{ marginTop: 16 }}>{o.heading}</h3>
                <p>{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Publications</div><h2>Selected work</h2></div>
          </div>
          <div className="panel" style={{ padding: 0 }}>
            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>Title</th><th>Focus</th><th>Year</th><th>Status</th></tr></thead>
                <tbody>
                  {c.publications.map((p) => (
                    <tr key={p.title}>
                      <td className="strong">{p.title}</td>
                      <td>{p.focus}</td>
                      <td>{p.year}</td>
                      <td><span className={`status ${p.status}`}>{statusLabel[p.status]}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Get involved</div>
            <h2 style={{ marginBottom: 18 }}>Join a study as a student researcher</h2>
            <p className="lede" style={{ marginBottom: 26 }}>
              Students on rotation or in the mentorship track can request a seat on an
              active study — always in neonatology or pediatrics.
            </p>
            <Link href="/clinical-services" className="btn btn-primary">Request a Free Consultation</Link>
          </div>
          <div className="card dark">
            <div className="icon">Rs</div>
            <h3>Scope, kept narrow on purpose</h3>
            <p>Focusing only on neonatology and pediatrics means deeper mentorship and
              more relevant research opportunities — not a broad, generic catalog.</p>
          </div>
        </div>
      </section>
    </>
  );
}
