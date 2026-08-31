"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const SLIDES = [
  {
    tag: "Free Consultations · Phone Call Based",
    title: "From India, to students and families everywhere.",
    body: "Every consultation is free. This site is our record book — a way to track and share how many people we've been able to help, one phone call at a time.",
    cta: { href: "/clinical-services", label: "Request a Free Consultation" },
  },
  {
    tag: "Neonatology & Pediatrics",
    title: "Mentorship focused on one thing, done well.",
    body: "Research, rotations and question bank content are all built around neonatology and pediatrics — not a general catalog.",
    cta: { href: "/research", label: "See Research Opportunities" },
  },
  {
    tag: "Support the Work",
    title: "Help keep this practice free for the next student.",
    body: "Donations go toward website maintenance, mentorship resources and keeping every consultation free of charge.",
    cta: { href: "/community-impact", label: "See Community Impact" },
  },
];

export default function HomeBanner() {
  const [i, setI] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
    return () => clearInterval(timer.current);
  }, []);

  const go = (idx) => {
    setI((idx + SLIDES.length) % SLIDES.length);
    clearInterval(timer.current);
    timer.current = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 6000);
  };

  return (
    <div className="banner">
      {SLIDES.map((s, idx) => (
        <div key={s.title} className={`banner-slide${idx === i ? " active" : ""}`}>
          <div>
            <span className="tag">{s.tag}</span>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
            <Link href={s.cta.href} className="btn btn-primary">{s.cta.label}</Link>
          </div>
        </div>
      ))}
      <div className="banner-dots">
        {SLIDES.map((s, idx) => (
          <button
            key={s.title}
            className={idx === i ? "active" : ""}
            aria-label={`Show slide ${idx + 1}`}
            onClick={() => go(idx)}
          />
        ))}
      </div>
    </div>
  );
}
