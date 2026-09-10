"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/programs");
        if (res.ok) {
          const json = await res.json();
          setPrograms(json.programs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AdminShell>
      <div style={{ maxWidth: "1000px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
            Program Offerings Catalog
          </h1>
          <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
            Manage medical educational programs, duration specs, and published pricing.
          </p>
        </div>

        {loading ? (
          <p>Loading programs...</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
            {programs.map((prog) => (
              <div key={prog.id} style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "8px", border: "1px solid #E6E2D8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#B4832A", textTransform: "uppercase" }}>{prog.category}</span>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#12203B", margin: "4px 0 8px" }}>{prog.name}</h3>
                <p style={{ fontSize: "13px", color: "#4B505C", margin: "0 0 14px", lineHeight: 1.5 }}>{prog.description}</p>
                <div style={{ fontSize: "12px", color: "#767C87", borderTop: "1px solid #F0ECE1", paddingTop: "10px" }}>
                  Key: <code>{prog.key}</code> · Duration: <strong>{prog.duration}</strong> · Tuition: <strong>{prog.price}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
