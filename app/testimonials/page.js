"use client";

import TestimonialCard from "@/components/TestimonialCard";
import { useSiteData } from "@/lib/DataContext";

export default function TestimonialsPage() {
  const { testimonials } = useSiteData();
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Testimonials</div>
          <h1 style={{ maxWidth: 700 }}>What students and families say</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Real feedback from people who&apos;ve gone through a free consultation,
            rotation or mentorship session — managed from the admin panel.
          </p>
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
