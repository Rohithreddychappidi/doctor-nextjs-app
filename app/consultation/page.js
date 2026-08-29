"use client";

import { useState } from "react";
import { useSiteData } from "@/lib/DataContext";

export default function ConsultationPage() {
  const { addRequest } = useSiteData();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", contact: "", reason: "", preferredTime: "",
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    addRequest(form);
    setSubmitted(true);
  };

  return (
    <>
      <section className="hero" style={{ paddingBottom: 30 }}>
        <div className="container">
          <div className="eyebrow">Free Consultation</div>
          <h1 style={{ maxWidth: 720 }}>Request a free phone call — no cost, no obligation</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Every consultation is done over the phone and is completely free. This form
            exists purely to keep an accurate record of who we&apos;ve been able to help —
            it&apos;s not a payment or booking system.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container hero-grid" style={{ alignItems: "flex-start" }}>
          <div className="form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 22 }}>Your details</h3>
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

                <hr className="divider" style={{ margin: "26px 0" }} />

                <h3 style={{ marginBottom: 20 }}>What do you need?</h3>
                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="reason">Reason for this call</label>
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
                  We&apos;ll call the number you provide, usually within a few days.
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
              <div className="icon">1</div>
              <h3>Tell us what you need</h3>
              <p>A couple of details — your contact number and what you&apos;d like to discuss.</p>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="icon">2</div>
              <h3>We call you</h3>
              <p>A real phone call, at no cost — this is how every consultation happens.</p>
            </div>
            <div className="card dark">
              <div className="icon">3</div>
              <h3>It&apos;s logged as a record</h3>
              <p>Your request becomes part of our record of who we&apos;ve helped — this
                site exists to track and share that impact, not to charge for it.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
