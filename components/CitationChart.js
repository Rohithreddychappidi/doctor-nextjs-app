"use client";

import { useEffect, useRef, useState } from "react";

export default function CitationChart({ data }) {
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="citation-chart" ref={trackRef}>
      <div className="citation-scroll">
        <div className="citation-bars">
          {data.map((d, idx) => {
            const heightPct = (d.count / max) * 100;
            return (
              <div
                className="citation-col"
                key={d.year}
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                {hoverIdx === idx && <div className="citation-tooltip">{d.count} citations</div>}
                <div className="citation-bar-track">
                  <div
                    className="citation-bar-fill"
                    style={{
                      height: visible ? `${heightPct}%` : "0%",
                      transitionDelay: `${idx * 45}ms`,
                    }}
                  />
                </div>
                <span className="citation-year">{d.year}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="citation-scroll-hint">Swipe to see all years &rarr;</p>
    </div>
  );
}
