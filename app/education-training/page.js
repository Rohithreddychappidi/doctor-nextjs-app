"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

export default function EducationTrainingPage() {
  const { content } = useSiteData();
  const c = content.educationTraining;

  const [programsMap, setProgramsMap] = useState({});

  useEffect(() => {
    async function fetchPricing() {
      try {
        const res = await fetch("/api/programs");
        if (res.ok) {
          const json = await res.json();
          const map = {};
          (json.programs || []).forEach(p => {
            map[p.key] = p;
          });
          setProgramsMap(map);
        }
      } catch (e) {
        console.error("Hub pricing fetch error:", e);
      }
    }
    fetchPricing();
  }, []);

  // Map subpage href to program key
  const hrefKeyMap = {
    "/education-training/live-learning": "live_learning",
    "/education-training/question-banks": "qbank",
    "/education-training/tele-rotations": "tele_rotation",
    "/education-training/physical-rotations": "physical_rotation",
  };

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
          <div className="grid grid-2">
            {c.subpages.map((sub) => {
              const progKey = hrefKeyMap[sub.href];
              const prog = programsMap[progKey];
              const isFree = prog ? (prog.pricing_type === "Free" || prog.price === "Free") : false;
              const priceDisplay = prog ? (isFree ? "Free" : prog.price) : null;

              return (
                <Link href={sub.href} key={sub.href} className="card" style={{ display: "block", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <h3 style={{ margin: 0 }}>{sub.label}</h3>
                    {priceDisplay && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "999px",
                          backgroundColor: isFree ? "rgba(46,125,58,0.12)" : "rgba(180,131,42,0.14)",
                          color: isFree ? "#2E7D3A" : "#B4832A",
                          border: isFree ? "1px solid rgba(46,125,58,0.3)" : "1px solid rgba(180,131,42,0.3)",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {isFree ? "Free Program" : priceDisplay}
                      </span>
                    )}
                  </div>
                  <p>{sub.blurb}</p>
                  <span style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                    Explore {sub.label} &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Already enrolled?</div>
          <h2 style={{ marginBottom: 16 }}>Log in to your student dashboard</h2>
          <Link href="/student-login" className="btn btn-primary">Student Login</Link>
        </div>
      </section>
    </>
  );
}
