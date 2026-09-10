"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import ExportButton from "@/components/ExportButton";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("all");

  useEffect(() => {
    loadStudents();
  }, [search, programFilter]);

  async function loadStudents() {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (programFilter !== "all") params.set("program", programFilter);

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setStudents(json.students || []);
      }
    } catch (e) {
      console.error("Admin students error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell>
      <div style={{ maxWidth: "1100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
              Enrolled Students Directory
            </h1>
            <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
              Search, filter, inspect academic profiles, and manage module enrollments.
            </p>
          </div>

          <ExportButton endpoint="/api/export?type=students" filename="registered_students_jva.csv" label="Export Students CSV" />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "14px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or medical school..."
            style={{ flex: 1, minWidth: "260px", padding: "10px 14px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }}
          />

          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            style={{ padding: "10px 14px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px", backgroundColor: "#FFFFFF" }}
          >
            <option value="all">All Programs</option>
            <option value="tele_rotation">Virtual Tele-Rotation</option>
            <option value="physical_rotation">In-Person US Observership</option>
            <option value="qbank">Clinical QBank</option>
            <option value="live_learning">Live Clinical Classes</option>
            <option value="research">Research Mentorship</option>
            <option value="mentorship">1-on-1 Faculty Mentorship</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "8px", border: "1px solid #E6E2D8", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          {loading ? (
            <div style={{ padding: "32px", textAlign: "center" }}>Loading student records...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#767C87" }}>No students match your query.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "#F7F4EE", borderBottom: "1px solid #E6E2D8", color: "#12203B" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student Name</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Medical School</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>USMLE Stage</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Active Programs</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st.user_id} style={{ borderBottom: "1px solid #F0ECE1" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 700, color: "#12203B" }}>
                        {st.first_name} {st.last_name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#767C87" }}>{st.email}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: "#4B505C" }}>
                      {st.medical_school}
                      <div style={{ fontSize: "11px", color: "#767C87" }}>{st.country} · Class of {st.graduation_year}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ backgroundColor: "#F7F4EE", color: "#12203B", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, fontSize: "11px" }}>
                        {st.usmle_stage}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {st.active_enrollments?.map((enr) => (
                          <span
                            key={enr.id}
                            style={{
                              backgroundColor: "rgba(18,32,59,0.08)",
                              color: "#12203B",
                              padding: "2px 6px",
                              borderRadius: "3px",
                              fontSize: "11px",
                              fontWeight: 600,
                            }}
                          >
                            {enr.program_id.replace("prog_", "")}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <Link
                        href={`/admin/students/${st.user_id}`}
                        style={{
                          backgroundColor: "#12203B",
                          color: "#FFFFFF",
                          padding: "6px 14px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        Manage Record →
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
