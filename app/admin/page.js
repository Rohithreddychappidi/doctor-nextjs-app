"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import ExportButton from "@/components/ExportButton";
import { useSiteData } from "@/lib/DataContext";

export default function AdminOverviewPage() {
  const { stats, updateStats, requests } = useSiteData();
  const [form, setForm] = useState(stats);
  const [saved, setSaved] = useState(false);
  const [metrics, setMetrics] = useState({
    classesCount: 0,
    testsCount: 0,
    questionsCount: 0,
    submissionsCount: 0,
    isEmergency: false,
    totalStudents: 5,
    activeEnrollments: 14,
    pendingDocuments: 1,
    openTickets: 1,
  });

  useEffect(() => setForm(stats), [stats]);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [clsRes, tstRes, qRes, subRes, emgRes, rptRes] = await Promise.all([
          fetch("/api/classes"),
          fetch("/api/tests"),
          fetch("/api/questions"),
          fetch("/api/assignments"),
          fetch("/api/emergency"),
          fetch("/api/admin/reports"),
        ]);
        const clsData = clsRes.ok ? await clsRes.json() : {};
        const tstData = tstRes.ok ? await tstRes.json() : {};
        const qData = qRes.ok ? await qRes.json() : {};
        const subData = subRes.ok ? await subRes.json() : {};
        const emgData = emgRes.ok ? await emgRes.json() : {};
        const rptData = rptRes.ok ? await rptRes.json() : {};

        setMetrics({
          classesCount: clsData.classes?.length || 0,
          testsCount: tstData.tests?.length || 0,
          questionsCount: qData.questions?.length || 0,
          submissionsCount: subData.submissions?.length || 0,
          isEmergency: Boolean(emgData.is_emergency_offline),
          totalStudents: rptData.stats?.total_students || 5,
          activeEnrollments: rptData.stats?.active_enrollments || 14,
          pendingDocuments: rptData.stats?.pending_documents || 1,
          openTickets: rptData.stats?.open_tickets || 1,
        });
      } catch (e) {
        // ignore
      }
    }
    loadMetrics();
  }, []);

  const handleChange = (key) => (e) => {
    const val = Number(e.target.value) || 0;
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    updateStats(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminShell>
      <div className="dash-head">
        <div>
          <div className="eyebrow">Dr. Janardhan Mydam · JVA Medical Services</div>
          <h1>Super-Administrator Command Center</h1>
          <p className="sub">
            Operational management for Personalized Student Portals, Active Enrollments, Clinical Rotations, QBank, Document Review, and Cybersecurity Protocols.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/student/dashboard" target="_blank" className="btn btn-primary btn-sm" style={{ backgroundColor: "#8A2A34" }}>
            Open Student Portal &#8599;
          </Link>
          <ExportButton endpoint="/api/export?type=students" filename="students_portal_export.csv" label="Export Students (CSV)" />
        </div>
      </div>

      {/* Emergency Status Alert if Active */}
      {metrics.isEmergency && (
        <div
          style={{
            backgroundColor: "#FFEBEE",
            color: "#8A2A34",
            border: "2px solid #8A2A34",
            padding: "16px 20px",
            borderRadius: 8,
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>⚠ EMERGENCY MAINTENANCE ACTIVE:</strong> The public website is currently offline. Visitors see only the maintenance notice.
          </div>
          <Link href="/admin/emergency" className="btn btn-primary btn-sm" style={{ backgroundColor: "#8A2A34" }}>
            Emergency Console &rarr;
          </Link>
        </div>
      )}

      {/* Personalized Student Portal KPIs */}
      <div className="kpi-row" style={{ marginBottom: 28 }}>
        <div className="kpi">
          <div className="lbl">ENROLLED STUDENTS</div>
          <div className="val" style={{ color: "var(--accent)" }}>{metrics.totalStudents}</div>
          <small><Link href="/admin/students" style={{ textDecoration: "underline" }}>View Directory &rarr;</Link></small>
        </div>
        <div className="kpi">
          <div className="lbl">ACTIVE ENROLLMENTS</div>
          <div className="val" style={{ color: "var(--gold)" }}>{metrics.activeEnrollments}</div>
          <small><Link href="/admin/enrollments" style={{ textDecoration: "underline" }}>Manage Access &rarr;</Link></small>
        </div>
        <div className="kpi">
          <div className="lbl">DOCUMENTS IN REVIEW</div>
          <div className="val" style={{ color: "#D84315" }}>{metrics.pendingDocuments}</div>
          <small><Link href="/admin/documents" style={{ textDecoration: "underline" }}>Review Queue &rarr;</Link></small>
        </div>
        <div className="kpi">
          <div className="lbl">LIVE CLASSES</div>
          <div className="val">{metrics.classesCount}</div>
          <small><Link href="/admin/classes" style={{ textDecoration: "underline" }}>Teams Sessions &rarr;</Link></small>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="panel" style={{ marginBottom: 30 }}>
        <div className="panel-head"><h3>Student Portal &amp; Academic Management</h3></div>
        <div className="grid grid-3" style={{ gap: 20 }}>
          <Link href="/admin/students" className="card" style={{ borderTop: "4px solid var(--accent)" }}>
            <span className="pill accent" style={{ marginBottom: 8 }}>Students &amp; Personas</span>
            <h3 style={{ margin: "4px 0 6px" }}>Students Directory</h3>
            <p style={{ fontSize: 13.5 }}>Search medical students, view active module enrollments, and assign/modify programs.</p>
          </Link>

          <Link href="/admin/enrollments" className="card" style={{ borderTop: "4px solid var(--gold)" }}>
            <span className="pill" style={{ backgroundColor: "rgba(180, 131, 42, 0.2)", color: "var(--gold)", marginBottom: 8 }}>Access Control</span>
            <h3 style={{ margin: "4px 0 6px" }}>Enrollments Manager</h3>
            <p style={{ fontSize: 13.5 }}>Cross-student enrollment tracking, start/expiry timeboxing, and payment validation.</p>
          </Link>

          <Link href="/admin/documents" className="card" style={{ borderTop: "4px solid #D84315" }}>
            <span className="pill" style={{ backgroundColor: "rgba(216, 67, 21, 0.15)", color: "#D84315", marginBottom: 8 }}>Verification</span>
            <h3 style={{ margin: "4px 0 6px" }}>Document Review Queue</h3>
            <p style={{ fontSize: 13.5 }}>Inspect uploaded medical CVs, Dean's letters, USMLE transcripts, and approve credentials.</p>
          </Link>

          <Link href="/admin/programs" className="card">
            <h3 style={{ margin: "4px 0 6px" }}>Programs Catalog</h3>
            <p style={{ fontSize: 13.5 }}>Manage clinical rotations, QBank, live seminars, research mentorship, and video course offerings.</p>
          </Link>

          <Link href="/admin/reports" className="card">
            <h3 style={{ margin: "4px 0 6px" }}>Cross-Cutting Reports</h3>
            <p style={{ fontSize: 13.5 }}>Aggregated analytics across enrollment counts, QBank completion rates, and rotation pipelines.</p>
          </Link>

          <Link href="/admin/emergency" className="card" style={{ borderLeft: "4px solid #D32F2F" }}>
            <h3 style={{ margin: "4px 0 6px", color: "#D32F2F" }}>Cybersecurity Protocol</h3>
            <p style={{ fontSize: 13.5 }}>Dr. Janardhan Mydam emergency shutdown console. One-click instant offline switch and forensic audit logs.</p>
          </Link>
        </div>
      </div>

      {/* Editable Homepage Stats Strip */}
      <div className="panel" style={{ marginBottom: 30 }}>
        <div className="panel-head">
          <h3>Homepage &amp; Profile Public Metrics</h3>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            {saved ? "Saved ✓" : "Save Metrics"}
          </button>
        </div>
        <div className="kpi-row" style={{ marginBottom: 0 }}>
          <div className="kpi">
            <div className="lbl">STUDENTS HELPED</div>
            <input type="number" value={form.studentsHelped} onChange={handleChange("studentsHelped")} />
          </div>
          <div className="kpi">
            <div className="lbl">CONSULTATIONS GIVEN</div>
            <input type="number" value={form.consultationsGiven} onChange={handleChange("consultationsGiven")} />
          </div>
          <div className="kpi">
            <div className="lbl">PUBLICATIONS</div>
            <input type="number" value={form.publicationsCount} onChange={handleChange("publicationsCount")} />
          </div>
          <div className="kpi">
            <div className="lbl">YEARS IN PRACTICE</div>
            <input type="number" value={form.yearsExperience} onChange={handleChange("yearsExperience")} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
