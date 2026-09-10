"use client";

import { useState } from "react";
import Link from "next/link";
import MandatoryStar from "@/components/MandatoryStar";
import { useSiteData } from "@/lib/DataContext";

export default function TeleRotationApplyPage() {
  const { addRequest } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    contact: "",
    reason: "",
    preferredTime: "",
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.contact || !form.reason) {
      setError("Full name, contact email/phone, and background are mandatory fields (*)");
      return;
    }

    setSubmitting(true);
    try {
      addRequest({ ...form, reason: `Learning Hub / Tele-Rotation — ${form.reason}` });

      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.contact.includes("@") ? form.contact : "applicant@jva-medical.com",
          phone: form.contact.includes("@") ? "" : form.contact,
          category: "Tele-rotation application",
          reason: form.reason,
          preferred_time: form.preferredTime,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="hero" style={{ paddingBottom: 30 }}>
        <div className="container">
          <div className="eyebrow">Education &amp; Training · Learning Hub · Apply</div>
          <h1 style={{ maxWidth: 700 }}>Apply for the Tele-Rotation Learning Hub</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Cohorts run 6–12 learners at a time. Submit your details below — once accepted, you&apos;ll get Student Login credentials to access live weekly Microsoft Teams classes, clinical notes, and assignments.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container hero-grid" style={{ alignItems: "flex-start" }}>
          <div className="form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 22 }}>Enrollment Details</h3>

                {error && (
                  <div className="form-note error" style={{ color: "#8A2A34", backgroundColor: "#FFEBEE", padding: 10, borderRadius: 6, marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="name">
                      Full Name <MandatoryStar />
                    </label>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Jordan Alvarez" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact">
                      Email or Phone <MandatoryStar />
                    </label>
                    <input id="contact" name="contact" type="text" required value={form.contact} onChange={handleChange} placeholder="you@example.com" />
                  </div>
                </div>

                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="reason">
                      Background &amp; What Stage of Training You&apos;re At <MandatoryStar />
                    </label>
                    <textarea id="reason" name="reason" rows={4} required value={form.reason} onChange={handleChange} placeholder="e.g. 3rd-year medical student at Windsor University, preparing for pediatric residency" />
                  </div>
                </div>

                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="preferredTime">Preferred Cohort Timing</label>
                    <input id="preferredTime" name="preferredTime" type="text" value={form.preferredTime} onChange={handleChange} placeholder="e.g. Next available cohort, or specific month" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? "Submitting Application..." : "Submit Application"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <div className="icon" style={{ margin: "0 auto 20px", background: "var(--accent-soft)", color: "var(--accent)" }}>&#10003;</div>
                <h3 style={{ marginBottom: 12 }}>Application Submitted</h3>
                <p>
                  Thanks for applying, {form.name}. We will review your background and send enrollment details and your Student Login credentials to {form.contact}.
                </p>
                <div style={{ marginTop: 20 }}>
                  <Link href="/student-login" className="btn btn-primary btn-sm">Go to Student Login</Link>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <span className="tag">What happens next</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
                <div><strong>1. Application Review:</strong> Verified for cohort capacity and training stage alignment.</div>
                <div><strong>2. Student Login Issued:</strong> Access your personal dashboard for Microsoft Teams links.</div>
                <div><strong>3. Curriculum Schedule:</strong> Live weekly case discussions and assignments begin.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
