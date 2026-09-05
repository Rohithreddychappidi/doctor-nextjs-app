"use client";

import { useEffect, useRef, useState } from "react";

function JourneyNode({ item, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`journey-node ${isLeft ? "journey-node-left" : "journey-node-right"}${visible ? " journey-visible" : ""}`}
      style={{ transitionDelay: visible ? "0ms" : `${Math.min(index * 60, 300)}ms` }}
    >
      <div className="journey-photo">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.title} />
        ) : (
          <span>&#128247;</span>
        )}
      </div>
      <div className="journey-dot" />
      <div className="journey-card">
        <span className="journey-year">{item.year}</span>
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
    </div>
  );
}

export default function JourneyTimeline({ items }) {
  const trackRef = useRef(null);
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress from when the track enters the bottom of the viewport
      // to when it exits the top — clamped 0..1.
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setFillHeight(progress * rect.height);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="journey-track" ref={trackRef}>
      <div className="journey-line" />
      <div className="journey-line-fill" style={{ height: `${fillHeight}px` }} />
      {items.map((item, idx) => (
        <JourneyNode key={item.year + item.title} item={item} index={idx} />
      ))}
    </div>
  );
}
