"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MandatoryStar from "@/components/MandatoryStar";

export default function StudentSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "Windsor University Medical Student",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.full_name || !formData.email || !formData.password) {
      setError("Full name, email address, and password are mandatory fields (*)");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify both password entries.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters in length.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          specialty: formData.specialty,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Redirect directly to the student dashboard
      router.push("/student-dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ paddingTop: 60, minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <div className="grid grid-2" style={{ alignItems: "center", gap: 50 }}>
          <div>
            <div className="eyebrow">Free Account Registration</div>
            <h1 style={{ marginBottom: 18 }}>Sign Up for Student &amp; Mentee Access</h1>
            <p className="lede" style={{ marginBottom: 24 }}>
              Register for direct access to our weekly online classes on Microsoft Teams, free board-style mock tests, and clinical mentorship.
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span className="pill accent">&#10003;</span>
                <span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>
                  Access live weekly classes &amp; Microsoft Teams join links
                </span>
              </li>
              <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span className="pill accent">&#10003;</span>
                <span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>
                  Take free clinical reasoning mock tests with complete rationales
                </span>
              </li>
              <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span className="pill accent">&#10003;</span>
                <span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>
                  Download lecture notes and submit clinical vignette assignments
                </span>
              </li>
            </ul>
          </div>

          <div className="form-card" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
            <h3 style={{ marginBottom: 20 }}>Create Account</h3>
            {error && (
              <div className="form-note error" style={{ color: "#8A2A34", backgroundColor: "#FFEBEE", padding: 10, borderRadius: 6, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-row single">
                <div className="field">
                  <label htmlFor="sName">
                    Full Legal Name <MandatoryStar />
                  </label>
                  <input
                    id="sName"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g. Dr. Jordan Alvarez"
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="field">
                  <label htmlFor="sEmail">
                    Email Address <MandatoryStar />
                  </label>
                  <input
                    id="sEmail"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="field">
                  <label htmlFor="sSpec">Specialty Track / Medical School</label>
                  <input
                    id="sSpec"
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g. Windsor University / Pediatric Resident"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="sPass">
                    Password <MandatoryStar />
                  </label>
                  <input
                    id="sPass"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <div className="field">
                  <label htmlFor="sPass2">
                    Confirm Password <MandatoryStar />
                  </label>
                  <input
                    id="sPass2"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 10 }}>
                {loading ? "Creating Your Account..." : "Register & Enter Student Dashboard"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", marginTop: 18 }}>
              Already registered?{" "}
              <Link href="/student-login" style={{ color: "var(--accent)", fontWeight: 600 }}>
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
