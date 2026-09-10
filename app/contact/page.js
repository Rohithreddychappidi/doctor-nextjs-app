"use client";

import { useState } from "react";
import MandatoryStar from "@/components/MandatoryStar";

const INQUIRY_CATEGORIES = [
  "Education or lecture inquiry",
  "OSCE or team-based learning inquiry",
  "Tele-rotation / Learning Hub application",
  "Physical rotation guidance",
  "Question-bank & Mock Test access",
  "Research mentorship",
  "Newborn, pediatric, or special-needs guidance",
  "Community health guidance (US Indian families)",
  "Neonatal or mother-baby program development",
  "Policy-resource collaboration",
  "Institutional or global-health partnership",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    reason: "",
    preferred_time: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.category || !formData.reason) {
      setError("Name, email address, category, and inquiry details are mandatory fields (*)");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit inquiry");

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Direct Contact</div>
          <h1 style={{ maxWidth: 680 }}>How Can We Help You?</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Select the specific purpose of your inquiry below so your request can be directed appropriately to Dr. Janardhan Mydam and the clinical team.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container hero-grid" style={{ alignItems: "flex-start" }}>
          <div className="form-card" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="form-note error" style={{ color: "#8A2A34", backgroundColor: "#FFEBEE", padding: 10, borderRadius: 6, marginBottom: 16 }}>
                    {error}
                  </div>
                )}
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="cName">
                      Full Name <MandatoryStar />
                    </label>
                    <input
                      id="cName"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Priya Patel"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="cEmail">
                      Email Address <MandatoryStar />
                    </label>
                    <input
                      id="cEmail"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@institution.org"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="cCategory">
                      Inquiry Category <MandatoryStar />
                    </label>
                    <select
                      id="cCategory"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">-- Select Purpose --</option>
                      {INQUIRY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="cPhone">Phone Number (Optional)</label>
                    <input
                      id="cPhone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (312) 555-0199"
                    />
                  </div>
                </div>

                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="cReason">
                      Details of Inquiry or Request <MandatoryStar />
                    </label>
                    <textarea
                      id="cReason"
                      rows={5}
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Please specify your goals, institution/program, or clinical question..."
                    />
                  </div>
                </div>

                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="cTime">Preferred Contact Time</label>
                    <input
                      id="cTime"
                      type="text"
                      value={formData.preferred_time}
                      onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                      placeholder="e.g. Weekday mornings (CST) or flexible"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? "Submitting Inquiry..." : "Submit Inquiry to Dr. Mydam"}
                </button>

                <div className="form-note" style={{ marginTop: 16 }}>
                  <span>&#9432;</span>
                  <span>
                    <strong>Clinical Safety Disclaimer:</strong> This educational platform does not replace emergency medical care or an in-person physical examination. In a medical emergency, immediately call 911 (in the USA) or local emergency services.
                  </span>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <div className="icon" style={{ margin: "0 auto 20px", background: "#E8F5E9", color: "#2E7D3A", fontSize: 24 }}>
                  &#10003;
                </div>
                <h3 style={{ marginBottom: 12 }}>Inquiry Received Successfully</h3>
                <p style={{ color: "var(--ink-soft)", lineHeight: 1.6 }}>
                  Thank you, <strong>{formData.name}</strong>. Your inquiry under <em>&ldquo;{formData.category}&rdquo;</em> has been logged. Dr. Janardhan Mydam or a member of the academic team will follow up with you at <strong>{formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", category: "", reason: "", preferred_time: "" });
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 24 }}
                >
                  Send Another Inquiry
                </button>
              </div>
            )}
          </div>

          <div style={{ paddingLeft: 20 }}>
            <h3 style={{ marginBottom: 16 }}>Direct Academic Channels</h3>
            <p style={{ fontSize: 14.5, color: "var(--ink-soft)", marginBottom: 24 }}>
              Serving learners, clinicians, and families in the United States, India, and globally.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="card" style={{ padding: "16px 20px" }}>
                <strong>Educational Programs:</strong>
                <p style={{ fontSize: 13.5, margin: "4px 0 0" }}>Windsor University Medical Student Seminars, OSCE practice, and Tele-Rotations.</p>
              </div>
              <div className="card" style={{ padding: "16px 20px" }}>
                <strong>Neonatal Advisory:</strong>
                <p style={{ fontSize: 13.5, margin: "4px 0 0" }}>NICU planning, mother-baby unit development, and clinical floor plan guidance.</p>
              </div>
              <div className="card" style={{ padding: "16px 20px" }}>
                <strong>Research Collaboration:</strong>
                <p style={{ fontSize: 13.5, margin: "4px 0 0" }}>Neonatal health disparities, delayed cord clamping trials, and biostatistics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
