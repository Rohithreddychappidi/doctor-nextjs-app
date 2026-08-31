"use client";

import Link from "next/link";
import HomeBanner from "@/components/HomeBanner";
import StatStrip from "@/components/StatStrip";
import MeetingCard from "@/components/MeetingCard";
import TestimonialCard from "@/components/TestimonialCard";
import { useSiteData } from "@/lib/DataContext";

// icon badge + link target for each Home offer card, in the same
// order as content.home.cards (text for these lives in admin > content)
const CARD_META = [
  { icon: "Ab", href: "/about", cta: "Read more", dark: false },
  { icon: "Et", href: "/education-training", cta: "Explore", dark: false },
  { icon: "Cs", href: "/clinical-services", cta: "Request a callback", dark: true },
  { icon: "Rs", href: "/research", cta: "View research", dark: false },
  { icon: "Ad", href: "/advisory-services", cta: "Learn more", dark: false },
  { icon: "Ci", href: "/community-impact", cta: "See our impact", dark: false },
];

export default function HomePage() {
  const { content, meetings, testimonials } = useSiteData();
  const c = content.home;

  return (
    <>
      <section className="hero" style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div className="container">
          <HomeBanner />
        </div>
      </section>

      <div className="container" style={{ marginTop: 40 }}>
        <StatStrip />
      </div>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{c.offersEyebrow}</div>
              <h2>{c.offersHeading}</h2>
            </div>
            <p className="lede">{c.offersSubtext}</p>
          </div>

          <div className="grid grid-3">
            {c.cards.map((card, idx) => {
              const meta = CARD_META[idx] || {};
              return (
                <div className={`card${meta.dark ? " dark" : ""}`} key={card.heading}>
                  <div className="icon">{meta.icon}</div>
                  <h3>{card.heading}</h3>
                  <p style={meta.dark ? { marginBottom: 18 } : undefined}>{card.body}</p>
                  <Link
                    href={meta.href || "/"}
                    className={meta.dark ? "btn btn-ghost-light btn-sm" : "btn btn-outline btn-sm"}
                    style={meta.dark ? undefined : { marginTop: 14 }}
                  >
                    {meta.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{c.liveLearningEyebrow}</div>
              <h2>{c.liveLearningHeading}</h2>
            </div>
            <Link href="/education-training/live-learning" className="btn btn-outline">View all sessions</Link>
          </div>
          {meetings.length === 0 ? (
            <p>No sessions are scheduled right now — check back soon.</p>
          ) : (
            <div className="grid grid-3">
              {meetings.slice(0, 3).map((m) => (
                <MeetingCard key={m.id} meeting={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="promo-band">
            <div>
              <h3>{c.promoHeading}</h3>
              <p>{c.promoBody}</p>
            </div>
            <Link href="/community-impact" className="btn btn-primary">Community Impact</Link>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{c.testimonialsEyebrow}</div>
              <h2>{c.testimonialsHeading}</h2>
            </div>
            <Link href="/testimonials" className="btn btn-outline">Read more</Link>
          </div>
          {testimonials.length === 0 ? (
            <p>No testimonials yet.</p>
          ) : (
            <div className="grid grid-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section navy center">
        <div className="container">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>{c.closingEyebrow}</div>
          <h2 style={{ marginBottom: 20 }}>{c.closingHeading}</h2>
          <p className="lede mx-auto" style={{ marginBottom: 32 }}>{c.closingBody}</p>
          <Link href="/clinical-services" className="btn btn-primary">Request a Free Consultation</Link>
        </div>
      </section>
    </>
  );
}
