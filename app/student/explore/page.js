"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentExploreProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrograms() {
      try {
        const res = await fetch("/api/student/explore");
        if (res.ok) {
          const json = await res.json();
          setPrograms(json.programs || []);
        }
      } catch (e) {
        console.error("Explore load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadPrograms();
  }, []);

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading medical programs...</div>;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
          Explore Medical Education &amp; Clinical Programs
        </h2>
        <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
          Discover and enroll in advanced clinical electives, board preparation tracks, and research fellowships.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
        {programs.map((prog) => {
          const isEnrolled = prog.is_enrolled;
          return (
            <div
              key={prog.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: isEnrolled ? "2px solid #2E7D3A" : "1px solid #E6E2D8",
                padding: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#B4832A", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {prog.category}
                  </span>
                  {isEnrolled ? (
                    <span style={{ backgroundColor: "#E8F5E9", color: "#2E7D3A", fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px" }}>
                      ✓ Enrolled &amp; Active
                    </span>
                  ) : (
                    <span style={{ backgroundColor: "#F7F4EE", color: "#767C87", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "4px" }}>
                      Not Enrolled
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#12203B", margin: "0 0 8px" }}>
                  {prog.name}
                </h3>
                <p style={{ fontSize: "13px", color: "#4B505C", lineHeight: 1.5, margin: "0 0 16px" }}>
                  {prog.description}
                </p>

                <div style={{ fontSize: "12px", color: "#767C87", marginBottom: "20px" }}>
                  Duration: <strong>{prog.duration}</strong> · Tuition: <strong>{prog.price}</strong>
                </div>
              </div>

              <div>
                {isEnrolled ? (
                  <Link
                    href={`/student/${prog.key === "tele_rotation" || prog.key === "physical_rotation" ? "rotations" : prog.key === "live_learning" ? "live-learning" : prog.key}`}
                    style={{
                      backgroundColor: "#12203B",
                      color: "#FFFFFF",
                      padding: "10px 18px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    Open Active Portal →
                  </Link>
                ) : (
                  <Link
                    href={`/education-training/tele-rotations/apply?program=${prog.key}`}
                    style={{
                      backgroundColor: "#8A2A34",
                      color: "#FFFFFF",
                      padding: "10px 18px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: 700,
                      textDecoration: "none",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    Apply / Register Interest →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
