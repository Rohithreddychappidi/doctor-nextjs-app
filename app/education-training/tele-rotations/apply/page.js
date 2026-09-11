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
  const [documentName, setDocumentName] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredTime: "Next Available Cohort (Fall 2026)",
    document_url: "",
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentName(file.name);
      // Simulate uploaded URL
      setForm((f) => ({ ...f, document_url: `/uploads/${file.name}` }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.message) {
      setError("Full name, email, phone number, and personal statement message are mandatory fields (*)");
      return;
    }

    setSubmitting(true);
    try {
      addRequest({
        name: form.name,
        contact: form.email,
        phone: form.phone,
        reason: `Learning Hub / Tele-Rotation — ${form.message}`,
      });

      // Submit to rotations application pipeline
      await fetch("/api/student/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply",
          name: form.name,
          email: form.email,
          phone: form.phone,
          document_url: form.document_url || (documentName ? `/uploads/${documentName}` : ""),
          message: form.message,
          preferred_time: form.preferredTime,
        }),
      });

      // Also persist to inquiries log
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          category: "Tele-rotation application",
          reason: form.message,
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
          <h1 style={{ maxWidth: 700 }}>Apply for the Virtual Neonatal &amp; Pediatric Tele-Rotation</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Cohorts run 6–12 learners at a time under the direct preceptorship of Dr. Janardhan Mydam, MD, FAAP. Submit your details below &mdash; once reviewed and approved by faculty, you will be invited to complete tuition payment and activate your live Microsoft Teams cohort seat.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container hero-grid" style={{ alignItems: "flex-start" }}>
          <div className="form-card">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 22 }}>Candidate Enrollment Details</h3>

                {error && (
                  <div className="form-note error" style={{ color: "#8A2A34", backgroundColor: "#FFEBEE", padding: 10, borderRadius: 6, marginBottom: 16 }}>
                    {error}
                  </div>
                )}

                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="name">
                      Full Legal Name <MandatoryStar />
                    </label>
                    <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="e.g. Jordan Alvarez" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="email">
                      Email Address <MandatoryStar />
                    </label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="you@example.com" />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">
                      Phone / WhatsApp Number <MandatoryStar />
                    </label>
                    <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="+1 (312) 555-0192" />
                  </div>
                </div>

                {/* Document Upload */}
                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="docUpload">
                      Supporting Document (CV, Transcript, or USMLE Score Report)
                    </label>
                    <input
                      id="docUpload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={handleFileChange}
                      style={{ padding: "8px 12px", border: "1px dashed #94a3b8", borderRadius: 8, backgroundColor: "#f8fafc", width: "100%" }}
                    />
                    {documentName && (
                      <p style={{ fontSize: 12, color: "#0f766e", fontWeight: 700, marginTop: 4 }}>
                        ✓ File attached: {documentName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="message">
                      Personal Statement &amp; Clinical Background Message <MandatoryStar />
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Share your medical school, current stage of training, US residency goals, and why you are interested in neonatal & pediatric USCE with Dr. Mydam..."
                    />
                  </div>
                </div>

                <div className="form-row single">
                  <div className="field">
                    <label htmlFor="preferredTime">Preferred Cohort Timing</label>
                    <input id="preferredTime" name="preferredTime" type="text" value={form.preferredTime} onChange={handleChange} placeholder="e.g. Next available cohort, or specific month" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                  {submitting ? "Submitting Application..." : "Submit Candidate Application"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "30px 10px" }}>
                <div className="icon" style={{ margin: "0 auto 20px", background: "#f0fdfa", color: "#0f766e", fontSize: 28, width: 64, height: 64, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  ✓
                </div>
                <h3 style={{ marginBottom: 12, fontSize: 20, color: "#0f172a" }}>Application Submitted Successfully!</h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
                  Thank you, <strong>{form.name}</strong>. Your clinical background and credentials have been submitted for faculty review by Dr. Janardhan Mydam. Once approved, you will be invited to complete tuition payment and unlock your live cohort schedule.
                </p>
                <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12 }}>
                  <Link href="/student/rotations" className="btn btn-primary btn-sm">
                    View in Student Rotation Dashboard →
                  </Link>
                  <Link href="/student-login" className="btn btn-outline btn-sm">
                    Student Login
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <span className="tag">End-to-End Enrollment Process</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
                <div>
                  <strong style={{ color: "#0f172a", display: "block" }}>1. Submit Candidate Application</strong>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>Provide medical school details, phone, CV/transcript document, and statement.</span>
                </div>
                <div>
                  <strong style={{ color: "#0f172a", display: "block" }}>2. Faculty Review &amp; Approval</strong>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>Admin reviews submission in the rotations queue and marks status as &ldquo;Approved &mdash; Payment Pending&rdquo;.</span>
                </div>
                <div>
                  <strong style={{ color: "#0f172a", display: "block" }}>3. Tuition Payment Confirmation</strong>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>Complete tuition checkout ($1,250) in your Student Portal to confirm your seat in the cohort.</span>
                </div>
                <div>
                  <strong style={{ color: "#0f172a", display: "block" }}>4. Cohort Live Access &amp; Teams Pro</strong>
                  <span style={{ fontSize: 12.5, color: "#64748b" }}>Access weekly live rounds on Microsoft Teams Pro, cloud recordings, oral examine calls, and attending LOR evaluations.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
