"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCerts() {
      try {
        const res = await fetch("/api/student/certificates");
        if (res.ok) {
          const json = await res.json();
          setCertificates(json.certificates || []);
        }
      } catch (e) {
        console.error("Certs error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading issued certificates...</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
          Issued Certificates of Completion
        </h2>
        <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
          Verifiable clinical certificates issued upon completion of US clinical rotations, masterclasses, and research tracks.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E6E2D8", padding: "40px", textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎓</div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#12203B", margin: "0 0 8px" }}>
            No Certificates Issued Yet
          </h3>
          <p style={{ fontSize: "13px", color: "#4B505C", maxWidth: "500px", margin: "0 auto 20px" }}>
            Certificates are officially awarded and signed by Dr. Janardhan Mydam upon successful completion of your 6-week tele-rotation, hospital observership, or research mentorship milestones.
          </p>
          <Link
            href="/student/dashboard"
            style={{ backgroundColor: "#12203B", color: "#FFFFFF", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
          >
            Return to Dashboard
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {certificates.map((cert) => (
            <div
              key={cert.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: "2px solid #E9C989",
                padding: "28px",
                boxShadow: "0 4px 16px rgba(180,131,42,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", backgroundColor: "#B4832A", color: "#FFFFFF", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                  OFFICIAL CREDENTIAL
                </span>
                <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#12203B", margin: "6px 0 4px" }}>
                  {cert.program_name}
                </h3>
                <div style={{ fontSize: "14px", color: "#4B505C", marginBottom: "8px" }}>
                  Awarded to: <strong>{cert.student_name}</strong> · {cert.honors}
                </div>
                <div style={{ fontSize: "12px", color: "#767C87" }}>
                  Signing Attending: <strong>{cert.signing_physician}</strong><br />
                  Date of Conferral: {cert.issue_date} · Verification Code: <code style={{ backgroundColor: "#F7F4EE", padding: "2px 6px", borderRadius: "3px", color: "#12203B", fontWeight: 700 }}>{cert.verification_code}</code>
                </div>
              </div>

              <a
                href={cert.file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "#8A2A34",
                  color: "#FFFFFF",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: 700,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                📥 Download PDF Certificate
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
