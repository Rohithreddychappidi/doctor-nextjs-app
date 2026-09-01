"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

export default function TeleRotationsPage() {
  const { content } = useSiteData();
  const C = content.teleRotations;

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">{C.eyebrow}</div>
            <h1>{C.heading}</h1>
            <p className="lede">{C.body}</p>
            <div className="hero-actions">
              <Link href="/contact" className="btn btn-primary">Apply via Contact</Link>
              <Link href="/education-training/physical-rotations" className="btn btn-outline">See Physical Rotations</Link>
            </div>
          </div>
          <div className="hero-card">
            <span className="tag">Program Overview</span>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Duration</span><span style={{ fontWeight: 600 }}>{C.overview.duration}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Time commitment</span><span style={{ fontWeight: 600 }}>{C.overview.timeCommitment}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Platform</span><span style={{ fontWeight: 600 }}>{C.overview.platform}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 14 }}>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Cohort size</span><span style={{ fontWeight: 600 }}>{C.overview.cohortSize}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft tight">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Purpose</div><h2>What this rotation is built to do</h2></div>
          </div>
          <div className="grid grid-2">
            {C.purpose.map((p) => (
              <div className="card" key={p}><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Learning outcomes</div><h2>By the end of the rotation, learners can</h2></div>
          </div>
          <div className="steps">
            {C.outcomes.map((o) => (
              <div className="step" key={o}><p>{o}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Six-week schedule</div><h2>Week by week</h2></div>
          </div>
          <div className="panel" style={{ padding: 0 }}>
            <div className="table-scroll">
              <table className="data-table">
                <thead><tr><th>Week</th><th>Clinical Focus</th><th>Skills / Products</th></tr></thead>
                <tbody>
                  {C.schedule.map((w) => (
                    <tr key={w.week}>
                      <td className="strong">{w.week}</td>
                      <td>{w.focus}</td>
                      <td>{w.products}</td>
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
            <div className="eyebrow">Assessment</div>
            <h2 style={{ marginBottom: 18 }}>How completion is measured</h2>
            <div className="panel" style={{ padding: 0, marginBottom: 24 }}>
              <div className="table-scroll">
                <table className="data-table">
                  <thead><tr><th>Component</th><th>Weight</th></tr></thead>
                  <tbody>
                    {C.assessment.map((a) => (
                      <tr key={a.component}>
                        <td className="strong">{a.component}</td>
                        <td>{a.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <h3 style={{ marginBottom: 12, fontSize: "1.05rem" }}>Completion standard</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {C.completionStandard.map((s) => (
                <li key={s} style={{ fontSize: 14, color: "var(--ink-soft)", paddingLeft: 18, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "var(--accent)" }}>&bull;</span>{s}
                </li>
              ))}
            </ul>
          </div>
          <div className="card dark">
            <div className="icon">!</div>
            <h3>Safety, privacy &amp; scope</h3>
            <ul style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 12 }}>
              {C.safety.map((s) => (
                <li key={s} style={{ fontSize: 13.5, color: "rgba(255,255,255,0.72)" }}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Ready to apply?</div>
          <h2 style={{ marginBottom: 16 }}>Contact us to check eligibility and apply</h2>
          <Link href="/contact" className="btn btn-primary">Go to Contact</Link>
        </div>
      </section>
    </>
  );
}
