import Link from "next/link";
import { EDUCATION_TRAINING_SUBPAGES } from "@/lib/defaultData";

export default function EducationTrainingPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Education &amp; Training</div>
          <h1 style={{ maxWidth: 720 }}>All learning services, in one place</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Live Learning, Question Banks, Tele-Rotations, and Physical Rotations —
            review eligibility, schedules, and requirements, and apply or log in from here.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid grid-2">
            {EDUCATION_TRAINING_SUBPAGES.map((sub) => (
              <Link href={sub.href} key={sub.key} className="card" style={{ display: "block" }}>
                <h3 style={{ marginBottom: 10 }}>{sub.label}</h3>
                <p>{sub.blurb}</p>
                <span style={{ display: "inline-block", marginTop: 14, fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
                  Explore {sub.label} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Already enrolled?</div>
          <h2 style={{ marginBottom: 16 }}>Log in to your student dashboard</h2>
          <Link href="/student-login" className="btn btn-primary">Student Login</Link>
        </div>
      </section>
    </>
  );
}
