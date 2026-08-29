import Link from "next/link";

export default function PhysicalRotationPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Physical Rotation</div>
          <h1 style={{ maxWidth: 720 }}>On-site clinical exposure in neonatology &amp; pediatrics</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Direct, supervised bedside experience for medical students and IMGs — in
            person, at no cost to the student.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid grid-3" style={{ marginBottom: 40 }}>
            <div className="card">
              <div className="pill accent">4 weeks</div>
              <h3 style={{ marginTop: 16 }}>NICU Core Rotation</h3>
              <p>Inpatient NICU rounds, morning report and direct patient work-up under supervision.</p>
            </div>
            <div className="card">
              <div className="pill accent">2 weeks</div>
              <h3 style={{ marginTop: 16 }}>Pediatric Outpatient Clinic</h3>
              <p>Continuity clinic exposure — well-child visits, growth monitoring and follow-up care.</p>
            </div>
            <div className="card">
              <div className="pill accent">2–4 weeks</div>
              <h3 style={{ marginTop: 16 }}>Elective Track</h3>
              <p>A focused elective within neonatology or pediatrics, by arrangement.</p>
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <h3 style={{ marginBottom: 16 }}>What&apos;s included</h3>
              <div className="steps">
                <div className="step"><h4>Direct supervision</h4><p>Daily bedside teaching and case discussion with Dr. Doctor Name or a supervising physician.</p></div>
                <div className="step"><h4>Structured evaluation</h4><p>Mid-rotation and end-of-rotation feedback tied to clear clinical competencies.</p></div>
                <div className="step"><h4>Letter of recommendation</h4><p>Available on request for students who complete the full rotation.</p></div>
              </div>
            </div>
            <div className="card dark">
              <div className="icon">Ph</div>
              <h3>Eligibility</h3>
              <p style={{ marginBottom: 14 }}>Open to medical students (clinical years) and
                IMGs preparing for residency applications, with an interest in neonatology
                or pediatrics. No fee — same as every part of this practice.</p>
              <Link href="/consultation" className="btn btn-ghost-light btn-sm">Apply via free consultation</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Not near a rotation site?</div>
          <h2 style={{ marginBottom: 16 }}>See the Tele-Rotation track instead</h2>
          <Link href="/tele-rotation" className="btn btn-outline">View Tele-Rotation</Link>
        </div>
      </section>
    </>
  );
}
