import Link from "next/link";
import HomeBanner from "@/components/HomeBanner";
import StatStrip from "@/components/StatStrip";
import MeetingCard from "@/components/MeetingCard";
import TestimonialCard from "@/components/TestimonialCard";
import { DEFAULT_MEETINGS, DEFAULT_TESTIMONIALS } from "@/lib/defaultData";

export default function HomePage() {
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
              <div className="eyebrow">What this practice offers</div>
              <h2>One free practice, built around students, families &amp; institutions</h2>
            </div>
            <p className="lede">Every patient consultation is free. What you see here is
              our record — of who we&apos;ve helped, and how — not a paywall.</p>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <div className="icon">Ab</div>
              <h3>About</h3>
              <p>Mission, credentials, leadership, teaching, and research — organized so you can explore exactly what interests you.</p>
              <Link href="/about" className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>Read more</Link>
            </div>
            <div className="card">
              <div className="icon">Et</div>
              <h3>Education &amp; Training</h3>
              <p>Live Learning, Question Banks, Tele-Rotations, and Physical Rotations — all in one hub.</p>
              <Link href="/education-training" className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>Explore</Link>
            </div>
            <div className="card dark">
              <div className="icon">Cs</div>
              <h3>Clinical Services</h3>
              <p style={{ marginBottom: 18 }}>Free phone consultations for students and families — no cost, no obligation.</p>
              <Link href="/clinical-services" className="btn btn-ghost-light btn-sm">Request a callback</Link>
            </div>
            <div className="card">
              <div className="icon">Rs</div>
              <h3>Research</h3>
              <p>Neonatology and pediatrics research only — ongoing studies students can join.</p>
              <Link href="/research" className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>View research</Link>
            </div>
            <div className="card">
              <div className="icon">Ad</div>
              <h3>Advisory Services</h3>
              <p>NICU development and curriculum design guidance for hospitals and educational institutions.</p>
              <Link href="/advisory-services" className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>Learn more</Link>
            </div>
            <div className="card">
              <div className="icon">Ci</div>
              <h3>Community Impact</h3>
              <p>Outreach, volunteer opportunities, and partnerships — from India to the world.</p>
              <Link href="/community-impact" className="btn btn-outline btn-sm" style={{ marginTop: 14 }}>See our impact</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Education &amp; Training · Live Learning</div>
              <h2>Join a live session</h2>
            </div>
            <Link href="/education-training/live-learning" className="btn btn-outline">View all sessions</Link>
          </div>
          <div className="grid grid-3">
            {DEFAULT_MEETINGS.slice(0, 3).map((m) => (
              <MeetingCard key={m.id} meeting={m} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="promo-band">
            <div>
              <h3>Help keep this practice free</h3>
              <p>Community support covers website maintenance and program resources — not the doctor&apos;s time, which is given freely.</p>
            </div>
            <Link href="/community-impact" className="btn btn-primary">Community Impact</Link>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Testimonials</div>
              <h2>From students and families</h2>
            </div>
            <Link href="/testimonials" className="btn btn-outline">Read more</Link>
          </div>
          <div className="grid grid-3">
            {DEFAULT_TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="section navy center">
        <div className="container">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>Ready when you are</div>
          <h2 style={{ marginBottom: 20 }}>Request your free consultation today</h2>
          <p className="lede mx-auto" style={{ marginBottom: 32 }}>
            Every request is logged and followed up personally by phone — no cost, no obligation.
          </p>
          <Link href="/clinical-services" className="btn btn-primary">Request a Free Consultation</Link>
        </div>
      </section>
    </>
  );
}
