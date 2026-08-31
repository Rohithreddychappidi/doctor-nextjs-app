"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

const SLIDE_LINKS = [
  "/clinical-services",
  "/research",
  "/community-impact",
];

export default function HomeBanner() {
  const { content } = useSiteData();
  const slides = content?.home?.bannerSlides || [];
  const [i, setI] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (slides.length < 2) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(timer.current);
  }, [slides.length]);

  const go = (idx) => {
    setI((idx + slides.length) % slides.length);
    clearInterval(timer.current);
    timer.current = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
  };

  if (slides.length === 0) return null;

  return (
    <div className="banner banner-hero-bg">
      {slides.map((s, idx) => (
        <div key={s.heading} className={`banner-slide${idx === i ? " active" : ""}`}>
          <div>
            <span className="tag">{s.tag}</span>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
            <Link href={SLIDE_LINKS[idx] || "/clinical-services"} className="btn btn-primary">{s.ctaLabel}</Link>
          </div>
        </div>
      ))}
      <div className="banner-dots">
        {slides.map((s, idx) => (
          <button
            key={s.heading}
            className={idx === i ? "active" : ""}
            aria-label={`Show slide ${idx + 1}`}
            onClick={() => go(idx)}
          />
        ))}
      </div>
    </div>
  );
}
