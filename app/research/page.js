"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";
import StatStrip from "@/components/StatStrip";

const ONGOING = [
  { status: "Recruiting students", title: "Neonatal Outcomes in Low-Resource NICUs", body: "Evaluating outcomes for premature infants across resource-limited neonatal units, with a focus on protocol adherence." },
  { status: "In analysis", title: "Pediatric Follow-Up Care Effectiveness", body: "Assessing structured follow-up protocols for pediatric patients after discharge, and their effect on readmission rates." },
  { status: "Design phase", title: "Tele-Mentorship Learning Outcomes", body: "Comparing clinical reasoning growth between tele-rotation and in-person rotation students, in neonatology and pediatrics." },
];

const PUBLICATIONS = [
  { title: "Placeholder: Neonatal resuscitation protocol adherence", focus: "Neonatology", year: "2025", status: "done" },
  { title: "Placeholder: Case-based learning in pediatric education", focus: "Medical Education", year: "2024", status: "done" },
  { title: "Placeholder: Remote mentorship outcomes in NICU training", focus: "Tele-education", year: "2024", status: "done" },
  { title: "Placeholder: Growth monitoring in early childhood clinics", focus: "Pediatrics", year: "2026", status: "progress" },
  { title: "Placeholder: Tele-rotation learning outcomes study", focus: "Tele-education", year: "2026", status: "new" },
];

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
            {ONGOING.map((o) => (
              <div className="card" key={o.title}>
                <div className="pill accent">{o.status}</div>
                <h3 style={{ marginTop: 16 }}>{o.title}</h3>
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
                  {PUBLICATIONS.map((p) => (
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
