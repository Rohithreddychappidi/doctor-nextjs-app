"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

const DEFAULT_SLIDES = [
  {
    tag: "NEONATOLOGY • PEDIATRICS • EDUCATION • RESEARCH",
    heading: "Improving Newborn and Child Health Through Education, Clinical Guidance, and Research",
    body: "Welcome to the professional and educational platform of Dr. Janardhan Mydam — neonatologist, pediatrician, physician educator, researcher, and academic leader.",
    ctaLabel: "Explore Education & Training",
    href: "/education-training",
    imageUrl: "/images/hero-banner-1.svg",
  },
  {
    tag: "ONLINE MOCK TESTS • FREE INITIAL PERIOD",
    heading: "Master Clinical Reasoning with Board-Style Mock Examinations",
    body: "Comprehensive question banks in Neonatology, Pediatrics, and Biostatistics with in-depth rationales explaining why the correct choice is right and why distractors are wrong.",
    ctaLabel: "Take Free Mock Test",
    href: "/question-banks",
    imageUrl: "/images/hero-banner-2.svg",
  },
  {
    tag: "LEARNING HUB • TELE-ROTATION",
    heading: "Structured Virtual Tele-Rotations & Live Microsoft Teams Classes",
    body: "Weekly interactive sessions, clinical case writeups, EMR orientation (Epic, Cerner, Meditech), and biostatistical mentorship.",
    ctaLabel: "View Learning Hub",
    href: "/education-training/tele-rotations",
    imageUrl: "/images/hero-banner-3.svg",
  },
];

export default function HomeBanner() {
  const { content } = useSiteData();
  const rawSlides = content?.home?.bannerSlides || [];
  const slides = rawSlides.length > 0 ? rawSlides.map((s, idx) => ({
    ...s,
    imageUrl: s.imageUrl || DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].imageUrl,
    href: s.href || DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].href,
  })) : DEFAULT_SLIDES;

  const [i, setI] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (slides.length < 2) return;
    timer.current = setInterval(() => setI((v) => (v + 1) % slides.length), 7000);
    return () => clearInterval(timer.current);
  }, [slides.length]);

  const go = (idx) => {
    setI((idx + slides.length) % slides.length);
    clearInterval(timer.current);
    timer.current = setInterval(() => setI((v) => (v + 1) % slides.length), 7000);
  };

  if (slides.length === 0) return null;

  const currentSlide = slides[i];

  return (
    <div
      className="banner"
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#12203B",
        minHeight: 460,
        boxShadow: "0 12px 36px rgba(18, 32, 59, 0.2)",
      }}
    >
      {/* Background Banner Image with Gradient Mask */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `linear-gradient(90deg, rgba(14,24,42,0.92) 0%, rgba(18,32,59,0.78) 55%, rgba(18,32,59,0.3) 100%), url(${currentSlide.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.5s ease-in-out",
        }}
      />

      {/* Slide Content Overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "54px 48px",
          maxWidth: 740,
          color: "#FFFFFF",
        }}
      >
        <span
          className="tag"
          style={{
            backgroundColor: "rgba(180, 131, 42, 0.25)",
            color: "#E9C989",
            border: "1px solid #B4832A",
            padding: "4px 12px",
            borderRadius: 16,
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
            display: "inline-block",
            marginBottom: 16,
          }}
        >
          {currentSlide.tag}
        </span>
        <h2
          style={{
            color: "#FFFFFF",
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(1.9rem, 3.2vw, 2.7rem)",
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          {currentSlide.heading}
        </h2>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          {currentSlide.body}
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href={currentSlide.href || "/education-training"} className="btn btn-primary" style={{ fontWeight: 600 }}>
            {currentSlide.ctaLabel || "Explore"}
          </Link>
          <Link href="/clinical-services" className="btn btn-ghost-light">
            Clinical Guidance
          </Link>
        </div>
      </div>

      {/* Pagination Dots */}
      <div
        className="banner-dots"
        style={{
          position: "absolute",
          bottom: 20,
          left: 48,
          zIndex: 3,
          display: "flex",
          gap: 8,
        }}
      >
        {slides.map((s, idx) => (
          <button
            key={idx}
            className={idx === i ? "active" : ""}
            aria-label={`Show slide ${idx + 1}`}
            onClick={() => go(idx)}
            style={{
              width: idx === i ? 28 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: idx === i ? "#E9C989" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  );
}
