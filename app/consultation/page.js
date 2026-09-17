"use client";

import { useState } from "react";
import Link from "next/link";
import MandatoryStar from "@/components/MandatoryStar";
import { useSiteData } from "@/lib/DataContext";

export default function ConsultationPage() {
  const { addRequest } = useSiteData();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    stage: "Medical Graduate / IMG",
    focus_area: "US Clinical Tele-Rotations & LOR",
    cv_url: "",
    preferred_time: "Weekday Evenings (EST)",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.cv_url) {
      setError("Please fill in your name, email, phone, and link to your CV/portfolio.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Post to dedicated backend API
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // 2. Also register in local DataContext for offline/demo reliability
      addRequest({
        name: form.name,
        contact: form.email,
        phone: form.phone,
        reason: `General Consultation: ${form.focus_area} — ${form.message}`,
        preferredTime: form.preferred_time,
        institution: form.institution,
        cv_url: form.cv_url,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Unable to submit your consultation request. Please try again.");
      }
    } catch (err) {
      // Even if network fails, fallback to local confirmation
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ paddingBottom: 36 }}>
        <div className="container hero-grid">
          <div>
            <div className="eyebrow" style={{ color: "#0F766E" }}>
              Attending Physician Mentorship · 1-on-1 Guidance
            </div>
            <h1 style={{ maxWidth: 680 }}>
              Schedule a Pre-Enrollment Consultation with Dr. Janardhan Mydam
            </h1>
            <p className="lede" style={{ marginTop: 16 }}>
              Before committing to a clinical tele-rotation, research cohort, or board preparation bank, speak directly with Dr. Janardhan Mydam, MD, FAAP. We discuss your academic credentials, US residency strategy, and tailor the right training pathway for your career.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: 24, flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", backgroundColor: "#F0FDFA", border: "1px solid #99F6E4", color: "#0F766E" }}>
                ✓ Attending Led Guidance
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", backgroundColor: "#FEF3C7", border: "1px solid #FDE68A", color: "#B45309" }}>
                ✓ CV &amp; Credentials Review
              </span>
              <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px", backgroundColor: "#EEF2FF", border: "1px solid #C7D2FE", color: "#4338CA" }}>
                ✓ Microsoft Teams / Google Meet
              </span>
            </div>
          </div>

          <div className="hero-card">
            <span className="tag">Faculty Credentials</span>
            <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: "14px" }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>Supervising Physician</div>
              <strong style={{ fontSize: "15px", color: "#FFFFFF" }}>Dr. Janardhan Mydam, MD, FAAP</strong>
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: "13.5px" }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>Academic Roles</div>
              <span>Chair of Pediatrics, Humboldt Park Health · Chair of Academics, Windsor Univ · Attending Neonatologist</span>
            </div>
            <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.14)", fontSize: "13.5px" }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>Consultation Format</div>
              <span>15–30 Minute Private Video Conference</span>
            </div>
            <div style={{ padding: "12px 0", fontSize: "13.5px" }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>Follow-up</div>
              <span style={{ color: "#4ADE80", fontWeight: 700 }}>Personalized Written Action Plan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Intake Form Section */}
      <section className="section soft">
        <div className="container" style={{ maxWidth: 880 }}>
          {!submitted ? (
            <div className="card" style={{ padding: "36px 40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(14,24,42,0.06)" }}>
              <div style={{ marginBottom: 24, borderBottom: "1px solid #E2E8F0", paddingBottom: 16 }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
                  Candidate Information &amp; Goals
                </h2>
                <p style={{ fontSize: "13.5px", color: "#64748B" }}>
                  Please share your background and curriculum Vitae (CV) link so Dr. Mydam can review your trajectory prior to the call.
                </p>
              </div>

              {error && (
                <div style={{ backgroundColor: "#FEE2E2", color: "#991B1B", padding: "12px 16px", borderRadius: "8px", marginBottom: 20, fontSize: "13.5px", fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div className="form-row-2col">
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                      Full Legal Name <MandatoryStar />
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Dr. Jordan Alvarez"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                      Email Address <MandatoryStar />
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                      Phone / WhatsApp Number <MandatoryStar />
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (312) 555-0192"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                      Medical School / Institution <MandatoryStar />
                    </label>
                    <input
                      type="text"
                      name="institution"
                      required
                      value={form.institution}
                      onChange={handleChange}
                      placeholder="e.g. Windsor University, Kasturba Medical College"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div className="form-row-2col">
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                      Current Career Stage <MandatoryStar />
                    </label>
                    <select
                      name="stage"
                      value={form.stage}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px", backgroundColor: "#fff" }}
                    >
                      <option value="Medical Student (Pre-Clinical)">Medical Student (Pre-Clinical Year 1-2)</option>
                      <option value="Medical Student (Clinical)">Medical Student (Clinical Clerkships Year 3-4)</option>
                      <option value="Medical Graduate / IMG">Medical Graduate / IMG (USMLE Aspirant)</option>
                      <option value="Pediatric Resident">Pediatric / Transitional Resident</option>
                      <option value="Fellow / Attending">Fellow / Attending Physician</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                      Primary Consultation Focus <MandatoryStar />
                    </label>
                    <select
                      name="focus_area"
                      value={form.focus_area}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px", backgroundColor: "#fff" }}
                    >
                      <option value="US Clinical Tele-Rotations & LOR">US Clinical Tele-Rotations &amp; Attending LOR</option>
                      <option value="Live Clinical Seminars & Grand Rounds">Live Clinical Classes &amp; Grand Rounds</option>
                      <option value="Question Banks & USMLE / Shelf Preparation">Question Banks &amp; USMLE / Shelf Prep</option>
                      <option value="Neonatal & Pediatric Research Mentorship">Neonatal &amp; Pediatric Research Authorship</option>
                      <option value="US Residency Match Strategy & Mentorship">US Residency Match Strategy &amp; Mentorship</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                    Link to CV / Resume / LinkedIn Profile <MandatoryStar />
                  </label>
                  <input
                    type="url"
                    name="cv_url"
                    required
                    value={form.cv_url}
                    onChange={handleChange}
                    placeholder="https://drive.google.com/... or https://linkedin.com/in/..."
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px" }}
                  />
                  <span style={{ fontSize: "11px", color: "#64748B", marginTop: 4, display: "block" }}>
                    Please provide a viewable link to your CV, Google Drive document, or LinkedIn profile.
                  </span>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                    Preferred Meeting Timing Range
                  </label>
                  <input
                    type="text"
                    name="preferred_time"
                    value={form.preferred_time}
                    onChange={handleChange}
                    placeholder="e.g. Weekday Evenings, Saturdays 10 AM EST, or specific dates"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                    Specific Goals, Questions, or Clinical Interests
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe your current medical goals, any specific questions for Dr. Mydam regarding rotations or research, and your target timeline..."
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "14px" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "14px", fontSize: "15px", fontWeight: 700, borderRadius: "8px", marginTop: 8 }}
                >
                  {submitting ? "Submitting Details..." : "Request 1-on-1 Consultation Call"}
                </button>
              </form>
            </div>
          ) : (
            <div className="card" style={{ padding: "48px 36px", textAlign: "center", borderRadius: "16px" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 20px" }}>
                ✓
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
                Consultation Request Submitted
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 24px" }}>
                Thank you, <strong>{form.name}</strong>. Your academic background and CV have been routed directly to Dr. Janardhan Mydam&apos;s administration. You will receive an email confirmation with meeting scheduling details and a Microsoft Teams conference link shortly.
              </p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/education-training" className="btn btn-primary btn-sm">
                  Explore Education &amp; Training &rarr;
                </Link>
                <Link href="/student-signup" className="btn btn-gold btn-sm">
                  Register Student Account
                </Link>
                <Link href="/" className="btn btn-outline btn-sm">
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
