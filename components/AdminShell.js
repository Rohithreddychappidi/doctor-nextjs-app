"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_SECTIONS = [
  {
    title: null,
    items: [
      { href: "/admin", label: "Overview & Portal KPIs", icon: "📊" },
    ],
  },
  {
    title: "Clinical & Rotations",
    items: [
      { href: "/admin/rotations", label: "Tele-Rotation Pipeline", icon: "🩺", badge: "Queue & Meetings" },
    ],
  },
  {
    title: "Academic & Learning CMS",
    items: [
      { href: "/admin/tests", label: "Question Bank CMS", icon: "📝", badge: "Dynamic" },
      { href: "/admin/classes", label: "Live Classes & Seminars", icon: "🎥" },
      { href: "/admin/submissions", label: "Student Submissions", icon: "📥" },
    ],
  },
  {
    title: "Students & Admissions",
    items: [
      { href: "/admin/students", label: "Students Directory", icon: "👥" },
      { href: "/admin/enrollments", label: "Enrollments Manager", icon: "📋" },
      { href: "/admin/documents", label: "Document Review Queue", icon: "📁" },
    ],
  },
  {
    title: "Website & Programs CMS",
    items: [
      { href: "/admin/programs", label: "Programs & Live Pricing", icon: "🧭", badge: "Free / Paid" },
      { href: "/admin/content", label: "Site Content CMS", icon: "🌐" },
      { href: "/admin/about", label: "About Dr. Mydam CMS", icon: "👨‍⚕️" },
      { href: "/admin/requests", label: "Consultation Requests", icon: "✉" },
    ],
  },
  {
    title: "Operations & Analytics",
    items: [
      { href: "/admin/reports", label: "Cross-Cutting Reports", icon: "📈" },
      { href: "/admin/marketing", label: "Marketing & Promotions", icon: "📢" },
      { href: "/admin/emergency", label: "Security & Controls", icon: "🛡️" },
    ],
  },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="dash">
      <aside className="dash-side" style={{ minWidth: 280, backgroundColor: "#0E182A", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Header */}
        <Link href="/" className="brand" style={{ padding: "18px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="mark" style={{ backgroundColor: "#B4832A", color: "#FFFFFF", fontWeight: 700, borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            JM
          </span>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>Dr. Janardhan Mydam</div>
            <div style={{ color: "#E9C989", fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>Super-Admin CMS &amp; Hub</div>
          </div>
        </Link>

        {/* Categorized Navigation */}
        <nav className="dash-nav" style={{ padding: "14px 12px", overflowY: "auto", flex: 1 }}>
          {NAV_SECTIONS.map((sec, secIdx) => (
            <div key={secIdx} style={{ marginBottom: "16px" }}>
              {sec.title && (
                <div style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "#E9C989",
                  padding: "0 10px 6px",
                  opacity: 0.85
                }}>
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "7px",
                      fontSize: "13px",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.72)",
                      backgroundColor: isActive ? "rgba(180,131,42,0.2)" : "transparent",
                      border: isActive ? "1px solid rgba(233,201,137,0.3)" : "1px solid transparent",
                      marginBottom: "3px",
                      textDecoration: "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "9px", minWidth: 0 }}>
                      <span style={{ fontSize: "14px" }}>{item.icon}</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span style={{
                        fontSize: "9.5px",
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: "4px",
                        backgroundColor: isActive ? "#B4832A" : "rgba(255,255,255,0.1)",
                        color: isActive ? "#FFFFFF" : "#CBD5E1",
                        whiteSpace: "nowrap"
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer info */}
        <div className="foot" style={{ fontSize: "11px", padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
          <div>JVA Medical Services · Unified Architecture</div>
          <Link href="/student/dashboard" style={{ color: "#E9C989", fontWeight: 600, textDecoration: "none", marginTop: "6px", display: "inline-block" }}>
            Switch to Student Portal &rarr;
          </Link>
        </div>
      </aside>

      <main className="dash-main" style={{ flex: 1, backgroundColor: "#F8FAFC", minHeight: "100vh", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
