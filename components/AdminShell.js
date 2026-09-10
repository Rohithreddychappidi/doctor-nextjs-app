"use client";

import { useState, useEffect } from "react";
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
      { href: "/admin/classes", label: "Live Classes & Seminars", icon: "🎥", badge: "Teams Pro" },
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
      { href: "/admin/disclaimers", label: "Section Disclaimers", icon: "⚖️", badge: "Compliance" },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Automatically close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="dash-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      {/* MOBILE RESPONSIVE TOPBAR (Shown on screens < 1024px) */}
      <header
        className="admin-mobile-topbar"
        style={{
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "#0E182A",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 998,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#FFFFFF",
              borderRadius: "7px",
              padding: "6px 10px",
              fontSize: "16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ☰
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                backgroundColor: "#B4832A",
                color: "#FFFFFF",
                fontWeight: 700,
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
              }}
            >
              JM
            </span>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.1 }}>Dr. Janardhan Mydam</div>
              <div style={{ fontSize: "10px", color: "#E9C989", fontWeight: 600 }}>Super-Admin CMS</div>
            </div>
          </div>
        </div>

        <Link
          href="/student/dashboard"
          style={{
            fontSize: "11px",
            color: "#E9C989",
            fontWeight: 700,
            textDecoration: "none",
            backgroundColor: "rgba(180,131,42,0.15)",
            padding: "5px 10px",
            borderRadius: "6px",
            border: "1px solid rgba(233,201,137,0.3)",
          }}
        >
          Student Portal &rarr;
        </Link>
      </header>

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(3px)",
            zIndex: 9998,
          }}
          aria-hidden="true"
        />
      )}

      <div style={{ display: "flex", flex: 1, position: "relative" }}>
        {/* SIDEBAR (Desktop Fixed/Sticky + Mobile Off-Canvas Drawer) */}
        <aside
          className={`dash-side ${mobileOpen ? "open" : ""}`}
          style={{
            backgroundColor: "#0E182A",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/" className="brand" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
              <span
                style={{
                  backgroundColor: "#B4832A",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  borderRadius: "8px",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                }}
              >
                JM
              </span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>Dr. Janardhan Mydam</div>
                <div style={{ color: "#E9C989", fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>Super-Admin CMS &amp; Hub</div>
              </div>
            </Link>

            {/* Close button on mobile */}
            <button
              type="button"
              className="admin-drawer-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              style={{
                display: "none",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#FFFFFF",
                borderRadius: "6px",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>

          {/* Categorized Navigation */}
          <nav className="dash-nav" style={{ padding: "12px 10px", overflowY: "auto", flex: 1 }}>
            {NAV_SECTIONS.map((sec, secIdx) => (
              <div key={secIdx} style={{ marginBottom: "14px" }}>
                {sec.title && (
                  <div
                    style={{
                      fontSize: "9.5px",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.09em",
                      color: "#E9C989",
                      padding: "0 8px 5px",
                      opacity: 0.9,
                    }}
                  >
                    {sec.title}
                  </div>
                )}
                {sec.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "7.5px 10px",
                        borderRadius: "7px",
                        fontSize: "12.5px",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.72)",
                        backgroundColor: isActive ? "rgba(180,131,42,0.22)" : "transparent",
                        border: isActive ? "1px solid rgba(233,201,137,0.35)" : "1px solid transparent",
                        marginBottom: "2px",
                        textDecoration: "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                        <span style={{ fontSize: "14px", flexShrink: 0 }}>{item.icon}</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: "4px",
                            backgroundColor: isActive ? "#B4832A" : "rgba(255,255,255,0.1)",
                            color: isActive ? "#FFFFFF" : "#CBD5E1",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
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
          <div
            className="foot"
            style={{
              fontSize: "11px",
              padding: "12px 16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.5)",
            }}
          >
            <div>JVA Medical Services · Unified Architecture</div>
            <Link
              href="/student/dashboard"
              style={{
                color: "#E9C989",
                fontWeight: 600,
                textDecoration: "none",
                marginTop: "4px",
                display: "inline-block",
              }}
            >
              Switch to Student Portal &rarr;
            </Link>
          </div>
        </aside>

        {/* Main Workspace Content */}
        <main
          className="dash-main"
          style={{
            flex: 1,
            backgroundColor: "#F8FAFC",
            minHeight: "100vh",
            overflowY: "auto",
            minWidth: 0,
          }}
        >
          {children}
        </main>
      </div>

      <style jsx global>{`
        /* Desktop styles (min-width: 1024px) */
        @media (min-width: 1024px) {
          .dash-side {
            width: 275px;
            min-width: 275px;
            position: sticky;
            top: 0;
            height: 100vh;
          }
          .admin-mobile-topbar {
            display: none !important;
          }
          .admin-drawer-close {
            display: none !important;
          }
        }

        /* Mobile & Tablet styles (max-width: 1023px) */
        @media (max-width: 1023px) {
          .admin-mobile-topbar {
            display: flex !important;
          }
          .admin-drawer-close {
            display: flex !important;
          }
          .dash-side {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            width: 285px !important;
            max-width: 85vw !important;
            height: 100vh !important;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: none;
          }
          .dash-side.open {
            transform: translateX(0);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }
          .dash-main {
            padding: 20px 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
