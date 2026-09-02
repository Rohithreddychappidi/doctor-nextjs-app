"use client";

import { useState } from "react";
import Link from "next/link";
import { useSiteData } from "@/lib/DataContext";

export default function TeleRotationApplyPage() {
  const { addRequest } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", contact: "", reason: "", preferredTime: "",
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    addRequest({ ...form, reason: `Tele-Rotation Program Enrollment — ${form.reason}` });
    setSubmitted(true);
  };

  return (
    <>
      <section className="hero" style={{ paddingBottom: 30 }}>
        <div className="container">
          <div className="eyebrow">Education &amp; Training · Tele-Rotations · Apply</div>
          <h1 style={{ maxWidth: 700 }}>Apply for the next Tele-Rotation cohort</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Cohorts run 6–12 learners at a time. Submit your details below — once
            accepted, you&apos;ll get a Student Login account and access to the Learning
            Hub, where each week&apos;s live session link appears automatically.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container hero-grid" style={{ alignItems: "flex-start" }}>
          <div className="form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 22 }}>Enrollment details</h3>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Jordan Alvarez" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact">Email or phone</label>
                    <input id="contact" name="contact" type="text" required value={form.contact} onChange={handleChange} placeholder="you@example.com" />
                  </div>
                </div>
                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="reason">Background &amp; what stage of training you're at</label>
                    <textarea id="reason" name="reason" required value={form.reason} onChange={handleChange} placeholder="e.g. 3rd-year medical student, aiming for pediatrics residency" />
                  </div>
                </div>
                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="preferredTime">Preferred cohort timing</label>
                    <input id="preferredTime" name="preferredTime" type="text" value={form.preferredTime} onChange={handleChange} placeholder="e.g. Next available cohort, or a specific month" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
                  Submit Application
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "26px 10px" }}>
                <div className="icon" style={{ margin: "0 auto 20px", background: "var(--accent-soft)", color: "var(--accent)" }}>&#10003;</div>
                <h3 style={{ marginBottom: 12 }}>Application received</h3>
                <p style={{ maxWidth: 380, margin: "0 auto", marginBottom: 20 }}>
                  We&apos;ll review your application and follow up by email or phone.
                  Once accepted, you&apos;ll receive Student Login credentials.
                </p>
                <Link href="/student-signup" className="btn btn-outline btn-sm">Already accepted? Create your account</Link>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="icon">1</div>
              <h3>Apply</h3>
              <p>Submit your background and preferred timing above.</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="icon">2</div>
              <h3>Get accepted</h3>
              <p>Cohorts are kept small (6–12 learners) for real feedback — we&apos;ll confirm your spot by email.</p>
            </div>
            <div className="card dark">
              <div className="icon">3</div>
              <h3>Access the Learning Hub</h3>
              <p>Create your Student Login and see all 6 weekly modules, with live
                session links appearing automatically as each week arrives.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
