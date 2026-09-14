"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MandatoryStar from "@/components/MandatoryStar";
import CountryCodeSelect from "@/components/CountryCodeSelect";

export default function StudentSignupPage() {
  const router = useRouter();
  const [role, setRole] = useState("student"); // "student" | "guest"
  const [countryCode, setCountryCode] = useState("+1");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    medical_school: "",
    resume_url: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          demoEmail: role === "guest" ? "guest@jvmmedicalservices.com" : "student@jvmmedicalservices.com",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-up failed");

      if (role === "guest") {
        router.push("/research");
      } else {
        router.push("/student/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.full_name || !formData.email || !formData.password) {
      setError("Full name, email address, and password are mandatory (*)");
      return;
    }

    if (!formData.phone) {
      setError("Contact mobile number is mandatory (*)");
      return;
    }

    if (role === "student" && (!formData.description || !formData.resume_url)) {
      setError("Student description/aspirations and resume details are mandatory (*)");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          country_code: countryCode,
          resume_url: formData.resume_url,
          description: formData.description,
          medical_school: formData.medical_school,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-up failed");

      if (role === "guest") {
        router.push("/research");
      } else {
        router.push("/student/dashboard");
      }
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ paddingTop: 50, paddingBottom: 80, minHeight: "85vh", backgroundColor: "#FAF9F6" }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="eyebrow" style={{ color: "var(--accent)", fontWeight: 700, letterSpacing: "1px" }}>
            JVM MEDICAL SERVICES · PORTAL ONBOARDING
          </div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0B1E36", marginTop: 8, marginBottom: 12 }}>
            Create Your Portal Account
          </h1>
          <p style={{ color: "#64748B", fontSize: "16px", maxWidth: 560, margin: "0 auto" }}>
            Join our clinical education network as an active medical trainee or explore research and services as a registered guest.
          </p>
        </div>

        {/* Form Card Container */}
        <div
          className="auth-card"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 12px 35px rgba(11, 30, 54, 0.07)",
          }}
        >
          {/* Account Track Toggle */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1E293B", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              1. Choose Account Track <MandatoryStar />
            </label>
            <div className="auth-track-grid">
              <button
                type="button"
                onClick={() => setRole("student")}
                style={{
                  padding: "14px 18px",
                  borderRadius: "10px",
                  border: role === "student" ? "2px solid #8A2A34" : "1px solid #CBD5E1",
                  backgroundColor: role === "student" ? "#FDF2F4" : "#FFFFFF",
                  color: role === "student" ? "#8A2A34" : "#475569",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "20px" }}>🎓</span>
                <div style={{ textAlign: "left" }}>
                  <div>Medical Student / Trainee</div>
                  <div style={{ fontSize: "12px", fontWeight: 400, opacity: 0.85 }}>Rotations, QBank, Classes &amp; Research</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("guest")}
                style={{
                  padding: "14px 18px",
                  borderRadius: "10px",
                  border: role === "guest" ? "2px solid #B4832A" : "1px solid #CBD5E1",
                  backgroundColor: role === "guest" ? "#FFFBF0" : "#FFFFFF",
                  color: role === "guest" ? "#B4832A" : "#475569",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.2s ease",
                }}
              >
                <span style={{ fontSize: "20px" }}>👥</span>
                <div style={{ textAlign: "left" }}>
                  <div>Guest / General Visitor</div>
                  <div style={{ fontSize: "12px", fontWeight: 400, opacity: 0.85 }}>Research Discussions &amp; Practice Insights</div>
                </div>
              </button>
            </div>
          </div>

          {/* Google 1-Click Onboarding */}
          <div style={{ marginBottom: 28, textAlign: "center" }}>
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "13px 20px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #CBD5E1",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#1E293B",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.347 2.825.957 4.039l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google ({role === "student" ? "as Student" : "as Guest"})
            </button>
            <div style={{ display: "flex", alignItems: "center", margin: "22px 0" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
              <span style={{ padding: "0 16px", fontSize: "12px", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>
                Or fill details below
              </span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#991B1B",
                padding: "12px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: 20,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Common Fields: Name & Email */}
            <div className="form-row-2col">
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Full Name <MandatoryStar />
                </label>
                <input
                  type="text"
                  placeholder={role === "student" ? "e.g. Alex Rivera" : "e.g. Michael Jordan"}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    fontSize: "14px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "6px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Email Address <MandatoryStar />
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    fontSize: "14px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "6px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
            </div>

            {/* Password & Mobile Number with Searchable Country Code */}
            <div className="form-row-2col">
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Create Password <MandatoryStar />
                </label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: "100%",
                    height: "44px",
                    padding: "0 14px",
                    fontSize: "14px",
                    border: "1px solid #CBD5E1",
                    borderRadius: "6px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                  Contact Mobile Number <MandatoryStar />
                </label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                  <input
                    type="tel"
                    placeholder="e.g. 555-0199"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      flex: 1,
                      height: "44px",
                      padding: "0 14px",
                      fontSize: "14px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "0 6px 6px 0",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Student Specific Fields */}
            {role === "student" && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Medical School / Institution
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Windsor University School of Medicine"
                    value={formData.medical_school}
                    onChange={(e) => setFormData({ ...formData, medical_school: e.target.value })}
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 14px",
                      fontSize: "14px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "6px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Resume / CV (Drive Link, URL or File Note) <MandatoryStar />
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. https://drive.google.com/... or 'CV on file / emailed'"
                    value={formData.resume_url}
                    onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 14px",
                      fontSize: "14px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "6px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                    Academic Description &amp; Clinical Goals <MandatoryStar />
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your current USMLE stage, clinical clerkships completed, and specialty aspirations..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      fontSize: "14px",
                      border: "1px solid #CBD5E1",
                      borderRadius: "6px",
                      outline: "none",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                    }}
                    required
                  />
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                backgroundColor: role === "student" ? "#8A2A34" : "#B4832A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "background-color 0.2s ease",
              }}
            >
              {loading
                ? "Setting up your account..."
                : role === "student"
                ? "Complete Student Registration & Access Dashboard →"
                : "Join as Guest & Explore →"}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ textAlign: "center", marginTop: 24, fontSize: "14px", color: "#64748B" }}>
            Already have an account?{" "}
            <Link href="/student-login" style={{ color: "#8A2A34", fontWeight: 700, textDecoration: "underline" }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
