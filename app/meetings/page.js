"use client";

import MeetingCard from "@/components/MeetingCard";
import { useSiteData } from "@/lib/DataContext";

export default function MeetingsPage() {
  const { meetings } = useSiteData();
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Meetings &amp; Events</div>
          <h1 style={{ maxWidth: 720 }}>Live sessions students can join</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Most sessions are free. Some — like small-group workshops or 1:1 mentorship —
            carry a price set by the admin, shown clearly on each card below. This list is
            fully managed from the admin panel, so it always reflects what&apos;s actually running.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          {meetings.length === 0 ? (
            <p>No meetings are scheduled right now — check back soon.</p>
          ) : (
            <div className="grid grid-3">
              {meetings.map((m) => (
                <MeetingCard key={m.id} meeting={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Don&apos;t see a time that works?</div>
          <h2 style={{ marginBottom: 16 }}>Request a free consultation and we&apos;ll find one</h2>
          <a href="/consultation" className="btn btn-primary">Request a Free Consultation</a>
        </div>
      </section>
    </>
  );
}
