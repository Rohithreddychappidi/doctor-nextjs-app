"use client";

import Link from "next/link";
import MeetingCard from "@/components/MeetingCard";
import { useSiteData } from "@/lib/DataContext";

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
        </div>
      </section>

      <section className="section tight">
        <div className="container">
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
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/education-training/tele-rotations" className="btn btn-outline">Tele-Rotations</Link>
            <Link href="/education-training/physical-rotations" className="btn btn-outline">Physical Rotations</Link>
          </div>
        </div>
      </section>
    </>
  );
}
