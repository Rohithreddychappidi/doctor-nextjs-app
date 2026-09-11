"use client";

import Link from "next/link";
import Image from "next/image";
import HomeBanner from "@/components/HomeBanner";
import StatStrip from "@/components/StatStrip";
import MeetingCard from "@/components/MeetingCard";
import TestimonialCard from "@/components/TestimonialCard";
import { useSiteData } from "@/lib/DataContext";

const CARD_META = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    color: "#0F766E",
    bg: "#F0FDFA",
    href: "/about",
    cta: "Read full credentials",
    dark: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    color: "#4338CA",
    bg: "#EEF2FF",
    href: "/education-training",
    cta: "Explore programs",
    dark: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    color: "#E0E7FF",
    bg: "rgba(255,255,255,0.15)",
    href: "/question-banks",
    cta: "Take Free Mock Test",
    dark: true,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h8" />
        <path d="M3 22h18" />
        <path d="M14 22a7 7 0 1 0-4-12.7V5a2 2 0 1 0-4 0v4.3A7 7 0 0 0 10 22" />
      </svg>
    ),
    color: "#0284C7",
    bg: "#F0F9FF",
    href: "/research",
    cta: "View research",
    dark: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    color: "#E11D48",
    bg: "#FFF1F2",
    href: "/clinical-services",
    cta: "Request guidance",
    dark: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
        <path d="M12 9v8" />
      </svg>
    ),
    color: "#D97706",
    bg: "#FFFBEB",
    href: "/advisory-services",
    cta: "Program development",
    dark: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    color: "#059669",
    bg: "#ECFDF5",
    href: "/community-impact",
    cta: "Community resources",
    dark: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "#7C3AED",
    bg: "#F5F3FF",
    href: "/contact",
    cta: "Contact Faculty",
    dark: false,
  },
];

export default function HomePage() {
  const { content, meetings, testimonials } = useSiteData();
  const c = content.home;

  const coreCards = [
    { heading: "Doctor Portfolio & Credentials", body: "Comprehensive clinical trajectory, academic appointments, NIH trial site leadership, and university faculty credentials." },
    { heading: "Education & Learning Hub", body: "Structured 6-week virtual tele-rotations, weekly Microsoft Teams classes, OSCE preparation, and EMR workflow orientation." },
    { heading: "Question Banks & Mock Tests", body: "Comprehensive clinical reasoning mock exams in Neonatology, Pediatrics, and Critical Care with verified answer rationales." },
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
              <div className="eyebrow">jvmmedicalservices · Service Pathways</div>
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
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: meta.bg || "#F1F5F9",
                        color: meta.color || "#1E293B",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      {meta.icon}
                    </div>
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
