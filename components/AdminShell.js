"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview & Portal KPIs" },
  { href: "/admin/students", label: "👥 Students Directory" },
  { href: "/admin/enrollments", label: "📋 Enrollments Manager" },
  { href: "/admin/programs", label: "🧭 Programs Catalog" },
  { href: "/admin/documents", label: "📁 Document Review Queue" },
  { href: "/admin/reports", label: "📊 Cross-Cutting Reports" },
  { href: "/admin/classes", label: "🎥 Live Online Classes" },
  { href: "/admin/tests", label: "📝 Question Bank & Tests" },
  { href: "/admin/submissions", label: "📥 Student Submissions" },
  { href: "/admin/content", label: "🌐 Site Content CMS" },
  { href: "/admin/about", label: "👨‍⚕️ About Dr. Mydam CMS" },
  { href: "/admin/requests", label: "✉ Consultation Requests" },
  { href: "/admin/marketing", label: "📢 Marketing & Promotions" },
  { href: "/admin/emergency", label: "⚠ Cybersecurity Shutdown" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  return (
    <div className="dash">
      <aside className="dash-side" style={{ minWidth: 260 }}>
        <Link href="/" className="brand" style={{ padding: "16px 20px" }}>
          <span className="mark">JM</span>
          <span>
            Dr. Janardhan Mydam
            <br />
            <small style={{ color: "rgba(255,255,255,.6)", fontSize: 11 }}>
              Super-Administrator Portal
            </small>
          </span>
        </Link>
        <nav className="dash-nav" style={{ padding: "10px 0" }}>
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/")) ? "active" : ""}
            >
              <span className="dot"></span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="foot" style={{ fontSize: 11.5, padding: "16px 20px" }}>
          JVA Medical Services · PostgreSQL Ready
          <br />
          <Link href="/student/dashboard" style={{ color: "#E9C989", textDecoration: "underline", marginTop: 6, display: "inline-block" }}>
            Open Student Portal →
          </Link>
        </div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
