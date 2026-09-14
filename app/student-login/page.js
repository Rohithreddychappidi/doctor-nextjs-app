"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MandatoryStar from "@/components/MandatoryStar";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleQuickFill = (fillEmail, fillPass) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError("");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "student",
          demoEmail: "student@jvmmedicalservices.com",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Google sign-in failed");

      if (data.user?.role === "admin" || data.user?.role === "super_admin" || data.user?.role === "sub_admin") {
        router.push("/admin");
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

    if (!email || !password) {
      setError("Email and password are required (*)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");

      if (data.user?.role === "admin" || data.user?.role === "super_admin" || data.user?.role === "sub_admin") {
        router.push("/admin");
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
    <section className="section" style={{ paddingTop: 60, paddingBottom: 80, minHeight: "85vh", backgroundColor: "#FAF9F6" }}>
      <div className="container" style={{ maxWidth: 520 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="eyebrow" style={{ color: "var(--accent)", fontWeight: 700, letterSpacing: "1px" }}>
            JVM MEDICAL SERVICES
          </div>
          <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#0B1E36", marginTop: 8, marginBottom: 8 }}>
            Sign In to Portal
          </h1>
          <p style={{ color: "#64748B", fontSize: "15px" }}>
            Access clinical rotations, research discussions, live seminars, and academic programs.
          </p>
        </div>

        {/* Login Card */}
        <div
          className="auth-card"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 10px 30px rgba(11, 30, 54, 0.06)",
          }}
        >
          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "12px 20px",
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
            Continue with Google
          </button>

          <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
            <span style={{ padding: "0 14px", fontSize: "12px", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>
              Or sign in with email
            </span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
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
                marginBottom: 18,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                Email Address <MandatoryStar />
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#334155" }}>
                  Password <MandatoryStar />
                </label>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                backgroundColor: "#8A2A34",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(138, 42, 52, 0.25)",
                transition: "background-color 0.2s ease",
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Clean 3 Test Credentials Section */}
          <div style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 10, textAlign: "center" }}>
              Quick Test Credentials (1-Click Fill)
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                type="button"
                onClick={() => handleQuickFill("student@jvmmedicalservices.com", "Student@2026")}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>🎓 <strong>Student Portal</strong>: student@jvmmedicalservices.com</span>
                <span style={{ color: "#8A2A34", fontWeight: 600 }}>Fill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("guest@jvmmedicalservices.com", "Guest@2026")}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>👥 <strong>Guest Access</strong>: guest@jvmmedicalservices.com</span>
                <span style={{ color: "#B4832A", fontWeight: 600 }}>Fill</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("admin@jvmmedicalservices.com", "Admin@2026")}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>👨‍⚕️ <strong>Admin Portal</strong>: admin@jvmmedicalservices.com</span>
                <span style={{ color: "#0B1E36", fontWeight: 600 }}>Fill</span>
              </button>
            </div>
          </div>

          {/* Footer Link */}
          <div style={{ textAlign: "center", marginTop: 22, fontSize: "14px", color: "#64748B" }}>
            New to JVM Medical?{" "}
            <Link href="/student-signup" style={{ color: "#8A2A34", fontWeight: 700, textDecoration: "underline" }}>
              Sign Up as Student or Guest
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
