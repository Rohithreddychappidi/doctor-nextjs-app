"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";
import SectionDisclaimer from "@/components/SectionDisclaimer";

export default function LiveLearningPage() {
  const { content } = useSiteData();
  const c = content.liveLearning;
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicClasses() {
      try {
        const res = await fetch("/api/classes?public=true");
        if (res.ok) {
          const data = await res.json();
          setClasses(data.classes || []);
        }
      } catch (err) {
        console.error("Failed to load live classes:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPublicClasses();
  }, []);

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

          <div style={{ marginBottom: 20 }}>
            <div className="eyebrow">Upcoming Schedule</div>
            <h2>Live Clinical Teaching &amp; Grand Rounds</h2>
            <p style={{ color: "var(--ink-soft)", fontSize: "14.5px" }}>
              Join Dr. Janardhan Mydam for interactive neonatal case conferences, delivery room resuscitation workshops, and board-style clinical decision simulations.
            </p>
          </div>

          {loading ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-soft)" }}>
              Loading upcoming clinical seminars...
            </div>
          ) : classes.length === 0 ? (
            <div style={{ padding: "30px 20px", backgroundColor: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", textAlign: "center" }}>
              <p style={{ margin: "0 0 12px", color: "var(--ink-soft)" }}>
                No public sessions are currently scheduled. Next cohort sessions will be announced soon.
              </p>
              <Link href="/consultation" className="btn btn-primary btn-sm">
                Request Individual Faculty Consultation
              </Link>
            </div>
          ) : (
            <div className="grid grid-3">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 22,
                    borderRadius: 12,
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
                      <span className="pill accent" style={{ fontSize: "11px" }}>
                        Week {cls.week_number}
                      </span>
                      <span
                        className="pill"
                        style={{
                          fontSize: "11px",
                          backgroundColor: cls.is_free ? "#F0FDF4" : "#FEF3C7",
                          color: cls.is_free ? "#166534" : "#92400E",
                        }}
                      >
                        {cls.is_free ? "Free Attendance" : "Tuition Required"}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "17px", fontWeight: 800, margin: "0 0 8px", color: "var(--bg-navy)" }}>
                      {cls.title}
                    </h3>

                    <div style={{ fontSize: "12.5px", color: "#475569", marginBottom: 6 }}>
                      👨‍⚕️ <strong>{cls.doctor_name || "Dr. Janardhan Mydam, MD, FAAP"}</strong>
                    </div>

                    <div style={{ fontSize: "12.5px", color: "var(--muted)", fontFamily: "var(--font-mono)", marginBottom: 12 }}>
                      🗓️ {cls.date_time} ({cls.duration_minutes} min)
                    </div>

                    <p style={{ fontSize: "13.5px", color: "var(--ink-soft)", lineHeight: 1.5, marginBottom: 16 }}>
                      {cls.description}
                    </p>
                  </div>

                  <div style={{ paddingTop: 14, borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      Platform: <strong>{cls.meeting_platform}</strong>
                    </span>
                    <Link
                      href="/student/live-learning"
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: "12px" }}
                    >
                      Register in Portal &rarr;
                    </Link>
                  </div>
                </div>
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
