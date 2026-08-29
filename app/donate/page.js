"use client";

import { useState } from "react";

const AMOUNTS = [10, 25, 50, 100];

export default function DonatePage() {
  const [selected, setSelected] = useState(25);
  const [custom, setCustom] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const amount = custom ? Number(custom) : selected;

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="eyebrow">Donate</div>
          <h1 style={{ maxWidth: 720 }}>Keep every consultation free for the next student</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Dr. Doctor Name&apos;s time is given freely. Donations don&apos;t pay for
            consultations — they cover the cost of keeping this practice running: website
            hosting, mentorship resources, and the admin work behind every record we keep.
          </p>
        </div>
      </section>

      <section className="section tight">
        <div className="container hero-grid" style={{ alignItems: "flex-start" }}>
          <div className="form-card">
            {!submitted ? (
              <>
                <h3 style={{ marginBottom: 22 }}>Choose an amount</h3>
                <div className="donate-amount-grid" style={{ marginBottom: 18 }}>
                  {AMOUNTS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`donate-amount${!custom && selected === a ? " selected" : ""}`}
                      onClick={() => { setSelected(a); setCustom(""); }}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                <div className="field" style={{ marginBottom: 22 }}>
                  <label htmlFor="customAmount">Or enter a custom amount (USD)</label>
                  <input
                    id="customAmount"
                    type="number"
                    min="1"
                    placeholder="e.g. 75"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="dName">Name</label>
                    <input id="dName" type="text" placeholder="Your name" />
                  </div>
                  <div className="field">
                    <label htmlFor="dEmail">Email</label>
                    <input id="dEmail" type="email" placeholder="you@example.com" />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  disabled={!amount || amount <= 0}
                  onClick={() => setSubmitted(true)}
                >
                  Donate ${amount || 0}
                </button>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 14, textAlign: "center" }}>
                  This is a front-end preview — a real payment processor (e.g. Stripe or
                  PayPal Giving Fund) connects here once the backend is built.
                </p>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 10px" }}>
                <div className="icon" style={{ margin: "0 auto 20px", background: "var(--accent-soft)", color: "var(--accent)" }}>&#10003;</div>
                <h3 style={{ marginBottom: 12 }}>Thank you — ${amount} noted</h3>
                <p>This preview doesn&apos;t process real payments yet. Once live, you&apos;ll
                  receive a receipt and this contribution will count toward keeping the
                  practice&apos;s free consultations running.</p>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 14 }}>Where donations go</h3>
              <div className="allocation-row"><span>Website hosting &amp; maintenance</span><span>40%</span></div>
              <div className="allocation-row"><span>Mentorship resources (question bank, materials)</span><span>30%</span></div>
              <div className="allocation-row"><span>Admin &amp; record-keeping support</span><span>20%</span></div>
              <div className="allocation-row"><span>Reserve for future expansion</span><span>10%</span></div>
            </div>
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 12 }}>This year&apos;s goal</h3>
              <div className="progress-bar" style={{ marginBottom: 10 }}>
                <div className="progress-bar-fill" style={{ width: "38%" }} />
              </div>
              <p style={{ fontSize: 13 }}>$1,900 raised of a $5,000 annual goal (placeholder figures).</p>
            </div>
            <div className="card dark">
              <div className="icon">&#10084;</div>
              <h3>100% of consultations stay free</h3>
              <p>No donation is required to receive a consultation, join a rotation, or
                get mentorship — this fund exists purely to keep the lights on.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
