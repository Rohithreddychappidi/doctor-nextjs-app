"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterProgram, setFilterProgram] = useState("all");

  useEffect(() => {
    loadEnrollments();
  }, []);

  async function loadEnrollments() {
    try {
      const res = await fetch("/api/admin/enrollments");
      if (res.ok) {
        const json = await res.json();
        setEnrollments(json.enrollments || []);
      }
    } catch (e) {
      console.error("Enrollments error:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, statusVal) => {
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, updates: { enrollment_status: statusVal } }),
      });
      if (res.ok) {
        loadEnrollments();
      }
    } catch (e) {
      console.error("Status update error:", e);
    }
  };

  const filtered = enrollments.filter((e) => {
    if (filterProgram !== "all" && e.program_key !== filterProgram) return false;
    return true;
  });

  return (
    <AdminShell>
      <div style={{ maxWidth: "1100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
              Enrollments Manager
            </h1>
            <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
              Cross-student enrollment tracking, access control statuses, and payment validation.
            </p>
          </div>

          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            style={{ padding: "8px 14px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px", backgroundColor: "#FFFFFF" }}
          >
            <option value="all">All Programs ({enrollments.length})</option>
            <option value="tele_rotation">Virtual Tele-Rotation</option>
            <option value="physical_rotation">In-Person US Observership</option>
            <option value="qbank">Clinical QBank</option>
            <option value="live_learning">Live Clinical Classes</option>
            <option value="courses">Recorded Courses</option>
            <option value="research">Research Mentorship</option>
            <option value="mentorship">1-on-1 Mentorship</option>
          </select>
        </div>

        {/* Enrollments Table */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E6E2D8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center" }}>Loading enrollments...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#767C87" }}>No enrollments found.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#F7F4EE", borderBottom: "1px solid #E6E2D8", color: "#12203B" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Enrolled Program</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Plan / Tier</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Payment</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((enr) => (
                  <tr key={enr.id} style={{ borderBottom: "1px solid #F0ECE1" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 700, color: "#12203B" }}>{enr.student_name}</div>
                      <div style={{ fontSize: "11px", color: "#767C87" }}>{enr.student_email}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#12203B" }}>{enr.program_name}</div>
                      <div style={{ fontSize: "11px", color: "#767C87" }}>key: {enr.program_key}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#4B505C" }}>
                      {enr.plan}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: enr.payment_status === "Paid" ? "#2E7D3A" : "#D84315" }}>
                        {enr.payment_status}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <select
                        value={enr.enrollment_status}
                        onChange={(e) => handleStatusChange(enr.id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 700,
                          backgroundColor: enr.enrollment_status === "Active" ? "#E8F5E9" : "#FFF8E1",
                          color: enr.enrollment_status === "Active" ? "#2E7D3A" : "#B4832A",
                          border: "1px solid #CBD2E1",
                        }}
                      >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <Link
                        href={`/admin/students/${enr.student_id}`}
                        style={{ color: "#8A2A34", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}
                      >
                        View Student →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
