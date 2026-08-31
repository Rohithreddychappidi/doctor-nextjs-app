"use client";

import TestimonialCard from "@/components/TestimonialCard";
import { useSiteData } from "@/lib/DataContext";

export default function TestimonialsPage() {
  const { testimonials, content } = useSiteData();
  const c = content.testimonials;
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">{c.eyebrow}</div>
          <h1 style={{ maxWidth: 700 }}>{c.heading}</h1>
          <p className="lede" style={{ marginTop: 16 }}>{c.body}</p>
        </div>
      </section>
      <section className="section tight">
        <div className="container">
          <div className="grid grid-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
