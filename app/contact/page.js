"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Contact</div>
          <h1 style={{ maxWidth: 640 }}>Have a question that isn&apos;t about a consultation?</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            For a free consultation, use the dedicated request page — it keeps our records
            straight. For everything else — donations, partnerships, press — reach out here.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container hero-grid" style={{ alignItems: "flex-start" }}>
          <div className="form-card">
            {!submitted ? (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <div className="form-row">
                  <div className="field"><label htmlFor="cName">Name</label><input id="cName" type="text" required /></div>
                  <div className="field"><label htmlFor="cEmail">Email</label><input id="cEmail" type="email" required /></div>
                </div>
                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="cSubject">Subject</label>
                    <select id="cSubject" required defaultValue="">
                      <option value="" disabled>Select one</option>
                      <option>General inquiry</option>
                      <option>Donation / sponsorship</option>
                      <option>Press / media</option>
                      <option>Partnership / collaboration</option>
                      <option>Technical issue with the website</option>
                    </select>
                  </div>
                </div>
                <div className="form-row single">
                  <div className="field"><label htmlFor="cMessage">Message</label><textarea id="cMessage" required placeholder="How can we help?" /></div>
                </div>
                <button type="submit" className="btn btn-primary btn-block">Send Message</button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "26px 10px" }}>
                <div className="icon" style={{ margin: "0 auto 20px", background: "var(--accent-soft)", color: "var(--accent)" }}>&#10003;</div>
                <h3 style={{ marginBottom: 12 }}>Message sent</h3>
                <p>Thanks for reaching out — we&apos;ll get back to you shortly.</p>
              </div>
            )}
          </div>
          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="icon">@</div>
              <h3>Email</h3>
              <p><a href="mailto:care@example.com" style={{ color: "var(--accent)" }}>care@example.com</a></p>
            </div>
            <div className="card dark">
              <div className="icon">Cn</div>
              <h3>Need a free consultation?</h3>
              <p style={{ marginBottom: 16 }}>Use the dedicated page so your request is
                logged in our records properly.</p>
              <a href="/consultation" className="btn btn-ghost-light btn-sm">Go to Free Consultation</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
