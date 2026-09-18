"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { useSiteData } from "@/lib/DataContext";
import SectionDisclaimer from "@/components/SectionDisclaimer";

export default function QuestionBanksPage() {
  const { content } = useSiteData();
  const c = content.questionBanks;
  const [pillars, setPillars] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQBankPublicData() {
      try {
        const [specRes, modRes] = await Promise.all([
          fetch("/api/qbank/specializations"),
          fetch("/api/qbank/modules"),
        ]);
        if (specRes.ok) {
          const sJson = await specRes.json();
          setPillars(sJson.specializations || []);
        }
        if (modRes.ok) {
          const mJson = await modRes.json();
          setModules(mJson.modules || []);
        }
      } catch (err) {
        console.error("Failed to load QBank data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQBankPublicData();
  }, []);

  const totalQuestions = modules.reduce((sum, m) => sum + Number(m.question_count || 0), 0);

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">{c.eyebrow}</div>
            <h1>{c.heading}</h1>
            <p className="lede">{c.body}</p>
            <div className="hero-actions">
              <Link href="/student-login" className="btn btn-primary">Log in to Practice Portal</Link>
              <Link href="/student/qbank" className="btn btn-outline">Explore Question Hub &rarr;</Link>
            </div>
          </div>
          <div className="hero-card">
            <span className="tag">Board Bank Snapshot</span>
            {[
              ["Published Modules", `${modules.length} active`],
              ["Subject Pillars", "3 Core Disciplines"],
              ["Examination Focus", "USMLE Step 2 CK & Pediatric Shelf"],
              ["Attending Author", "Dr. Janardhan Mydam, MD, FAAP"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <SectionDisclaimer sectionKey="question_bank" />

          <div className="section-head">
            <div>
              <div className="eyebrow">Curated Examination Pillars</div>
              <h2>3 Core Subject Disciplines</h2>
              <p style={{ color: "var(--ink-soft)", fontSize: "15px", maxWidth: 680 }}>
                Every clinical vignette is crafted around authentic US hospital inpatient encounters, bedside neonatal scenarios, and board-tested diagnostic traps.
              </p>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-soft)" }}>
              Loading question bank pillars...
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {pillars.map((pillar, idx) => {
                const pillarModules = modules.filter((m) => m.specialization_id === pillar.id);
                return (
                  <Accordion
                    key={pillar.id}
                    index={idx + 1}
                    label={`${pillar.icon || "📚"} ${pillar.name}`}
                    count={`${pillarModules.length} module${pillarModules.length === 1 ? "" : "s"}`}
                    defaultOpen={idx === 0}
                  >
                    <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 14, lineHeight: 1.6 }}>
                      {pillar.description}
                    </p>

                    {pillarModules.length === 0 ? (
                      <div style={{ padding: "12px 16px", backgroundColor: "#F8FAFC", borderRadius: 8, fontSize: "13px", color: "#64748B" }}>
                        New clinical vignette sets for {pillar.name} are currently being authored and peer-reviewed by Dr. Mydam. Check back soon.
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                        {pillarModules.map((mod) => (
                          <div
                            key={mod.id}
                            style={{
                              padding: 14,
                              borderRadius: 8,
                              border: "1px solid #E2E8F0",
                              backgroundColor: "#FFFFFF",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>
                                {mod.name}
                              </span>
                              <span className="pill muted" style={{ fontSize: "10px" }}>
                                {mod.question_count || 0} Questions
                              </span>
                            </div>
                            <p style={{ fontSize: "12.5px", color: "#64748B", margin: "0 0 10px", lineHeight: 1.4 }}>
                              {mod.description || "High-yield clinical decision questions and distractor rationales."}
                            </p>
                            <Link
                              href="/student/qbank"
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "var(--bg-navy)",
                                textDecoration: "underline",
                              }}
                            >
                              Practice this module in Student Portal &rarr;
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </Accordion>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section navy center">
        <div className="container">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>Clinical Preceptor AI Tutor Mode</div>
          <h2 style={{ marginBottom: 16 }}>Personalized Attending Preceptor Explanations</h2>
          <p className="lede mx-auto" style={{ maxWidth: 680 }}>
            Practice timed exam simulation blocks or switch to interactive Tutor Mode. Dispute distractor choices, ask follow-up questions, and receive clinical reasoning feedback modeled directly on Dr. Janardhan Mydam&apos;s morning rounds pedagogy.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link href="/student/qbank" className="btn btn-gold">
              Launch Student Question Bank
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
