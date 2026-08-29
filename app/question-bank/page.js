import Link from "next/link";
import { Accordion } from "@/components/Accordion";
import { QUESTION_BANK_TOPICS } from "@/lib/defaultData";

export default function QuestionBankPage() {
  const total = QUESTION_BANK_TOPICS.reduce((sum, t) => sum + t.count, 0);
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Question Bank</div>
            <h1>Neonatology &amp; pediatrics questions, organized by topic</h1>
            <p className="lede">Six focused topic areas, each broken into sub-topics —
              built around real neonatal and pediatric case presentations, not a generic catalog.</p>
            <div className="hero-actions">
              <Link href="/student-login" className="btn btn-primary">Log in to Practice</Link>
              <Link href="/consultation" className="btn btn-outline">Ask About Access</Link>
            </div>
          </div>
          <div className="hero-card" style={{ background: "var(--bg-navy)", borderRadius: "var(--radius)", padding: 30, color: "#fff" }}>
            <span className="tag" style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "#E9C989", textTransform: "uppercase", marginBottom: 14, display: "inline-block" }}>
              Bank Snapshot
            </span>
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
            planned for the next build phase. For now, students get access to sample items
            and full topic breakdowns after a free consultation.</p>
        </div>
      </section>
    </>
  );
}
