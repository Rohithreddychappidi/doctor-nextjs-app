"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MandatoryStar from "@/components/MandatoryStar";
import CountryCodeSelect from "@/components/CountryCodeSelect";

export default function StudentRotationsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orientation"); // orientation | meetings | notes | examination | recorded
  const [paying, setPaying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  const [countryCode, setCountryCode] = useState("+1");
  const [intakeForm, setIntakeForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    medical_school: "",
    graduation_year: "2026",
    usmle_status: "Step 1 Pass (Pre-Step 2 CK)",
    specialty_interest: "Pediatrics & Neonatal-Perinatal Medicine",
    timing_preference: "Evenings CST (Flexible)",
    cv_url: "",
    deans_letter_url: "",
    immunization_note: "Standard medical student immunizations & TB testing current",
    personal_statement: "",
  });

  const loadData = async () => {
    try {
      const res = await fetch("/api/student/rotations");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.application) {
          setIntakeForm({
            full_name: json.application.applicant_name || "",
            email: json.application.applicant_email || "",
            phone: json.application.applicant_phone || "",
            medical_school: json.application.medical_school || "",
            graduation_year: json.application.graduation_year || "2026",
            usmle_status: json.application.usmle_status || "Step 1 Pass (Pre-Step 2 CK)",
            specialty_interest: json.application.specialty_interest || "Pediatrics & Neonatal-Perinatal Medicine",
            timing_preference: json.application.timing_preference || "Evenings CST (Flexible)",
            cv_url: json.application.cv_url || "",
            deans_letter_url: json.application.deans_letter_url || "",
            immunization_note: json.application.immunization_note || "Standard medical student immunizations & TB testing current",
            personal_statement: json.application.personal_statement || "",
          });
        }
      }
    } catch (err) {
      console.error("Rotations error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIntakeSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!intakeForm.full_name || !intakeForm.email || !intakeForm.medical_school || !intakeForm.personal_statement) {
      setErrorMsg("Full name, email, medical school, and personal statement are mandatory (*).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/student/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply_intake",
          ...intakeForm,
          phone: `${countryCode} ${intakeForm.phone}`.trim(),
        }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Submission failed");

      setSuccessMsg("Application & credentials submitted successfully to Dr. Janardhan Mydam for review!");
      setShowEditForm(false);
      await loadData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayTuition = async () => {
    setPaying(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/student/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pay_tuition" }),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Payment processing failed");

      setSuccessMsg("Tuition payment confirmed! Your clinical rotation seat is active.");
      await loadData();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "#64748B" }}>
        <div style={{ width: 36, height: 36, border: "4px solid #0B1E36", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: "14px", fontWeight: 600 }}>Loading Clinical Rotation verification status...</p>
        <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const app = data?.application;
  const isEnrolled = !!data?.is_enrolled;
  const isUnderReview = app && app.status === "Under Review";
  const isApprovedPendingPay = app && (app.status === "Approved" || app.status === "Approved - Payment Pending") && app.tier_type === "paid" && app.payment_status !== "Paid";
  const isApprovedFree = app && app.status === "Approved" && app.tier_type === "free";

  // =========================================================================
  // STATE 1 & 2: NO APPLICATION OR EDITING INTAKE FORM
  // =========================================================================
  if (!app || showEditForm) {
    return (
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "30px 16px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, backgroundColor: "#EEF2F6", color: "#0B1E36", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 10 }}>
            🩺 US Clinical Experience · Pre-Rotation Verification
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0B1E36", margin: "0 0 8px" }}>
            Clinical Rotation Verification &amp; Intake
          </h1>
          <p style={{ color: "#64748B", fontSize: "14.5px", maxWidth: 640, margin: "0 auto", lineHeight: 1.5 }}>
            To ensure patient safety, HIPAA compliance, and institutional credentialing, all prospective trainees must submit their academic credentials for direct review and approval by <strong>Dr. Janardhan Mydam, MD, FAAP</strong>.
          </p>
        </div>

        {errorMsg && (
          <div style={{ padding: "12px 16px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", borderRadius: 8, fontSize: "14px", marginBottom: 20 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: "12px 16px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", color: "#166534", borderRadius: 8, fontSize: "14px", marginBottom: 20 }}>
            ✓ {successMsg}
          </div>
        )}

        {/* Medical Intake Form */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", padding: "28px 24px", boxShadow: "0 8px 30px rgba(11, 30, 54, 0.05)" }}>
          <form onSubmit={handleIntakeSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Full Candidate Name <MandatoryStar />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera, MD Candidate"
                  value={intakeForm.full_name}
                  onChange={(e) => setIntakeForm({ ...intakeForm, full_name: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Email Address <MandatoryStar />
                </label>
                <input
                  type="email"
                  placeholder="candidate@university.edu"
                  value={intakeForm.email}
                  onChange={(e) => setIntakeForm({ ...intakeForm, email: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Contact Mobile Number <MandatoryStar />
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                  <input
                    type="tel"
                    placeholder="555-0192"
                    value={intakeForm.phone}
                    onChange={(e) => setIntakeForm({ ...intakeForm, phone: e.target.value })}
                    style={{ flex: 1, height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: "0 6px 6px 0", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Medical School / Institution <MandatoryStar />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Windsor University School of Medicine"
                  value={intakeForm.medical_school}
                  onChange={(e) => setIntakeForm({ ...intakeForm, medical_school: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Graduation Year
                </label>
                <input
                  type="text"
                  placeholder="2026"
                  value={intakeForm.graduation_year}
                  onChange={(e) => setIntakeForm({ ...intakeForm, graduation_year: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  USMLE Status
                </label>
                <select
                  value={intakeForm.usmle_status}
                  onChange={(e) => setIntakeForm({ ...intakeForm, usmle_status: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", backgroundColor: "#FFF", boxSizing: "border-box" }}
                >
                  <option value="Step 1 Pass (Pre-Step 2 CK)">Step 1 Pass (Pre-Step 2 CK)</option>
                  <option value="Step 1 & Step 2 CK Completed">Step 1 &amp; Step 2 CK Completed</option>
                  <option value="Pre-Clinical / Clinical Clerkships">Pre-Clinical / Clerkships</option>
                  <option value="International Medical Graduate (IMG)">International Medical Graduate (IMG)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Target Specialty Track
                </label>
                <select
                  value={intakeForm.specialty_interest}
                  onChange={(e) => setIntakeForm({ ...intakeForm, specialty_interest: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", backgroundColor: "#FFF", boxSizing: "border-box" }}
                >
                  <option value="Pediatrics & Neonatal-Perinatal Medicine">Pediatrics &amp; Neonatology</option>
                  <option value="Pediatric Critical Care (PICU)">Pediatric Critical Care (PICU)</option>
                  <option value="General Outpatient Pediatrics">General Outpatient Pediatrics</option>
                  <option value="Pediatric Cardiology">Pediatric Cardiology</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  CV / Resume Link (Google Drive / Dropbox or URL) <MandatoryStar />
                </label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/your-cv.pdf"
                  value={intakeForm.cv_url}
                  onChange={(e) => setIntakeForm({ ...intakeForm, cv_url: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Dean&apos;s Letter / Student ID / MSPE Link
                </label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/deans-letter.pdf"
                  value={intakeForm.deans_letter_url}
                  onChange={(e) => setIntakeForm({ ...intakeForm, deans_letter_url: e.target.value })}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Immunization &amp; Health Clearance Status
              </label>
              <input
                type="text"
                placeholder="e.g. MMR, Hepatitis B, Tdap, and current TB Quantiferon on file"
                value={intakeForm.immunization_note}
                onChange={(e) => setIntakeForm({ ...intakeForm, immunization_note: e.target.value })}
                style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Personal Statement &amp; Clinical Rotation Goals <MandatoryStar />
              </label>
              <textarea
                rows={4}
                placeholder="Describe your current clinical clerkships, your goals during neonatal tele-rounds with Dr. Mydam, and what residency match specialty you are pursuing..."
                value={intakeForm.personal_statement}
                onChange={(e) => setIntakeForm({ ...intakeForm, personal_statement: e.target.value })}
                style={{ width: "100%", padding: "12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "14px 20px",
                backgroundColor: "#0B1E36",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "15px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(11, 30, 54, 0.15)",
                transition: "background-color 0.2s ease",
              }}
            >
              {submitting ? "Submitting to Dr. Janardhan Mydam..." : "Submit for Clinical Faculty Review & Verification →"}
            </button>

            {showEditForm && (
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                style={{ width: "100%", marginTop: 10, padding: "10px", backgroundColor: "transparent", border: "1px solid #CBD5E1", borderRadius: 8, color: "#64748B", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}
              >
                Cancel &amp; Return to Status View
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 2: APPLICATION UNDER DOCTOR REVIEW
  // =========================================================================
  if (isUnderReview) {
    return (
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "40px 16px 60px" }}>
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "36px 28px", textAlign: "center", boxShadow: "0 8px 30px rgba(11, 30, 54, 0.05)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#FFFBEB", border: "2px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>
            ⏳
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, backgroundColor: "#FEF3C7", color: "#92400E", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
            ● Under Faculty Verification
          </div>

          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0B1E36", margin: "0 0 10px" }}>
            Clinical Rotation Intake Under Review
          </h2>

          <p style={{ color: "#64748B", fontSize: "15px", lineHeight: 1.6, maxWidth: 580, margin: "0 auto 24px" }}>
            Your clinical background, verification documents, and medical school status submitted on <strong>{new Date(app.applied_at || Date.now()).toLocaleDateString()}</strong> are currently being personally evaluated by <strong>Dr. Janardhan Mydam, MD, FAAP</strong>.
          </p>

          {/* Details Summary Card */}
          <div style={{ backgroundColor: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", padding: "18px", textAlign: "left", maxWidth: 560, margin: "0 auto 24px", fontSize: "13.5px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", rowGap: 8, color: "#475569" }}>
              <div style={{ fontWeight: 600, color: "#0B1E36" }}>Applicant:</div>
              <div>{app.applicant_name} ({app.applicant_email})</div>
              <div style={{ fontWeight: 600, color: "#0B1E36" }}>Medical School:</div>
              <div>{app.medical_school} ({app.graduation_year || "2026"})</div>
              <div style={{ fontWeight: 600, color: "#0B1E36" }}>Specialty Track:</div>
              <div>{app.specialty_interest}</div>
              <div style={{ fontWeight: 600, color: "#0B1E36" }}>USMLE Status:</div>
              <div>{app.usmle_status}</div>
              <div style={{ fontWeight: 600, color: "#0B1E36" }}>CV Document:</div>
              <div>
                <a href={app.cv_url} target="_blank" rel="noopener noreferrer" style={{ color: "#0284C7", textDecoration: "underline" }}>
                  View Submitted Resume / CV ↗
                </a>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <button
              onClick={() => setShowEditForm(true)}
              style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #CBD5E1", backgroundColor: "#FFF", color: "#334155", fontWeight: 600, fontSize: "13.5px", cursor: "pointer" }}
            >
              ✏️ Update Submitted Details
            </button>
            <Link
              href="/education-training/tele-rotations"
              style={{ padding: "10px 18px", borderRadius: 8, border: "none", backgroundColor: "#EEF2F6", color: "#0B1E36", fontWeight: 600, fontSize: "13.5px", textDecoration: "none" }}
            >
              Explore Curriculum Syllabus →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 3: APPROVED BUT PAYMENT PENDING (IF PAID TIER)
  // =========================================================================
  if (isApprovedPendingPay) {
    return (
      <div style={{ maxWidth: 740, margin: "0 auto", padding: "40px 16px 60px" }}>
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, border: "1px solid #BBF7D0", padding: "36px 28px", textAlign: "center", boxShadow: "0 8px 30px rgba(11, 30, 54, 0.06)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#F0FDF4", border: "2px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 16px" }}>
            🎉
          </div>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: 20, backgroundColor: "#DCFCE7", color: "#166534", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
            ✓ Verified &amp; Approved by Dr. Janardhan Mydam
          </div>

          <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#0B1E36", margin: "0 0 10px" }}>
            Congratulations! You are Approved for Clinical Tele-Rotation
          </h2>

          <p style={{ color: "#64748B", fontSize: "15px", lineHeight: 1.6, maxWidth: 580, margin: "0 auto 24px" }}>
            Dr. Mydam has reviewed and verified your credentials. To confirm your clinical seat in the upcoming cohort and activate Microsoft Teams Pro rounds, please complete the tuition confirmation below.
          </p>

          {errorMsg && (
            <div style={{ padding: "10px 14px", backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", borderRadius: 8, fontSize: "13.5px", marginBottom: 16 }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Tuition Breakdown Card */}
          <div style={{ backgroundColor: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", padding: "22px", textAlign: "left", maxWidth: 520, margin: "0 auto 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: 14, marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 800, color: "#0B1E36", fontSize: "16px" }}>6-Week Clinical Tele-Rotation Tuition</div>
                <div style={{ fontSize: "12.5px", color: "#64748B" }}>Attending Preceptorship &amp; LOR Eligibility</div>
              </div>
              <div style={{ fontSize: "26px", fontWeight: 900, color: "#0B1E36" }}>${app.tuition_fee || 1250}</div>
            </div>

            <ul style={{ fontSize: "13px", color: "#475569", margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Direct live bedside rounds on Microsoft Teams with Dr. Janardhan Mydam</li>
              <li>1-on-1 Graded Examine Calls with clinical rubric evaluation</li>
              <li>Complete access to Orientation, Weekly Case Notes &amp; Examination</li>
              <li>Full access to Recorded Clinical Lecture Archives</li>
              <li>Merit-based Attending Physician Letter of Recommendation (LOR)</li>
            </ul>
          </div>

          <button
            onClick={handlePayTuition}
            disabled={paying}
            style={{
              padding: "15px 36px",
              backgroundColor: "#166534",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "15px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(22, 101, 52, 0.25)",
              transition: "all 0.2s ease",
            }}
          >
            {paying ? "Confirming Seat & Activating Cohort..." : `💳 Confirm Seat & Pay Tuition ($${app.tuition_fee || 1250}) →`}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STATE 4: APPROVED & ACTIVE (OR FREE) — FULL PHASED ROTATION HUB
  // =========================================================================
  const orientation = data?.orientation;
  const weeklyMeetings = data?.weekly_meetings || [];
  const clinicalNotes = data?.clinical_notes || [];
  const examination = data?.examination;
  const recordedSessions = data?.recorded_sessions || [];

  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 16px 60px" }}>
      {/* Header Banner */}
      <div style={{ backgroundColor: "#0B1E36", borderRadius: 14, padding: "26px 28px", color: "#FFFFFF", marginBottom: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 12, backgroundColor: "rgba(255,255,255,0.12)", color: "#93C5FD", fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
            ● Active Clinical Experience Cohort
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: "0 0 4px" }}>
            Clinical Rotation &amp; Tele-Rounds Hub
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "13.5px", margin: 0 }}>
            Supervising Attending: <strong>Dr. Janardhan Mydam, MD, FAAP</strong> · Preceptor in Neonatal-Perinatal Medicine
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a
            href={weeklyMeetings[0]?.teams_url || "https://teams.microsoft.com"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              borderRadius: 8,
              fontSize: "13px",
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
            }}
          >
            <span>📹</span> Join Live Rounds (Teams)
          </a>
        </div>
      </div>

      {/* Navigation Sub-sections (Tabs) */}
      <div style={{ display: "flex", gap: 6, borderBottom: "2px solid #E2E8F0", paddingBottom: 0, marginBottom: 24, overflowX: "auto" }}>
        {[
          { key: "orientation", label: "1. Orientation Phase", icon: "📋" },
          { key: "meetings", label: "2. Weekly Learnings", icon: "🗓️" },
          { key: "notes", label: "3. Clinical Notes", icon: "📝" },
          { key: "examination", label: "4. Examination & OSCE", icon: "🩺" },
          { key: "recorded", label: "5. Recorded Sessions", icon: "🎥" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              border: "none",
              borderBottom: activeTab === tab.key ? "3px solid #0B1E36" : "3px solid transparent",
              backgroundColor: "transparent",
              color: activeTab === tab.key ? "#0B1E36" : "#64748B",
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: "14px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease",
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: ORIENTATION PHASE */}
      {activeTab === "orientation" && (
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "26px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0B1E36", marginTop: 0, marginBottom: 12 }}>
            Phase 1: Pre-Rotation Clinical Orientation &amp; Code of Conduct
          </h2>
          <p style={{ color: "#64748B", fontSize: "14px", lineHeight: 1.6, marginBottom: 20 }}>
            Welcome to the virtual neonatal intensive care unit (NICU) and pediatric clinical training program. Complete the items below before your first live bedside round with Dr. Mydam.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 24 }}>
            <div style={{ padding: 18, backgroundColor: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
              <div style={{ fontWeight: 700, color: "#0B1E36", fontSize: "14px", marginBottom: 10 }}>
                🎯 Core Learning Objectives
              </div>
              <ul style={{ fontSize: "13px", color: "#475569", paddingLeft: 16, margin: 0, lineHeight: 1.7 }}>
                {orientation?.objectives?.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div style={{ padding: 18, backgroundColor: "#FEF2F2", borderRadius: 10, border: "1px solid #FECACA" }}>
              <div style={{ fontWeight: 700, color: "#991B1B", fontSize: "14px", marginBottom: 10 }}>
                ⚖️ HIPAA &amp; Clinical Professionalism Rules
              </div>
              <ul style={{ fontSize: "13px", color: "#7F1D1D", paddingLeft: 16, margin: 0, lineHeight: 1.7 }}>
                {orientation?.rules?.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/education-training/tele-rotations"
              target="_blank"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 8, backgroundColor: "#EEF2F6", color: "#0B1E36", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}
            >
              📄 View Full Curriculum Syllabus ↗
            </a>
            <button
              onClick={() => setActiveTab("meetings")}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8, backgroundColor: "#0B1E36", color: "#FFF", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              Proceed to Weekly Learnings →
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: WEEKLY MEETINGS & LIVE LEARNINGS */}
      {activeTab === "meetings" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {weeklyMeetings.map((m) => (
            <div key={m.week} style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                <div>
                  <div style={{ display: "inline-block", padding: "2px 8px", backgroundColor: "#EEF2F6", color: "#0B1E36", fontSize: "11px", fontWeight: 700, borderRadius: 4, marginBottom: 6 }}>
                    WEEK {m.week}
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0B1E36", margin: "0 0 4px" }}>
                    {m.title}
                  </h3>
                  <div style={{ fontSize: "13px", color: "#64748B" }}>
                    🗓️ Schedule: <strong>{m.schedule}</strong>
                  </div>
                </div>

                <a
                  href={m.teams_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", backgroundColor: "#2563EB", color: "#FFF", fontSize: "13px", fontWeight: 700, borderRadius: 6, textDecoration: "none" }}
                >
                  Join Teams Session
                </a>
              </div>

              <div style={{ backgroundColor: "#F8FAFC", borderRadius: 8, padding: "12px 16px", fontSize: "13px", color: "#334155" }}>
                <div style={{ fontWeight: 700, color: "#0B1E36", marginBottom: 6 }}>Key Clinical Discussion Milestones:</div>
                <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.6 }}>
                  {m.learning_points?.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: CLINICAL NOTES VAULT */}
      {activeTab === "notes" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "12px 18px", backgroundColor: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8, color: "#0369A1", fontSize: "13.5px" }}>
            💡 <strong>Attending Clinical Notes Vault:</strong> High-yield pearls, guideline summaries, and bedside teaching points entered directly by Dr. Janardhan Mydam.
          </div>

          {clinicalNotes.map((note) => (
            <div key={note.id} style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#EEF2F6", color: "#0B1E36", borderRadius: 4 }}>
                  {note.category}
                </span>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>{note.date}</span>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0B1E36", margin: "0 0 8px" }}>
                {note.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6, margin: "0 0 12px" }}>
                {note.content}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {note.tags?.map((t) => (
                  <span key={t} style={{ fontSize: "11px", color: "#64748B", backgroundColor: "#F1F5F9", padding: "2px 8px", borderRadius: 4 }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: EXAMINATION & OSCE */}
      {activeTab === "examination" && (
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "26px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "#0B1E36", marginTop: 0, marginBottom: 12 }}>
            Phase 4: Examination, OSCE Simulation &amp; Evaluation Rubric
          </h2>
          <p style={{ color: "#64748B", fontSize: "14px", lineHeight: 1.6, marginBottom: 20 }}>
            Trainee evaluation is merit-based and follows the ACGME core competencies framework.
          </p>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: "#0B1E36", fontSize: "14px", marginBottom: 10 }}>
              📊 Clinical Grading Rubric
            </div>
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden" }}>
              {examination?.grading_rubric?.map((g, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: i < examination.grading_rubric.length - 1 ? "1px solid #E2E8F0" : "none", backgroundColor: i % 2 === 0 ? "#FFF" : "#F8FAFC", fontSize: "13.5px" }}>
                  <div style={{ color: "#334155", fontWeight: 500 }}>{g.component}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontWeight: 700, color: "#0B1E36" }}>{g.weight}</span>
                    <span style={{ fontSize: "12px", padding: "2px 8px", borderRadius: 10, backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: 600 }}>{g.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10 }}>
            <div>
              <div style={{ fontWeight: 800, color: "#166534", fontSize: "14.5px" }}>Attending Letter of Recommendation (LOR) Status</div>
              <div style={{ fontSize: "13px", color: "#15803D" }}>{examination?.lor_eligibility}</div>
            </div>
            <Link
              href="/student/qbank"
              style={{ padding: "8px 16px", backgroundColor: "#166534", color: "#FFF", fontWeight: 700, fontSize: "13px", borderRadius: 6, textDecoration: "none" }}
            >
              Practice Question Bank →
            </Link>
          </div>
        </div>
      )}

      {/* TAB 5: RECORDED SESSIONS ARCHIVE */}
      {activeTab === "recorded" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "12px 18px", backgroundColor: "#FAF5FF", border: "1px solid #E9D5FF", borderRadius: 8, color: "#6B21A8", fontSize: "13.5px" }}>
            🎥 <strong>Curated Recorded Sessions Archive:</strong> Review clinical conference and morning bedside rounds recordings manually curated by the faculty.
          </div>

          {recordedSessions.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#FFF", borderRadius: 12, border: "1px solid #E2E8F0", color: "#64748B" }}>
              <div style={{ fontSize: "32px", marginBottom: 8 }}>📹</div>
              <div style={{ fontWeight: 700, color: "#0B1E36", fontSize: "15px" }}>No recordings uploaded yet</div>
              <p style={{ fontSize: "13px", margin: "4px 0 0" }}>New clinical lecture recordings will appear here as sessions conclude.</p>
            </div>
          ) : (
            recordedSessions.map((rec) => (
              <div key={rec.id} style={{ backgroundColor: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", backgroundColor: "#EEF2F6", color: "#0B1E36", borderRadius: 4, marginRight: 8 }}>
                      SESSION RECORDING
                    </span>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>🗓️ {rec.date} · ⏱️ {rec.duration}</span>
                    <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0B1E36", margin: "8px 0 4px" }}>
                      {rec.title}
                    </h3>
                    <div style={{ fontSize: "13px", color: "#475569" }}>
                      Preceptor: <strong>{rec.preceptor}</strong>
                    </div>
                  </div>

                  <a
                    href={rec.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "9px 16px",
                      backgroundColor: "#7C3AED",
                      color: "#FFFFFF",
                      fontSize: "13px",
                      fontWeight: 700,
                      borderRadius: 6,
                      textDecoration: "none",
                      boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
                    }}
                  >
                    ▶ Watch Recording
                  </a>
                </div>

                {rec.notes && (
                  <p style={{ fontSize: "13px", color: "#64748B", margin: "8px 0", lineHeight: 1.5 }}>
                    {rec.notes}
                  </p>
                )}

                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {rec.tags?.map((t) => (
                    <span key={t} style={{ fontSize: "11px", color: "#6B21A8", backgroundColor: "#F3E8FF", padding: "2px 8px", borderRadius: 4 }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
