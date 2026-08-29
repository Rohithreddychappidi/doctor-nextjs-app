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
              <h2>One free practice, built around students and families</h2>
            </div>
            <p className="lede">Every consultation is free. What you see here is our
              record — of who we&apos;ve helped, and how — not a paywall.</p>
          </div>

          <div className="grid grid-3">
            <div className="card">
              <div className="icon">Dr</div>
              <h3>Doctor Profile</h3>
              <p>Employment, education, research, publications and student mentorship — organized so you can explore exactly what interests you.</p>
            </div>
            <div className="card">
              <div className="icon">Rs</div>
              <h3>Research</h3>
              <p>Neonatology and pediatrics research only — ongoing studies students can join.</p>
            </div>
            <div className="card">
              <div className="icon">Qb</div>
              <h3>Question Bank</h3>
              <p>Six focused topic areas in neonatology and pediatrics, each broken into sub-topics.</p>
            </div>
            <div className="card">
              <div className="icon">Te</div>
              <h3>Tele-Rotation</h3>
              <p>Structured remote clinical mentorship for students without access to in-person rotations.</p>
            </div>
            <div className="card">
              <div className="icon">Ph</div>
              <h3>Physical Rotation</h3>
              <p>On-site clinical exposure with direct supervision, in neonatology and pediatrics.</p>
            </div>
            <div className="card dark">
              <div className="icon">Cn</div>
              <h3>Free Consultation</h3>
              <p style={{ marginBottom: 18 }}>A phone call, at no cost — tell us what you need and we&apos;ll call you back.</p>
              <Link href="/consultation" className="btn btn-ghost-light btn-sm">Request a callback</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Meetings &amp; Events</div>
              <h2>Join a live session</h2>
            </div>
            <Link href="/meetings" className="btn btn-outline">View all meetings</Link>
          </div>
          <div className="grid grid-3">
            {DEFAULT_MEETINGS.map((m) => (
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
              <p>Donations cover website maintenance and mentorship resources — not the doctor&apos;s time, which is given freely.</p>
            </div>
            <Link href="/donate" className="btn btn-primary">Donate</Link>
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
          <Link href="/consultation" className="btn btn-primary">Request a Free Consultation</Link>
        </div>
      </section>
    </>
  );
}
