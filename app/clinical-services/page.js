"use client";

import { useState } from "react";
import { useSiteData } from "@/lib/DataContext";

export default function ClinicalServicesPage() {
  const { addRequest, content } = useSiteData();
  const c = content.clinicalServices;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", reason: "", preferredTime: "" });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    addRequest({ ...form, reason: `Clinical Services — ${form.reason}` });
    setSubmitted(true);
  };

  return (
    <>
      <section className="hero" style={{ paddingBottom: 30 }}>
        <div className="container">
          <div className="eyebrow">{c.eyebrow}</div>
          <h1 style={{ maxWidth: 720 }}>{c.heading}</h1>
          <p className="lede" style={{ marginTop: 16 }}>{c.body}</p>
        </div>
      </section>

      <section className="section tight">
        <div className="container">
          <div className="grid grid-3" style={{ marginBottom: 40 }}>
            {c.features.map((f, idx) => (
              <div className={`card${idx === 2 ? " dark" : ""}`} key={f.heading}>
                <div className="icon">{idx === 2 ? "!" : idx + 1}</div>
                <h3>{f.heading}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 40 }}>
            <h3 style={{ marginBottom: 10 }}>{c.privacyHeading}</h3>
            <p>{c.privacyBody}</p>
          </div>
        </div>
      </section>

      <section className="section soft">
        <div className="container hero-grid" style={{ alignItems: "flex-start" }}>
          <div className="form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 22 }}>Request a free consultation</h3>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Jordan Alvarez" />
                  </div>
                  <div className="field">
                    <label htmlFor="contact">Phone or WhatsApp number</label>
                    <input id="contact" name="contact" type="tel" required value={form.contact} onChange={handleChange} placeholder="+1 555 000 0000" />
                  </div>
                </div>
                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="reason">What would you like to discuss?</label>
                    <textarea id="reason" name="reason" required value={form.reason} onChange={handleChange} placeholder="A few sentences on your background and what you're hoping to discuss." />
                  </div>
                </div>
                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="preferredTime">Best time to call you</label>
                    <input id="preferredTime" name="preferredTime" type="text" value={form.preferredTime} onChange={handleChange} placeholder="e.g. Weekday evenings, IST" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
                  Request My Free Call
                </button>
                <p style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>
                  This is not for urgent concerns. In an emergency, contact local emergency services directly.
                </p>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "26px 10px" }}>
                <div className="icon" style={{ margin: "0 auto 20px", background: "var(--accent-soft)", color: "var(--accent)" }}>&#10003;</div>
                <h3 style={{ marginBottom: 12 }}>Request received — thank you</h3>
                <p style={{ maxWidth: 380, margin: "0 auto" }}>
                  Your request has been logged. We&apos;ll call you at the number you
                  provided. There is no charge for this consultation.
                </p>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="icon">Rt</div>
              <h3>Looking for a rotation instead?</h3>
              <p style={{ marginBottom: 14 }}>Tele-Rotations and Physical Rotations are
                under Education &amp; Training, with their own eligibility and application process.</p>
              <a href="/education-training" className="btn btn-outline btn-sm">Go to Education &amp; Training</a>
            </div>
            <div className="card dark">
              <div className="icon">Ad</div>
              <h3>Representing a hospital or institution?</h3>
              <p style={{ marginBottom: 14 }}>NICU development and curriculum consulting
                are handled under Advisory Services, not this consultation form.</p>
              <a href="/advisory-services" className="btn btn-ghost-light btn-sm">Go to Advisory Services</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
