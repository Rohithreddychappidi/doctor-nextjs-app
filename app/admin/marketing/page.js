"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import MandatoryStar from "@/components/MandatoryStar";

export default function AdminMarketingPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Promo Settings
  const [promoTitle, setPromoTitle] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [promoCta, setPromoCta] = useState("");
  const [promoLink, setPromoLink] = useState("");
  const [promoActive, setPromoActive] = useState(true);

  // Email Campaign Form
  const [emailSubject, setEmailSubject] = useState("");
  const [emailHeadline, setEmailHeadline] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailCtaText, setEmailCtaText] = useState("");
  const [emailCtaUrl, setEmailCtaUrl] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [savingPromo, setSavingPromo] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const loadPromos = async () => {
    try {
      const res = await fetch("/api/marketing");
      if (res.ok) {
        const d = await res.json();
        setPromotions(d.promotions || []);
        if (d.promotions && d.promotions[0]) {
          const p = d.promotions[0];
          setPromoTitle(p.title);
          setPromoMsg(p.message);
          setPromoCta(p.cta_text);
          setPromoLink(p.cta_link);
          setPromoActive(Boolean(p.is_active));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromos();
  }, []);

  const handleSavePromo = async (e) => {
    e.preventDefault();
    setSavingPromo(true);
    setStatusMsg("");
    try {
      const targetId = promotions[0]?.id || "promo_1";
      const res = await fetch("/api/marketing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: targetId,
          title: promoTitle,
          message: promoMsg,
          cta_text: promoCta,
          cta_link: promoLink,
          is_active: promoActive,
        }),
      });
      if (!res.ok) throw new Error("Failed to update promotion");
      setStatusMsg("Promotional popup settings saved successfully!");
      loadPromos();
    } catch (err) {
      alert("Error saving promo: " + err.message);
    } finally {
      setSavingPromo(false);
    }
  };

  const handleSendEmailCampaign = async (e) => {
    e.preventDefault();
    if (!emailSubject || !emailHeadline || !emailBody) {
      alert("Subject, headline, and message body are mandatory (*)");
      return;
    }

    if (!confirm(`Are you sure you want to broadcast this promotional campaign to all registered students?`)) {
      return;
    }

    setSendingEmail(true);
    setEmailStatus("");
    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: emailSubject,
          headline: emailHeadline,
          bodyText: emailBody,
          ctaText: emailCtaText,
          ctaUrl: emailCtaUrl,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to broadcast email");
      setEmailStatus(`Campaign broadcast successfully to ${d.count} students via Resend!`);
      setEmailSubject("");
      setEmailHeadline("");
      setEmailBody("");
      setEmailCtaText("");
      setEmailCtaUrl("");
    } catch (err) {
      alert("Campaign send error: " + err.message);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <AdminShell>
      <div className="dash-head">
        <div>
          <div className="eyebrow">Marketing &amp; Promotion</div>
          <h1>Promotional Popups &amp; Resend Email Campaigns</h1>
          <p className="sub">
            Drive website activity and registrations through promotional announcement popups and marketing email broadcasts.
          </p>
        </div>
      </div>

      {statusMsg && <div className="form-note" style={{ color: "#2E7D3A", marginBottom: 20 }}>{statusMsg}</div>}
      {emailStatus && <div className="form-note" style={{ color: "#2E7D3A", marginBottom: 20 }}>{emailStatus}</div>}

      <div className="grid grid-2" style={{ gap: 28, alignItems: "start" }}>
        {/* Module 1: Website Promotional Popup */}
        <div className="dash-card">
          <h3 style={{ marginBottom: 14 }}>Website Promotional Popup</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 18 }}>
            Configure the floating promotion modal shown to visitors on the homepage and student portal.
          </p>
          <form onSubmit={handleSavePromo}>
            <div className="form-row single">
              <div className="field">
                <label>
                  Promo Popup Title <MandatoryStar />
                </label>
                <input
                  type="text"
                  required
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="e.g. Free Board-Style Mock Tests Now Live!"
                />
              </div>
            </div>

            <div className="form-row single">
              <div className="field">
                <label>
                  Promo Message <MandatoryStar />
                </label>
                <textarea
                  rows={3}
                  required
                  value={promoMsg}
                  onChange={(e) => setPromoMsg(e.target.value)}
                  placeholder="Describe the opportunity or free mock test invitation..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Button Text</label>
                <input
                  type="text"
                  value={promoCta}
                  onChange={(e) => setPromoCta(e.target.value)}
                  placeholder="Take Free Mock Test"
                />
              </div>
              <div className="field">
                <label>Button Link</label>
                <input
                  type="text"
                  value={promoLink}
                  onChange={(e) => setPromoLink(e.target.value)}
                  placeholder="/question-banks"
                />
              </div>
            </div>

            <div className="form-row single" style={{ margin: "14px 0" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={promoActive}
                  onChange={(e) => setPromoActive(e.target.checked)}
                />
                <strong>Active / Display popup to visitors</strong>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-sm" disabled={savingPromo}>
              {savingPromo ? "Saving..." : "Save Popup Configuration"}
            </button>
          </form>
        </div>

        {/* Module 2: Resend Promotional Email Broadcast */}
        <div className="dash-card">
          <h3 style={{ marginBottom: 14 }}>Broadcast Email Campaign</h3>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 18 }}>
            Send marketing announcements, free mock test invites, or webinar notices to registered students via Resend.
          </p>
          <form onSubmit={handleSendEmailCampaign}>
            <div className="form-row single">
              <div className="field">
                <label>
                  Email Subject Line <MandatoryStar />
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. Free Pediatric Clinical Mock Exam: Test Your Knowledge Today"
                />
              </div>
            </div>

            <div className="form-row single">
              <div className="field">
                <label>
                  Email Headline Banner <MandatoryStar />
                </label>
                <input
                  type="text"
                  required
                  value={emailHeadline}
                  onChange={(e) => setEmailHeadline(e.target.value)}
                  placeholder="New Online Mock Test Available at No Cost"
                />
              </div>
            </div>

            <div className="form-row single">
              <div className="field">
                <label>
                  Email Message Body <MandatoryStar />
                </label>
                <textarea
                  rows={4}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Draft your promotional campaign message to students and mentees..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>CTA Button Label</label>
                <input
                  type="text"
                  value={emailCtaText}
                  onChange={(e) => setEmailCtaText(e.target.value)}
                  placeholder="Start Free Exam"
                />
              </div>
              <div className="field">
                <label>CTA Target URL</label>
                <input
                  type="url"
                  value={emailCtaUrl}
                  onChange={(e) => setEmailCtaUrl(e.target.value)}
                  placeholder="https://jva-medical.com/question-banks"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold btn-sm"
              disabled={sendingEmail}
              style={{ marginTop: 10 }}
            >
              {sendingEmail ? "Broadcasting..." : "Broadcast Campaign via Resend"}
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
