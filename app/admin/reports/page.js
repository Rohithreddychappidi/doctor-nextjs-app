"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import ExportButton from "@/components/ExportButton";

export default function AdminReportsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/reports");
        if (res.ok) {
          const json = await res.json();
          setStats(json.stats);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <AdminShell>
      <div style={{ maxWidth: "1100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
              Cross-Cutting Platform Reports &amp; Analytics
            </h1>
            <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
              Enrollment distribution, clinical rotation pipelines, and academic performance metrics.
            </p>
          </div>

          <ExportButton endpoint="/api/export?type=students" filename="students_analytics_report.csv" label="Export Analytics CSV" />
        </div>

        {loading ? (
          <p>Loading analytics report...</p>
        ) : stats ? (
          <div>
            {/* KPI Strip */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
              <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "8px", border: "1px solid #E6E2D8" }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#767C87", fontWeight: 700 }}>Total Registered Students</div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#12203B", marginTop: "4px" }}>{stats.total_students}</div>
                <div style={{ fontSize: "12px", color: "#2E7D3A", marginTop: "2px" }}>Active candidate profiles</div>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "8px", border: "1px solid #E6E2D8" }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#767C87", fontWeight: 700 }}>Active Program Enrollments</div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#12203B", marginTop: "4px" }}>{stats.active_enrollments}</div>
                <div style={{ fontSize: "12px", color: "#B4832A", marginTop: "2px" }}>Across {Object.keys(stats.program_breakdown || {}).length} medical offerings</div>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "8px", border: "1px solid #E6E2D8" }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#767C87", fontWeight: 700 }}>Documents Pending Review</div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#D84315", marginTop: "4px" }}>{stats.pending_documents}</div>
                <div style={{ fontSize: "12px", color: "#767C87", marginTop: "2px" }}>Awaiting staff verification</div>
              </div>

              <div style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "8px", border: "1px solid #E6E2D8" }}>
                <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#767C87", fontWeight: 700 }}>Open Support Tickets</div>
                <div style={{ fontSize: "32px", fontWeight: 800, color: "#1D4ED8", marginTop: "4px" }}>{stats.open_tickets}</div>
                <div style={{ fontSize: "12px", color: "#767C87", marginTop: "2px" }}>Student inquiries</div>
              </div>
            </div>

            {/* Program Breakdown Table */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E6E2D8", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#12203B", margin: "0 0 16px" }}>
                Enrollment Distribution by Medical Program
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#F7F4EE", borderBottom: "1px solid #E6E2D8" }}>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Program Name</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700, textAlign: "right" }}>Active Enrolled Students</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.program_breakdown || {}).map(([name, count]) => (
                    <tr key={name} style={{ borderBottom: "1px solid #F0ECE1" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "#12203B" }}>{name}</td>
                      <td style={{ padding: "12px 14px", textAlign: "right", fontWeight: 700, color: "#2E7D3A" }}>{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </AdminShell>
  );
}
