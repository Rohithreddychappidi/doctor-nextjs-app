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

      {/* Categorized Section-Wise CMS Launchpad */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 30 }}>
        {/* Pillar 1: Clinical & Rotations */}
        <div className="panel" style={{ borderLeft: "4px solid #0D9488" }}>
          <div className="panel-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🩺</span>
              <h3 style={{ margin: 0 }}>Clinical &amp; Rotations</h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: "#F0FDFA", color: "#0F766E" }}>
              Active Pipeline &amp; Assessments
            </span>
          </div>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <Link href="/admin/rotations" className="card" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <h4 style={{ margin: 0, color: "#0F766E", fontSize: 15 }}>Tele-Rotation Cohort &amp; Meetings Manager</h4>
                <span className="pill" style={{ backgroundColor: "#F0FDFA", color: "#0F766E" }}>Queue &amp; Meetings</span>
              </div>
              <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.4 }}>
                Review inbound applicants, schedule flexible multi-meetings per week, generate Microsoft Teams links, grade oral examine calls, and issue certificates.
              </p>
            </Link>
            <Link href="/admin/documents" className="card" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <h4 style={{ margin: 0, color: "#B45309", fontSize: 15 }}>Clinical Document Verification</h4>
                <span className="pill" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>Compliance</span>
              </div>
              <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.4 }}>
                Review HIPAA certifications, Dean's Letters (MSPE), immunization titers, and send one-click document requests to candidates.
              </p>
            </Link>
          </div>
        </div>

        {/* Pillar 2: Academic & Learning CMS */}
        <div className="panel" style={{ borderLeft: "4px solid #2563EB" }}>
          <div className="panel-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>📚</span>
              <h3 style={{ margin: 0 }}>Academic &amp; Learning CMS</h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: "#EFF6FF", color: "#1D4ED8" }}>
              Dynamic Curriculum Engine
            </span>
          </div>
          <div className="grid grid-3" style={{ gap: 16 }}>
            <Link href="/admin/tests" className="card" style={{ textDecoration: "none" }}>
              <span className="pill accent" style={{ marginBottom: 6 }}>Question Bank CMS</span>
              <h4 style={{ margin: "4px 0 6px", fontSize: 14.5 }}>USMLE &amp; Board Vignettes</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Add questions with options A–D, rationale explanations, target modules/sections, and build timed mock tests.
              </p>
            </Link>

            <Link href="/admin/classes" className="card" style={{ textDecoration: "none" }}>
              <span className="pill" style={{ backgroundColor: "#EEF2FF", color: "#4338CA", marginBottom: 6 }}>Live Seminars</span>
              <h4 style={{ margin: "4px 0 6px", fontSize: 14.5 }}>Weekly Classes &amp; Teams</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Schedule live interactive lectures, auto-generate Microsoft Teams meeting links, and upload clinical slides.
              </p>
            </Link>

            <Link href="/admin/submissions" className="card" style={{ textDecoration: "none" }}>
              <span className="pill" style={{ backgroundColor: "#ECFDF5", color: "#065F46", marginBottom: 6 }}>Assignments</span>
              <h4 style={{ margin: "4px 0 6px", fontSize: 14.5 }}>Student Submissions</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Review written clinical case vignettes and neonatal management plans submitted by enrolled students.
              </p>
            </Link>
          </div>
        </div>

        {/* Pillar 3: Students & Admissions */}
        <div className="panel" style={{ borderLeft: "4px solid #B4832A" }}>
          <div className="panel-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>👥</span>
              <h3 style={{ margin: 0 }}>Students &amp; Admissions</h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: "#FFFBEB", color: "#B4832A" }}>
              Access Control &amp; Rosters
            </span>
          </div>
          <div className="grid grid-2" style={{ gap: 16 }}>
            <Link href="/admin/students" className="card" style={{ textDecoration: "none" }}>
              <h4 style={{ margin: "0 0 6px", fontSize: 14.5, color: "#854D0E" }}>Student Directory &amp; Personas</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Search students across all enrollment personas (Full Access, QBank only, Rotation only, Unenrolled), view progress, and grant access.
              </p>
            </Link>
            <Link href="/admin/enrollments" className="card" style={{ textDecoration: "none" }}>
              <h4 style={{ margin: "0 0 6px", fontSize: 14.5, color: "#854D0E" }}>Enrollments &amp; Expiry Manager</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Timeboxed access control, expiration date adjustments, and payment confirmation validation.
              </p>
            </Link>
          </div>
        </div>

        {/* Pillar 4: Website & Programs CMS */}
        <div className="panel" style={{ borderLeft: "4px solid #7C3AED" }}>
          <div className="panel-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🌐</span>
              <h3 style={{ margin: 0 }}>Website &amp; Programs CMS</h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: "#F5F3FF", color: "#6D28D9" }}>
              Public Web &amp; Pricing Sync
            </span>
          </div>
          <div className="grid grid-3" style={{ gap: 16 }}>
            <Link href="/admin/programs" className="card" style={{ textDecoration: "none" }}>
              <span className="pill" style={{ backgroundColor: "#F5F3FF", color: "#6D28D9", marginBottom: 6 }}>Live Pricing Sync</span>
              <h4 style={{ margin: "4px 0 6px", fontSize: 14.5 }}>Programs &amp; Pricing CMS</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Set programs as Free or Paid, modify tuition prices, and update pricing notes across the public website.
              </p>
            </Link>
            <Link href="/admin/content" className="card" style={{ textDecoration: "none" }}>
              <span className="pill" style={{ backgroundColor: "#F8FAFC", color: "#475569", marginBottom: 6 }}>Site Copy</span>
              <h4 style={{ margin: "4px 0 6px", fontSize: 14.5 }}>Site Content &amp; Testimonials</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Edit homepage hero copy, educational banners, testimonials, and contact inquiries.
              </p>
            </Link>
            <Link href="/admin/about" className="card" style={{ textDecoration: "none" }}>
              <span className="pill" style={{ backgroundColor: "#F8FAFC", color: "#475569", marginBottom: 6 }}>Faculty Profile</span>
              <h4 style={{ margin: "4px 0 6px", fontSize: 14.5 }}>About Dr. Mydam CMS</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Manage physician bio, hospital credentials, timeline of honors &amp; awards, and academic appointments.
              </p>
            </Link>
          </div>
        </div>

        {/* Pillar 5: Operations, Analytics & Security */}
        <div className="panel" style={{ borderLeft: "4px solid #DC2626" }}>
          <div className="panel-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
              <h3 style={{ margin: 0 }}>Operations, Analytics &amp; Security</h3>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: "#FEF2F2", color: "#DC2626" }}>
              Monitoring &amp; Controls
            </span>
          </div>
          <div className="grid grid-3" style={{ gap: 16 }}>
            <Link href="/admin/reports" className="card" style={{ textDecoration: "none" }}>
              <h4 style={{ margin: "0 0 6px", fontSize: 14.5 }}>Cross-Cutting Reports</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Enrollment statistics, completion funnel analysis, and rotation metrics.
              </p>
            </Link>
            <Link href="/admin/marketing" className="card" style={{ textDecoration: "none" }}>
              <h4 style={{ margin: "0 0 6px", fontSize: 14.5 }}>Marketing &amp; Promotions</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                Manage banner promotions, coupon codes, and cohort admission announcements.
              </p>
            </Link>
            <Link href="/admin/emergency" className="card" style={{ textDecoration: "none", borderLeft: "3px solid #DC2626" }}>
              <h4 style={{ margin: "0 0 6px", fontSize: 14.5, color: "#DC2626" }}>Cybersecurity &amp; Emergency</h4>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0 }}>
                One-click offline maintenance mode and forensic security audit log.
              </p>
            </Link>
          </div>
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
