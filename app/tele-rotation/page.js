import Link from "next/link";

export default function TeleRotationPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Tele-Rotation</div>
          <h1 style={{ maxWidth: 720 }}>Remote clinical mentorship in neonatology &amp; pediatrics</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            For students without access to in-person rotations — structured, supervised
            clinical exposure over video, at no cost.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid grid-3" style={{ marginBottom: 40 }}>
            <div className="card">
              <div className="pill gold">2 weeks</div>
              <h3 style={{ marginTop: 16 }}>Case Review Track</h3>
              <p>Weekly live case discussions over video, with structured pre-reading and follow-up questions.</p>
            </div>
            <div className="card">
              <div className="pill gold">4 weeks</div>
              <h3 style={{ marginTop: 16 }}>Clinical Reasoning Intensive</h3>
              <p>Simulated patient encounters and chart review sessions focused on neonatal/pediatric diagnostic reasoning.</p>
            </div>
            <div className="card">
              <div className="pill gold">Ongoing</div>
              <h3 style={{ marginTop: 16 }}>Mentorship Track</h3>
              <p>Biweekly one-on-one video mentorship for students without access to in-person rotations.</p>
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <h3 style={{ marginBottom: 16 }}>How it runs</h3>
              <div className="steps">
                <div className="step"><h4>Video sessions</h4><p>Scheduled live sessions via the Meetings page.</p></div>
                <div className="step"><h4>Case packets</h4><p>De-identified neonatology/pediatrics case material shared ahead of each session.</p></div>
                <div className="step"><h4>Written feedback</h4><p>Session summaries and individual feedback shared after each meeting.</p></div>
              </div>
            </div>
            <div className="card dark">
              <div className="icon">Te</div>
              <h3>Best for</h3>
              <p style={{ marginBottom: 14 }}>Students outside the region, those balancing
                rotations with other commitments, or anyone wanting structured mentorship
                without travel. Completely free — the same as every consultation.</p>
              <Link href="/consultation" className="btn btn-ghost-light btn-sm">Apply via free consultation</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Prefer in-person?</div>
          <h2 style={{ marginBottom: 16 }}>See the Physical Rotation track instead</h2>
          <Link href="/physical-rotation" className="btn btn-outline">View Physical Rotation</Link>
        </div>
      </section>
    </>
  );
}
