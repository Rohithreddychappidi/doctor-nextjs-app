"use client";

import { useState } from "react";
import Link from "next/link";

export default function StudentSignupPage() {
  const [note, setNote] = useState("");
  return (
    <section className="section" style={{ paddingTop: 60 }}>
      <div className="container" style={{ maxWidth: 920 }}>
        <div className="grid grid-2" style={{ alignItems: "center", gap: 50 }}>
          <div>
            <div className="eyebrow">Create Your Account</div>
            <h1 style={{ marginBottom: 18 }}>Sign up for your Student Login</h1>
            <p className="lede" style={{ marginBottom: 26 }}>
              For accepted Tele-Rotation, Physical Rotation, or Question Bank students.
              If you haven&apos;t applied yet, start with the program&apos;s application
              form first — accounts are created after acceptance.
            </p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}><span className="pill accent">&#10003;</span><span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>Access your Tele-Rotation Learning Hub, week by week</span></li>
              <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}><span className="pill accent">&#10003;</span><span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>See live session links as soon as they&apos;re generated</span></li>
              <li style={{ display: "flex", gap: 12, alignItems: "flex-start" }}><span className="pill accent">&#10003;</span><span style={{ color: "var(--ink-soft)", fontSize: 14.5 }}>Track question bank progress and rotation status</span></li>
            </ul>
          </div>

          <div className="form-card">
            <h3 style={{ marginBottom: 22 }}>Sign up</h3>
            <form onSubmit={(e) => { e.preventDefault(); setNote("This is a front-end preview — real account creation connects once the member system and backend are built."); }}>
              <div className="form-row single">
                <div className="field"><label htmlFor="sName">Full name</label><input id="sName" type="text" required placeholder="Jordan Alvarez" /></div>
              </div>
              <div className="form-row single">
                <div className="field"><label htmlFor="sEmail">Email</label><input id="sEmail" type="email" required placeholder="you@example.com" /></div>
              </div>
              <div className="form-row">
                <div className="field"><label htmlFor="sPass">Password</label><input id="sPass" type="password" required placeholder="••••••••" /></div>
                <div className="field"><label htmlFor="sPass2">Confirm password</label><input id="sPass2" type="password" required placeholder="••••••••" /></div>
              </div>
              <button type="submit" className="btn btn-primary btn-block">Create Account</button>
            </form>
            {note && <div className="form-note" style={{ marginTop: 18 }}>{note}</div>}
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", marginTop: 18 }}>
              Already have an account? <Link href="/student-login" style={{ color: "var(--accent)", fontWeight: 600 }}>Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
