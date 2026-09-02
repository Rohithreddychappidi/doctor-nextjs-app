"use client";

import { useState } from "react";

export default function StudentLoginPage() {
  const [note, setNote] = useState("");
  return (
    <section className="section" style={{ paddingTop: 60 }}>
      <div className="container" style={{ maxWidth: 920 }}>
        <div className="grid grid-2" style={{ alignItems: "center", gap: 50 }}>
          <div>
            <div className="eyebrow">Student Login</div>
            <h1 style={{ marginBottom: 18 }}>Your dashboard for question bank, rotations and meetings</h1>
            <p className="lede" style={{ marginBottom: 26 }}>
              Log in to continue your question bank practice, check rotation status and
              join scheduled meetings. New here? Accounts are created after your first
              free consultation.
            </p>
          </div>
          <div className="form-card">
            <h3 style={{ marginBottom: 20 }}>Log in</h3>
            <form onSubmit={(e) => { e.preventDefault(); setNote("This is a front-end preview — account verification connects once the member system is built."); }}>
              <div className="form-row single">
                <div className="field"><label htmlFor="lEmail">Email</label><input id="lEmail" type="email" required placeholder="you@example.com" /></div>
              </div>
              <div className="form-row single">
                <div className="field"><label htmlFor="lPass">Password</label><input id="lPass" type="password" required placeholder="********" /></div>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Log In</button>
            </form>
            {note && <div className="form-note" style={{ marginTop: 18 }}>{note}</div>}
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", marginTop: 18 }}>
              No account yet? <a href="/student-signup" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign up here</a> if you've already been accepted into a program.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
