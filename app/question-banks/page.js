"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";

export default function QuestionBanksPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await fetch("/api/tests");
        if (res.ok) {
          const data = await res.json();
          setTests(data.tests || []);
        }
      } catch (e) {
        console.error("Fetch tests error:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Priority 2 · Testing Platform</div>
            <h1>Clinical Reasoning Question Banks &amp; Mock Tests</h1>
            <p className="lede">
              Board-style vignette questions in <strong>Neonatology, Pediatrics, and Biostatistics</strong>.
              Every question is accompanied by exhaustive explanations of why the correct answer is right — and why each distractor is wrong.
            </p>
            <div className="hero-actions">
              <Link href="#availableTests" className="btn btn-primary">Take Free Mock Test</Link>
              <Link href="/student-signup" className="btn btn-outline">Register for Free Access</Link>
            </div>
          </div>
          <div className="hero-card">
            <span className="tag">Platform Snapshot</span>
            {[
              ["Practice Model", "100% Free During Initial Launch"],
              ["Question Format", "Single-Best-Answer Vignettes"],
              ["Answer Rationales", "Complete Right & Wrong Explanations"],
              ["Testing Engine", "Timed Mode, Flagging, Instant Analytics"],
              ["Target Exams", "USMLE Step 2/3, Shelf, ABP Boards"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Mock Tests Section */}
      <section id="availableTests" className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Live Mock Examinations</div>
              <h2>Take a Free Board-Style Mock Exam Today</h2>
            </div>
            <p className="lede">
              Experience the quality of Dr. Janardhan Mydam&apos;s testing platform. Designed for medical students, IMGs, and residents preparing for clinical examinations.
            </p>
          </div>

          {loading ? (
            <p>Loading available examinations...</p>
          ) : tests.length === 0 ? (
            <p>No tests currently active. Please check back shortly.</p>
          ) : (
            <div className="grid grid-2" style={{ gap: 24 }}>
              {tests.map((t) => (
                <div key={t.id} className="card" style={{ borderTop: "4px solid var(--accent)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span className="pill accent">{t.is_free ? "FREE PRACTICE" : "PREMIUM"}</span>
                      <span style={{ fontSize: 13, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                        {t.duration_minutes} Mins · Pass {t.passing_score}%
                      </span>
                    </div>
                    <h3 style={{ marginBottom: 10, color: "var(--bg-navy)" }}>{t.title}</h3>
                    <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 18 }}>{t.description}</p>
                    <div style={{ backgroundColor: "#F7F4EE", padding: "10px 14px", borderRadius: 6, fontSize: 13, marginBottom: 18 }}>
                      <strong>Subject Focus:</strong> {t.subject} · {t.question_ids?.length || 5} Questions
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                    <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                      &#10003; Complete Rationales Included
                    </span>
                    <Link href={`/mock-tests/${t.id}`} className="btn btn-primary btn-sm">
                      Start Test &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4 Learning Levels & 3 Question Banks */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Curriculum Structure</div>
              <h2>Three Focused Question Banks. Four Learning Levels.</h2>
            </div>
            <p className="lede">
              Structured from foundational clerkship cases to advanced neonatal-perinatal fellowship board preparation.
            </p>
          </div>

          <div className="grid grid-3" style={{ gap: 24, marginBottom: 40 }}>
            <div className="card">
              <div className="icon">Ne</div>
              <h3>Neonatology</h3>
              <p>
                Delivery room transition, NRP algorithms, premature lung disease (RDS/BPD), neonatal hemodynamics, hyperbilirubinemia, and NICU infection control.
              </p>
            </div>
            <div className="card">
              <div className="icon">Pd</div>
              <h3>Pediatrics</h3>
              <p>
                Well-child developmental milestones, acute pediatric illnesses, Kawasaki disease, immunization schedules, pediatric nephrology, and hematology.
              </p>
            </div>
            <div className="card">
              <div className="icon">Bs</div>
              <h3>Biostatistics &amp; EBM</h3>
              <p>
                Study designs, Odds Ratio vs Relative Risk, NNT calculation, sensitivity &amp; specificity, diagnostic nomograms, and clinical trial critique.
              </p>
            </div>
          </div>

          <h3>Learning Levels</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {[
              { level: "Level 1", title: "Medical School & Shelf Examination", desc: "Core clinical concepts, classic presentations, first-line diagnostic evaluations, and essential pharmacology." },
              { level: "Level 2", title: "USMLE Step 2 CK / Step 3 Clinical Reasoning", desc: "Multi-step reasoning, next best step in management, distinguishing subtle differentials, and complication prevention." },
              { level: "Level 3", title: "Pediatrics Board Preparation (ABP)", desc: "In-depth pathophysiology, rare syndromes, guideline-driven algorithms, and subspecialty referral indications." },
              { level: "Level 4", title: "Neonatal-Perinatal Medicine Specialty Preparation", desc: "Advanced extreme-preterm physiology, nitric oxide/ventilator strategies, targeted neonatal echocardiography, and ethical dilemmas." },
            ].map((l) => (
              <div key={l.level} className="card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span className="pill accent">{l.level}</span>
                  <div>
                    <strong style={{ color: "var(--ink)", fontSize: 15 }}>{l.title}</strong>
                    <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "4px 0 0" }}>{l.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Callout */}
      <section className="section navy center">
        <div className="container">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>Free Promotional Period</div>
          <h2 style={{ marginBottom: 16 }}>Create Your Account &amp; Test Your Knowledge</h2>
          <p className="lede mx-auto" style={{ marginBottom: 28 }}>
            Join hundreds of medical students and physicians using Dr. Mydam&apos;s clinical testing portal. Full access is free while we expand our high-yield question library.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            <Link href="/student-signup" className="btn btn-gold">Create Free Account</Link>
            <Link href="#availableTests" className="btn btn-ghost-light">Take Sample Exam</Link>
          </div>
        </div>
      </section>
    </>
  );
}
