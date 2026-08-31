import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { QUESTION_BANK_TOPICS } from "@/lib/defaultData";

export default function QuestionBanksPage() {
  const total = QUESTION_BANK_TOPICS.reduce((sum, t) => sum + t.count, 0);
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Education &amp; Training · Question Banks</div>
            <h1>Shelf, USMLE, pediatrics &amp; neonatology boards — organized by topic</h1>
            <p className="lede">Six focused topic areas, each broken into sub-topics —
              built around real neonatal and pediatric case presentations, mapped to the
              Pediatrics Shelf and USMLE Step 2 CK content outlines.</p>
            <div className="hero-actions">
              <Link href="/student-login" className="btn btn-primary">Log in to Practice</Link>
              <Link href="/education-training" className="btn btn-outline">Back to Education &amp; Training</Link>
            </div>
          </div>
          <div className="hero-card">
            <span className="tag">Bank Snapshot</span>
            {[
              ["Total items", `${total}+`],
              ["Topic areas", QUESTION_BANK_TOPICS.length],
              ["Focus", "Neonatology & Pediatrics only"],
              ["New this month", "24 items"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: 14 }}>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Browse by topic</div><h2>Click a topic to see its sub-topics</h2></div>
          </div>

          {QUESTION_BANK_TOPICS.map((topic, idx) => (
            <Accordion key={topic.key} index={idx + 1} label={topic.label} count={topic.count} defaultOpen={idx === 0}>
              <p style={{ fontSize: 13.5, marginBottom: 10 }}>{topic.count} practice items across the following sub-topics:</p>
              <div className="subtopic-list">
                {topic.subtopics.map((s) => (
                  <span className="subtopic-chip" key={s}>{s}</span>
                ))}
              </div>
            </Accordion>
          ))}
        </div>
      </section>

      <section className="section navy center">
        <div className="container">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>Full access</div>
          <h2 style={{ marginBottom: 16 }}>Timed blocks and performance tracking — coming in Phase 2</h2>
          <p className="lede mx-auto">The full testing engine with scoring and analytics is
            planned for the next build phase. Question-writing follows a strict framework —
            one best answer, clinically meaningful tasks, and only original faculty-written
            or official public sample questions.</p>
        </div>
      </section>
    </>
  );
}
