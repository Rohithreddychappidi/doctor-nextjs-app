"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";
import SectionDisclaimer from "@/components/SectionDisclaimer";

export default function TeleRotationsPage() {
  const { content } = useSiteData();
  const C = content.teleRotations;

  const [livePricing, setLivePricing] = useState({
    pricing_type: "Paid",
    price: "$1,200",
    pricing_note: "per 6-week cohort"
  });

  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch("/api/programs");
        if (res.ok) {
          const json = await res.json();
          const tele = (json.programs || []).find(p => p.key === "tele_rotation");
          if (tele) {
            setLivePricing({
              pricing_type: tele.pricing_type || (tele.price === "Free" ? "Free" : "Paid"),
              price: tele.price || "$1,200",
              pricing_note: tele.pricing_note || "per 6-week cohort"
            });
          }
        }
      } catch (e) {
        console.error("Pricing fetch error:", e);
      }
    }
    fetchPricing();
  }, []);

  const isFree = livePricing.pricing_type === "Free" || livePricing.price === "Free";

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-grid">
          <div>
            <div className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span>{C.eyebrow}</span>
              <span
                style={{
                  backgroundColor: isFree ? "#2E7D3A" : "#B4832A",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  letterSpacing: "0.5px"
                }}
              >
                {isFree ? "Free Program" : `Tuition: ${livePricing.price}`}
              </span>
            </div>
            <h1>{C.heading}</h1>
            <p className="lede">{C.body}</p>
            <div className="hero-actions">
              <Link href="/education-training/tele-rotations/apply" className="btn btn-primary">
                Apply for Tele-Rotation {isFree ? "(Free)" : `(${livePricing.price})`}
              </Link>
              <Link href="/student-dashboard" className="btn btn-gold">Student Portal &rarr;</Link>
              <Link href="/education-training/physical-rotations" className="btn btn-outline">Physical Rotations</Link>
            </div>
          </div>
          <div className="hero-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span className="tag">Program Overview</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: isFree ? "#4ADE80" : "#E9C989" }}>
                {isFree ? "Free Enrollment" : `${livePricing.price}`}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Tuition &amp; Fees</span>
              <span style={{ fontWeight: 700, color: isFree ? "#4ADE80" : "#FFFFFF" }}>
                {isFree ? "Free (No Fee)" : `${livePricing.price} (${livePricing.pricing_note})`}
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
            <p className="lede">Each module unlocks its live session link automatically as
              the date approaches — no manual scheduling on your end.</p>
          </div>
          <div className="grid grid-2">
            {C.schedule.map((w, idx) => (
              <div className="card" key={w.week}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div className="pill accent">{w.week}</div>
                  {w.sessionDate && <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{w.sessionDate}</span>}
                </div>
                <h3 style={{ marginBottom: 8 }}>{w.focus}</h3>
                <p style={{ marginBottom: 14 }}><strong style={{ color: "var(--ink)" }}>Products: </strong>{w.products}</p>
                {w.joinLink ? (
                  <a href={w.joinLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">Join Live Session</a>
                ) : (
                  <span className="pill muted">Session link auto-generates closer to the date</span>
                )}
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
          <Link href="/education-training/tele-rotations/apply" className="btn btn-primary">Apply Now</Link>
        </div>
      </section>
    </>
  );
}
