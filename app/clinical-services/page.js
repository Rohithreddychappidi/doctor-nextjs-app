"use client";

import { useState } from "react";
import MandatoryStar from "@/components/MandatoryStar";
import { useSiteData } from "@/lib/DataContext";

export default function ClinicalServicesPage() {
  const { addRequest } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", concern: "", preferredTime: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || (!form.email && !form.phone) || !form.concern) {
      setError("Full name, contact (email or phone), and clinical concern are mandatory fields (*)");
      return;
    }

    setSubmitting(true);
    try {
      // Save to DataContext
      addRequest({
        name: form.name,
        contact: form.email || form.phone,
        reason: `Clinical Guidance — ${form.concern}`,
        preferredTime: form.preferredTime,
      });

      // Save to database inquiries
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email || "phone-consultation@jva-medical.com",
          phone: form.phone,
          category: "Newborn, pediatric, or special-needs guidance",
          reason: form.concern,
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
          <div className="eyebrow">Family Education &amp; Navigation</div>
          <h1 style={{ maxWidth: 760 }}>Clinical Guidance for Families &amp; Parents</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Educational guidance for newborn care, premature infant follow-up, general pediatrics, and navigating specialized care in the United States.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid grid-3" style={{ marginBottom: 40 }}>
            <div className="card">
              <div className="icon">1</div>
              <h3>Neonatal &amp; NICU Guidance</h3>
              <p>Understanding prematurity complications, respiratory milestones, oxygen weaning, and transition from NICU to home.</p>
            </div>
            <div className="card">
              <div className="icon">2</div>
              <h3>Pediatric Clinical Concerns</h3>
              <p>Guidance on recurrent fevers, neonatal jaundice, feeding challenges, developmental milestones, and specialist referrals.</p>
            </div>
            <div className="card dark">
              <div className="icon">!</div>
              <h3>Clinical Safety Notice</h3>
              <p>Consultations are purely educational. They do not replace emergency care, physical in-person examinations, or your primary pediatrician.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container hero-grid" style={{ alignItems: "flex-start" }}>
          <div className="form-card" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 20 }}>Request Educational Guidance</h3>

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
                    <label htmlFor="email">
                      Email Address <MandatoryStar />
                    </label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+1 (312) 555-0199" />
                  </div>
                  <div className="field">
                    <label htmlFor="preferredTime">Preferred Contact Window</label>
                    <input id="preferredTime" name="preferredTime" type="text" value={form.preferredTime} onChange={handleChange} placeholder="Weekday evenings (CST)" />
                  </div>
                </div>

                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="concern">
                      Child&apos;s Age &amp; Primary Question or Health Concern <MandatoryStar />
                    </label>
                    <textarea
                      id="concern"
                      name="concern"
                      rows={5}
                      required
                      value={form.concern}
                      onChange={handleChange}
                      placeholder="Please describe the newborn or pediatric health question, previous diagnoses, or guidance needed..."
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Guidance Request"}
                </button>

                <div className="form-note" style={{ marginTop: 16 }}>
                  <span>&#9432;</span>
                  <span>
                    <strong>Clinical Safety Note:</strong> In the event of acute respiratory distress, cyanosis, lethargy, or other medical emergency, call 911 or visit the nearest emergency room immediately.
                  </span>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <div className="icon" style={{ margin: "0 auto 20px", background: "#E8F5E9", color: "#2E7D3A", fontSize: 24 }}>&#10003;</div>
                <h3 style={{ marginBottom: 12 }}>Guidance Request Logged</h3>
                <p style={{ color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  Thank you, <strong>{form.name}</strong>. Dr. Janardhan Mydam or a clinical coordinator will follow up with you at <strong>{form.email || form.phone}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", phone: "", concern: "", preferredTime: "" });
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 24 }}
                >
                  Submit Another Request
                </button>
              </div>
            )}
          </div>

          <div style={{ paddingLeft: 20 }}>
            <h3 style={{ marginBottom: 16 }}>Suggested Service Pathways</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 14 }}>
              <div className="card" style={{ padding: "14px 18px" }}>
                <strong>Neonatal &amp; NICU Guidance:</strong> Prematurity follow-up, bronchopulmonary dysplasia, incubator weaning.
              </div>
              <div className="card" style={{ padding: "14px 18px" }}>
                <strong>Children with Special Healthcare Needs:</strong> Coordinating complex multi-specialty care and therapy services.
              </div>
              <div className="card" style={{ padding: "14px 18px" }}>
                <strong>Second Opinions &amp; Visit Preparation:</strong> Organizing clinical questions and interpreting diagnostic reports.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
