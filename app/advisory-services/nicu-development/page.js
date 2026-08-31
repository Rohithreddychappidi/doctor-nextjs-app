import Link from "next/link";

export default function NicuDevelopmentPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Advisory Services · NICU Development &amp; Expansion</div>
          <h1 style={{ maxWidth: 720 }}>Guidance for hospitals building or expanding NICU care</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Advisory support across the full scope of NICU planning — from level-of-care
            decisions to staffing, training, and readiness for implementation.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid grid-3">
            <div className="card"><h3 style={{ marginBottom: 8 }}>Level of Care</h3><p>Determining the appropriate NICU level for a given institution's patient population and resources.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Workflows &amp; Policies</h3><p>Designing clinical workflows and policies aligned with best practice and institutional capacity.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Staffing &amp; Training</h3><p>Guidance on staffing models and structured training for nursing and physician teams.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Transfer Pathways</h3><p>Establishing clear transfer and escalation pathways to higher levels of care when needed.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Equipment Planning</h3><p>Advisory input on equipment needs aligned with the target level of care.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Quality Measures</h3><p>Setting up quality measures and implementation readiness checks before launch.</p></div>
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Ready to discuss your institution's needs?</div>
          <h2 style={{ marginBottom: 16 }}>Reach out via Contact and select Advisory Services</h2>
          <Link href="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
