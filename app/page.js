"use client";

import Link from "next/link";
import Image from "next/image";
import HomeBanner from "@/components/HomeBanner";
import StatStrip from "@/components/StatStrip";
import MeetingCard from "@/components/MeetingCard";
import TestimonialCard from "@/components/TestimonialCard";
import { useSiteData } from "@/lib/DataContext";

const CARD_META = [
  { icon: "Ab", href: "/about", cta: "Read full credentials", dark: false },
  { icon: "Et", href: "/education-training", cta: "Explore programs", dark: false },
  { icon: "Qb", href: "/question-banks", cta: "Take Free Mock Test", dark: true },
  { icon: "Rs", href: "/research", cta: "View research", dark: false },
  { icon: "Cg", href: "/clinical-services", cta: "Request guidance", dark: false },
  { icon: "Nb", href: "/advisory-services", cta: "Program development", dark: false },
  { icon: "Ch", href: "/community-impact", cta: "Community resources", dark: false },
  { icon: "Ct", href: "/contact", cta: "Contact Dr. Mydam", dark: false },
];

export default function HomePage() {
  const { content, meetings, testimonials } = useSiteData();
  const c = content.home;

  const coreCards = [
    { heading: "About Dr. Mydam", body: "Board-certified neonatologist & pediatrician with over a decade of clinical leadership, NIH trial site leadership, and university faculty teaching." },
    { heading: "Education & Learning Hub", body: "Structured 6-week virtual tele-rotations, weekly Microsoft Teams classes, OSCE preparation, and EMR workflow orientation." },
    { heading: "Question Banks & Mock Tests", body: "Comprehensive clinical reasoning mock exams in Neonatology, Pediatrics, and Biostatistics with in-depth answer rationales. 100% Free." },
    { heading: "Research & Mentorship", body: "Mentoring learners from research question to presentation and publication in neonatal outcomes, health disparities, and biostatistics." },
    { heading: "Clinical Guidance for Families", body: "Educational consultations for parents navigating newborn concerns, prematurity, NICU discharge, and children with special needs." },
    { heading: "Newborn Care Program Development", body: "Helping hospitals, health systems, and Indian states plan, establish, or improve neonatal units and mother-baby services." },
    { heading: "Community Health Navigation", body: "Culturally sensitive guidance for Indian-origin individuals and families navigating the United States healthcare system." },
    { heading: "Contact & Inquiries", body: "Purpose-specific inquiries for lectures, tele-rotations, institutional partnerships, and clinical guidance requests." },
  ];

  return (
    <>
      {/* Top Hero Banner Carousel */}
      <section className="hero" style={{ paddingTop: 30, paddingBottom: 0 }}>
        <div className="container">
          <HomeBanner />
        </div>
      </section>

      {/* Impact Stats */}
      <div className="container" style={{ marginTop: 36 }}>
        <StatStrip />
      </div>

      {/* Mission & Master Draft Overview */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Mission &amp; Service Pathways</div>
              <h2>Knowledge, Guidance, and Service for Better Newborn and Child Health</h2>
            </div>
            <p className="lede">
              Serving learners, physicians, and families across the United States, India, and worldwide through medical education, clinical mentorship, and evidence-based guidance.
            </p>
          </div>

          <div className="grid grid-4" style={{ gap: 20 }}>
            {coreCards.map((card, idx) => {
              const meta = CARD_META[idx] || {};
              return (
                <div className={`card${meta.dark ? " dark" : ""}`} key={card.heading} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div className="icon">{meta.icon}</div>
                    <h3 style={{ fontSize: 17, marginBottom: 8 }}>{card.heading}</h3>
                    <p style={{ fontSize: 13.5, color: meta.dark ? "rgba(255,255,255,0.8)" : "var(--ink-soft)", marginBottom: 16 }}>
                      {card.body}
                    </p>
                  </div>
                  <Link
                    href={meta.href || "/"}
                    className={meta.dark ? "btn btn-ghost-light btn-sm" : "btn btn-outline btn-sm"}
                    style={{ alignSelf: "flex-start", marginTop: 10 }}
                  >
                    {meta.cta} &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Clinical Teaching Session */}
      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Featured Teaching Example</div>
              <h2>Clinical Approach to Rashes in Newborns and Children</h2>
            </div>
            <p className="lede">
              Interactive clinical session conducted for approximately 70 Windsor University medical students, integrating visual recognition, differential diagnosis, and examination-focused learning.
            </p>
          </div>

          <div className="grid grid-2" style={{ alignItems: "center", gap: 36 }}>
            <div>
              <img
                src="/images/pediatric-rash.svg"
                alt="Clinical approach to neonatal and pediatric rashes teaching preview"
                style={{ borderRadius: 10, width: "100%", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
              />
            </div>
            <div>
              <h3 style={{ marginBottom: 14, color: "var(--bg-navy)", fontSize: "1.5rem" }}>
                Visual Diagnosis &amp; Clinical Reasoning
              </h3>
              <p style={{ marginBottom: 16, fontSize: 15, lineHeight: 1.6 }}>
                Preterm and newborn rashes range from benign self-limiting conditions to life-threatening dermatologic emergencies. This high-yield module teaches trainees systematic evaluation:
              </p>
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, fontSize: 14 }}>
                <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span className="pill accent">&#10003;</span>
                  <span><strong>Erythema Toxicum Neonatorum:</strong> Eosinophil-rich macules and papules sparing palms and soles.</span>
                </li>
                <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span className="pill accent">&#10003;</span>
                  <span><strong>Neonatal Herpes Simplex Virus:</strong> Grouped vesicles on an erythematous base requiring emergency empiric IV acyclovir.</span>
                </li>
                <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span className="pill accent">&#10003;</span>
                  <span><strong>Transient Neonatal Pustular Melanosis:</strong> Vesiculopustules rupturing into hyperpigmented macules with collarette of scale.</span>
                </li>
              </ul>
              <div style={{ display: "flex", gap: 12 }}>
                <Link href="/question-banks" className="btn btn-primary btn-sm">Practice Board Questions</Link>
                <Link href="/education-training/tele-rotations" className="btn btn-outline btn-sm">Join Learning Hub</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Mock Test Banner (Priority 2 Marketing) */}
      <section className="section">
        <div className="container">
          <div
            className="promo-band"
            style={{
              background: "linear-gradient(135deg, #12203B 0%, #1B2E52 60%, #8A2A34 100%)",
              color: "#FFFFFF",
              borderRadius: 12,
              padding: "36px 40px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 24,
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <span
                style={{
                  backgroundColor: "rgba(180, 131, 42, 0.3)",
                  color: "#E9C989",
                  padding: "4px 12px",
                  borderRadius: 16,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  display: "inline-block",
                  marginBottom: 10,
                }}
              >
                100% Free Mock Testing Period
              </span>
              <h3 style={{ color: "#FFFFFF", fontSize: "1.8rem", margin: "4px 0 8px" }}>
                Master Clinical Reasoning with Comprehensive Rationales
              </h3>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14.5, margin: 0 }}>
                Access our high-yield question bank for USMLE, Shelf exams, and Board prep. Every answer includes detailed explanations for both correct and distractor choices.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/question-banks" className="btn btn-gold" style={{ fontWeight: 700 }}>
                Start Free Exam Now &rarr;
              </Link>
              <Link href="/student-signup" className="btn btn-ghost-light">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Learning & Meetings */}
      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{c.liveLearningEyebrow || "Live Learning"}</div>
              <h2>{c.liveLearningHeading || "Weekly Interactive Sessions"}</h2>
            </div>
            <Link href="/education-training/live-learning" className="btn btn-outline">View all sessions</Link>
          </div>
          {meetings.length === 0 ? (
            <p>No sessions are scheduled right now — check back soon.</p>
          ) : (
            <div className="grid grid-3">
              {meetings.slice(0, 3).map((m) => (
                <MeetingCard key={m.id} meeting={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Closing Callout per Master Draft */}
      <section className="section navy center">
        <div className="container">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>Professional Commitment</div>
          <h2 style={{ marginBottom: 16, fontSize: "clamp(1.8rem, 3vw, 2.5rem)" }}>
            Learn. Think Clinically. Conduct Meaningful Research. Improve Care.
          </h2>
          <p className="lede mx-auto" style={{ marginBottom: 30, color: "rgba(255,255,255,0.8)" }}>
            Whether you are a medical student preparing for an OSCE, a physician seeking focused neonatal education, a researcher beginning a new project, or a hospital building newborn services, this platform is designed to help you take the next informed step.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/education-training" className="btn btn-primary">Explore Education &amp; Training</Link>
            <Link href="/clinical-services" className="btn btn-ghost-light">Request Clinical Guidance</Link>
          </div>
        </div>
      </section>
    </>
  );
}
