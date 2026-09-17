"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

export default function EducationTrainingPage() {
  const { content } = useSiteData();
  const c = content.educationTraining;

  const academicBadges = {
    "/education-training/live-learning": "Weekly Grand Rounds",
    "/education-training/question-banks": "High-Yield USMLE & Shelf",
    "/education-training/tele-rotations": "6-Week USCE Preceptorship",
    "/education-training/physical-rotations": "Hospital Clinical Elective",
  };

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
            {c.subpages.map((sub) => {
              const badge = academicBadges[sub.href] || "Faculty Moderated";

              return (
                <Link href={sub.href} key={sub.href} className="card" style={{ display: "block", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <h3 style={{ margin: 0 }}>{sub.label}</h3>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        padding: "3px 9px",
                        borderRadius: "999px",
                        backgroundColor: "#FDF2E9",
                        color: "#B4832A",
                        border: "1px solid rgba(180,131,42,0.3)",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {badge}
                    </span>
                  </div>
                  <p>{sub.blurb}</p>
                  <span style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                    Explore {sub.label} &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Candidate Access</div>
          <h2 style={{ marginBottom: 16 }}>Apply &amp; Access Through Your Student Portal</h2>
          <p style={{ maxWidth: 600, margin: "0 auto 24px", color: "var(--ink-soft)", fontSize: "15px" }}>
            All clinical rotations, live seminar admissions, and question bank modules are evaluated directly by Dr. Janardhan Mydam. Sign in or register to submit your credentials.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/student-login" className="btn btn-primary">Student Portal Login</Link>
            <Link href="/consultation" className="btn btn-outline">Book Faculty Consultation</Link>
          </div>
        </div>
      </section>
    </>
  );
}
