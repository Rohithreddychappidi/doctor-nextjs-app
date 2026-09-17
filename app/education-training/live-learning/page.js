"use client";

import Link from "next/link";
import MeetingCard from "@/components/MeetingCard";
import { useSiteData } from "@/lib/DataContext";
import SectionDisclaimer from "@/components/SectionDisclaimer";

export default function LiveLearningPage() {
  const { meetings, content } = useSiteData();
  const c = content.liveLearning;
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">{c.eyebrow}</div>
          <h1 style={{ maxWidth: 720 }}>{c.heading}</h1>
          <p className="lede" style={{ marginTop: 16 }}>{c.body}</p>
          <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/student/live-learning" className="btn btn-primary">
              Access Live Lectures in Student Portal &rarr;
            </Link>
            <Link href="/consultation" className="btn btn-gold">
              Schedule Faculty Consultation
            </Link>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <SectionDisclaimer sectionKey="live_classes" />

          {meetings.length === 0 ? (
            <p>No sessions are scheduled right now — check back soon.</p>
          ) : (
            <div className="grid grid-3">
              {meetings.map((m) => (
                <MeetingCard key={m.id} meeting={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Looking for structured rotations instead?</div>
          <h2 style={{ marginBottom: 16 }}>See Tele-Rotations or Physical Rotations</h2>
          <p style={{ maxWidth: 600, margin: "0 auto 24px", color: "var(--ink-soft)", fontSize: "15px" }}>
            US clinical experience programs are structured over 6 weeks with direct attending evaluations and letters of recommendation.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/education-training/tele-rotations" className="btn btn-outline">Tele-Rotations</Link>
            <Link href="/education-training/physical-rotations" className="btn btn-outline">Physical Rotations</Link>
            <Link href="/student/rotations" className="btn btn-primary">Student Rotation Hub</Link>
          </div>
        </div>
      </section>
    </>
  );
}
