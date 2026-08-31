import Link from "next/link";

export default function CurriculumDevelopmentPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Advisory Services · Curriculum Development</div>
          <h1 style={{ maxWidth: 720 }}>Pediatric &amp; neonatology curriculum design for educational institutions</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            The same rigor behind this practice&apos;s own Tele-Rotation program, applied
            to building a curriculum for your institution — from learning objectives
            through assessment.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid grid-3">
            <div className="card"><h3 style={{ marginBottom: 8 }}>Learning Objectives</h3><p>Defining clear, measurable learning objectives mapped to recognized content outlines.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Topic Sequencing</h3><p>Structuring topic order for progressive, reinforcing learning.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Case Development</h3><p>Building structured, de-identified cases for case-based teaching.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Question Banks</h3><p>Original, faculty-written question sets aligned with exam blueprints.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Simulation &amp; OSCEs</h3><p>Designing simulation stations and OSCE scenarios with scoring rubrics.</p></div>
            <div className="card"><h3 style={{ marginBottom: 8 }}>Faculty Guides &amp; Assessment</h3><p>Faculty facilitation guides, assessment plans, and feedback frameworks.</p></div>
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Building a program at your institution?</div>
          <h2 style={{ marginBottom: 16 }}>Reach out via Contact and select Advisory Services</h2>
          <Link href="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
