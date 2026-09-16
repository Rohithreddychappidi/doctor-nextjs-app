"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MandatoryStar from "@/components/MandatoryStar";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    function initGoogle() {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              setLoading(true);
              setError("");
              try {
                const res = await fetch("/api/auth/google", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ credential: response.credential, role: "student" }),
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
            }
          },
        });

        const btn = document.getElementById("google-signin-btn-container");
        if (btn) {
          btn.innerHTML = "";
          window.google.accounts.id.renderButton(btn, {
            theme: "outline",
            size: "large",
            width: "360",
            text: "continue_with",
            shape: "rectangular",
          });
        }
      }
    }

    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
  }, [router]);

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
        body: JSON.stringify({ email: email.trim(), password }),
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
      <div className="container" style={{ maxWidth: 500 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="eyebrow" style={{ color: "var(--accent)", fontWeight: 700, letterSpacing: "1px" }}>
            JVM MEDICAL SERVICES
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0B1E36", marginTop: 8, marginBottom: 8 }}>
            Sign In to Portal
          </h1>
          <p style={{ color: "#64748B", fontSize: "14.5px", lineHeight: 1.5 }}>
            Access clinical rotations, question banks, research discussions, and live seminars.
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
          {/* Real Google Single Sign-On */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div id="google-signin-btn-container" style={{ minHeight: "44px", width: "100%", display: "flex", justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => window.google?.accounts?.id?.prompt()}
                disabled={loading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "11px 20px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #CBD5E1",
                  borderRadius: "8px",
                  fontSize: "14.5px",
                  fontWeight: 600,
                  color: "#1E293B",
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", margin: "20px 0" }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }}></div>
            <span style={{ padding: "0 12px", color: "#94A3B8", fontSize: "12px", textTransform: "uppercase", fontWeight: 700 }}>
              or continue with email
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
                fontSize: "13.5px",
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
                fontSize: "14.5px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(138, 42, 52, 0.25)",
                transition: "background-color 0.2s ease",
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Clean Footer Link without Test Accounts */}
          <div style={{ textAlign: "center", marginTop: 24, paddingTop: 18, borderTop: "1px solid #F1F5F9", fontSize: "14px", color: "#64748B" }}>
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
