"use client";

import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

export default function HomeBanner() {
  const { content } = useSiteData();
  const hero = content?.home?.heroBanner || {
    tag: "NEONATOLOGY · PEDIATRICS · USCE TRAINING · CLINICAL RESEARCH",
    heading: "Elevating Newborn & Pediatric Healthcare Through Clinical Mentorship",
    subtitle: "Join premier clinical tele-rotations, high-yield board question banks, and weekly grand rounds mentored by Dr. Janardhan Mydam, MD, FAAP — Chair of Pediatrics at Humboldt Park Health.",
    pcImageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1600&auto=format&fit=crop",
    mobileImageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    primaryBtnText: "Explore Education & Training",
    primaryBtnLink: "/education-training",
    secondaryBtnText: "Doctor Portfolio & Bio",
    secondaryBtnLink: "/doctor-portfolio",
  };

  const pcImage = hero.pcImageUrl || "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1600&auto=format&fit=crop";
  const mobileImage = hero.mobileImageUrl || pcImage;

  return (
    <div
      className="home-hero-banner"
      style={{
        position: "relative",
        borderRadius: "18px",
        overflow: "hidden",
        backgroundColor: "#0E182A",
        minHeight: "520px",
        display: "flex",
        alignItems: "center",
        boxShadow: "0 20px 45px -10px rgba(14, 24, 42, 0.35)",
      }}
    >
      {/* PC Background Image (Displayed on screens >= 768px) */}
      <div
        className="banner-bg banner-bg-pc"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(90deg, rgba(14,24,42,0.94) 0%, rgba(14,24,42,0.85) 45%, rgba(14,24,42,0.45) 80%, rgba(14,24,42,0.2) 100%), url(${pcImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          zIndex: 1,
        }}
      />

      {/* Mobile Background Image (Displayed on screens < 768px) */}
      <div
        className="banner-bg banner-bg-mobile"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(180deg, rgba(14,24,42,0.88) 0%, rgba(14,24,42,0.96) 80%), url(${mobileImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <div
        className="banner-content-box"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "800px",
          color: "#FFFFFF",
        }}
      >
        {/* Eyebrow Badge */}
        <div style={{ marginBottom: "14px" }}>
          <span
            style={{
              backgroundColor: "rgba(180, 131, 42, 0.28)",
              color: "#E9C989",
              border: "1px solid rgba(233, 201, 137, 0.5)",
              padding: "5px 12px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              display: "inline-block",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            {hero.tag || "NEONATOLOGY · PEDIATRICS · USCE TRAINING"}
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            color: "#FFFFFF",
            fontFamily: "var(--font-display, 'Fraunces', serif)",
            fontSize: "clamp(1.6rem, 3.8vw, 3.1rem)",
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            fontWeight: 800,
            marginBottom: "14px",
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {hero.heading || "Elevating Newborn & Pediatric Healthcare Through Clinical Mentorship"}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: "rgba(255, 255, 255, 0.88)",
            fontSize: "clamp(13.5px, 1.3vw, 16px)",
            lineHeight: 1.6,
            marginBottom: "24px",
            maxWidth: "680px",
            textShadow: "0 1px 4px rgba(0,0,0,0.25)",
          }}
        >
          {hero.subtitle || "Join premier clinical tele-rotations, high-yield board question banks, and weekly grand rounds mentored by Dr. Janardhan Mydam, MD, FAAP — Chair of Pediatrics at Humboldt Park Health."}
        </p>

        {/* Dual Action Buttons */}
        <div className="banner-btn-group" style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <Link
            href={hero.primaryBtnLink || "/education-training"}
            className="btn btn-primary banner-btn"
            style={{
              padding: "11px 22px",
              fontSize: "13.5px",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(13, 148, 136, 0.4)",
            }}
          >
            {hero.primaryBtnText || "Explore Education & Training"} &rarr;
          </Link>
          <Link
            href={hero.secondaryBtnLink || "/doctor-portfolio"}
            className="btn btn-gold banner-btn"
            style={{
              padding: "11px 20px",
              fontSize: "13.5px",
              fontWeight: 700,
              boxShadow: "0 4px 14px rgba(180, 131, 42, 0.35)",
            }}
          >
            {hero.secondaryBtnText || "Doctor Portfolio & Bio"}
          </Link>
          <Link
            href="/question-banks"
            className="btn btn-ghost-light banner-btn"
            style={{
              padding: "11px 18px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Free Mock Tests
          </Link>
        </div>
      </div>

      <style jsx>{`
        .banner-content-box {
          padding: 54px 44px;
        }
        @media (min-width: 768px) {
          .banner-bg-mobile {
            display: none !important;
          }
          .banner-bg-pc {
            display: block !important;
          }
        }
        @media (max-width: 767px) {
          .banner-bg-pc {
            display: none !important;
          }
          .banner-bg-mobile {
            display: block !important;
          }
          .home-hero-banner {
            min-height: 380px !important;
            padding: 0 !important;
            border-radius: 12px !important;
          }
          .banner-content-box {
            padding: 24px 16px !important;
          }
          .banner-btn {
            padding: 9px 16px !important;
            font-size: 12.5px !important;
          }
        }
      `}</style>
    </div>
  );
}

