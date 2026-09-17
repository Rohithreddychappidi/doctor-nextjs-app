"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";
import SectionDisclaimer from "@/components/SectionDisclaimer";

export default function TeleRotationsPage() {
  const { content } = useSiteData();
  const C = content.teleRotations;

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-grid">
          <div>
            <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>{C.eyebrow}</span>
              <span
                style={{
                  backgroundColor: "#B4832A",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  letterSpacing: "0.5px"
                }}
              >
                Attending Preceptorship · USCE Accredited
              </span>
            </div>
            <h1>{C.heading}</h1>
            <p className="lede">{C.body}</p>
            <div className="hero-actions">
              <Link href="/student/rotations" className="btn btn-primary">
                Apply in Student Portal &rarr;
              </Link>
              <Link href="/consultation" className="btn btn-gold">
                Book Consultation Call
              </Link>
              <Link href="/education-training/physical-rotations" className="btn btn-outline">Physical Rotations</Link>
            </div>
          </div>
          <div className="hero-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span className="tag">Program Overview</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#E9C989" }}>
                Dr. Janardhan Mydam Preceptor
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Tuition &amp; Fees</span>
              <span style={{ fontWeight: 700, color: "#FFFFFF", textAlign: "right" }}>
                Evaluated upon Intake Review
              </span>
            </div>
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
          <SectionDisclaimer sectionKey="tele_rotations" />

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
            <div>
              <div className="eyebrow">Learning Hub</div>
              <h2>Your 6-week program, module by module</h2>
            </div>
            <p className="lede">Each module unlocks its live session link automatically inside your verified student portal as the cohort date approaches.</p>
          </div>
          <div className="grid grid-2">
            {C.schedule.map((w) => (
              <div className="card" key={w.week}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div className="pill accent">{w.week}</div>
                  {w.sessionDate && <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{w.sessionDate}</span>}
                </div>
                <h3 style={{ marginBottom: 8 }}>{w.focus}</h3>
                <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--ink)" }}>Products: </strong>{w.products}</p>
                <Link href="/student/rotations" className="btn btn-primary btn-sm">
                  Access in Student Portal &rarr;
                </Link>
              </div>
            ))}
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
          <h2 style={{ marginBottom: 16 }}>Check eligibility and apply for the next cohort</h2>
          <p style={{ maxWidth: 580, margin: "0 auto 20px", color: "var(--ink-soft)", fontSize: "15px" }}>
            Submit your medical school credentials and CV for attending faculty review in the Student Portal.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/student/rotations" className="btn btn-primary">Apply in Student Portal</Link>
            <Link href="/consultation" className="btn btn-outline">Schedule Faculty Call</Link>
          </div>
        </div>
      </section>
    </>
  );
}
