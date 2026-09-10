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

  const handleQuickDemo = async (personaKey) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/demo-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: personaKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed");

      if (personaKey === "admin") {
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
      setError("Email and password are mandatory fields (*)");
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
      if (!res.ok) throw new Error(data.error || "Login failed");

      if (data.user?.role === "admin" || data.user?.role === "super_admin") {
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
    <section className="section" style={{ paddingTop: 60, minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="grid grid-2" style={{ alignItems: "flex-start", gap: 40 }}>
          <div>
            <div className="eyebrow">Personalized Student Portal</div>
            <h1 style={{ marginBottom: 14, fontSize: "28px" }}>Log In to Your Learning Hub</h1>
            <p className="lede" style={{ marginBottom: 20, fontSize: "15px" }}>
              Access your personalized clinical curriculum, board-style question bank, research mentorship, and weekly live rounds.
            </p>

            {/* Quick 1-Click Persona Demonstration Box */}
            <div style={{ backgroundColor: "#F7F4EE", padding: "20px", borderRadius: 8, borderLeft: "4px solid var(--gold)", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", color: "var(--bg-navy)", marginBottom: 8 }}>
                ★ 1-Click Demo Persona Testing:
              </div>
              <p style={{ fontSize: 12.5, color: "#4B505C", marginBottom: 12 }}>
                Each persona renders a personalized dashboard driven strictly by their active module enrollments (Section E):
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("student_a")}
                  disabled={loading}
                  style={{ textAlign: "left", padding: "8px 12px", backgroundColor: "#FFFFFF", border: "1px solid #CBD2E1", borderRadius: 6, fontSize: "12px", cursor: "pointer" }}
                >
                  <strong>Student A (Alex Rivera):</strong> Clinical Rotation ONLY 🩺
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("student_b")}
                  disabled={loading}
                  style={{ textAlign: "left", padding: "8px 12px", backgroundColor: "#FFFFFF", border: "1px solid #CBD2E1", borderRadius: 6, fontSize: "12px", cursor: "pointer" }}
                >
                  <strong>Student B (Bethany Chen):</strong> Question Bank ONLY 📝
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("student_c")}
                  disabled={loading}
                  style={{ textAlign: "left", padding: "8px 12px", backgroundColor: "#FFFFFF", border: "1px solid #CBD2E1", borderRadius: 6, fontSize: "12px", cursor: "pointer" }}
                >
                  <strong>Student C (Carlos Mendez):</strong> QBank + Live Classes + Mentorship 🎓
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("student_d")}
                  disabled={loading}
                  style={{ textAlign: "left", padding: "8px 12px", backgroundColor: "#FFFFFF", border: "1px solid #CBD2E1", borderRadius: 6, fontSize: "12px", cursor: "pointer" }}
                >
                  <strong>Student D (Divya Patel):</strong> Research + Tele-Rotation 🔬
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("student_f")}
                  disabled={loading}
                  style={{ textAlign: "left", padding: "8px 12px", backgroundColor: "#FFFFFF", border: "1px solid #CBD2E1", borderRadius: 6, fontSize: "12px", cursor: "pointer" }}
                >
                  <strong>Student F (Fatima Al-Mansoor):</strong> All Programs (Full Scholar) 🌟
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin")}
                  disabled={loading}
                  style={{ textAlign: "left", padding: "8px 12px", backgroundColor: "#0B1E36", color: "#FFFFFF", border: "none", borderRadius: 6, fontSize: "12px", cursor: "pointer", fontWeight: 700 }}
                >
                  <strong>Super-Admin:</strong> Dr. Janardhan Mydam Command Center ⚙️
                </button>
              </div>
            </div>
          </div>

          <div className="form-card" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
            <h3 style={{ marginBottom: 20 }}>Portal Login</h3>
            {error && (
              <div className="form-note error" style={{ color: "#8A2A34", backgroundColor: "#FFEBEE", padding: 10, borderRadius: 6, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-row single">
                <div className="field">
                  <label htmlFor="lEmail">
                    Email Address <MandatoryStar />
                  </label>
                  <input
                    id="lEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="field">
                  <label htmlFor="lPass">
                    Password <MandatoryStar />
                  </label>
                  <input
                    id="lPass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? "Authenticating..." : "Log In to Portal"}
              </button>
            </form>
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", marginTop: 20 }}>
              Need an account?{" "}
              <Link href="/student-signup" style={{ color: "var(--accent)", fontWeight: 600 }}>
                Register for free access
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
