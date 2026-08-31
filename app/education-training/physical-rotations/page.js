import Link from "next/link";

export default function PhysicalRotationsPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Education &amp; Training · Physical Rotations</div>
          <h1 style={{ maxWidth: 720 }}>Institution-approved, in-person pediatric &amp; neonatal learning</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Every placement clearly states whether it is observational or hands-on, along
            with required documents, health clearance, privacy expectations, fees, dates,
            and supervision arrangements.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid grid-3" style={{ marginBottom: 40 }}>
            <div className="card">
              <div className="pill accent">Observational</div>
              <h3 style={{ marginTop: 16 }}>NICU Shadowing</h3>
              <p>Observed rounds and bedside teaching in a neonatal intensive care setting, under direct supervision.</p>
            </div>
            <div className="card">
              <div className="pill accent">Institution-dependent</div>
              <h3 style={{ marginTop: 16 }}>Pediatric Outpatient Clinic</h3>
              <p>Continuity clinic exposure — well-child visits, growth monitoring and follow-up care, per the host institution's policy on hands-on involvement.</p>
            </div>
            <div className="card">
              <div className="pill accent">By arrangement</div>
              <h3 style={{ marginTop: 16 }}>Elective Placement</h3>
              <p>A focused elective within neonatology or pediatrics, arranged with an approved host institution.</p>
            </div>
          </div>

          <div className="grid grid-2">
            <div>
              <h3 style={{ marginBottom: 16 }}>What to expect</h3>
              <div className="steps">
                <div className="step"><h4>Documents &amp; health clearance</h4><p>Required paperwork, immunization records, and any host-institution health clearance are confirmed before placement begins.</p></div>
                <div className="step"><h4>Supervision</h4><p>Every placement has a named supervising physician and clearly defined scope — observational vs. hands-on is stated up front, never assumed.</p></div>
                <div className="step"><h4>Privacy</h4><p>Patient privacy and institutional policy apply throughout — no identifiable patient information leaves the clinical setting.</p></div>
              </div>
            </div>
            <div className="card dark">
              <div className="icon">Ph</div>
              <h3>Eligibility &amp; fees</h3>
              <p style={{ marginBottom: 14 }}>Open to medical students (clinical years) and
                IMGs preparing for residency applications, subject to the host
                institution&apos;s requirements. Any applicable fees, dates, and
                documentation requirements are confirmed during the application process —
                nothing is charged without being stated upfront.</p>
              <Link href="/contact" className="btn btn-ghost-light btn-sm">Apply via Contact</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Not near a placement site?</div>
          <h2 style={{ marginBottom: 16 }}>See the Tele-Rotations program instead</h2>
          <Link href="/education-training/tele-rotations" className="btn btn-outline">View Tele-Rotations</Link>
        </div>
      </section>
    </>
  );
}
