"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Primary Dashboard Overview
const OVERVIEW_ITEM = { href: "/admin", label: "Overview & Portal KPIs", icon: "📊" };

// 4 CORE HERO PILLARS
const HERO_PILLARS = [
  { href: "/admin/research", secKey: "research", label: "Research Hub & Mentorship", icon: "🔬", badge: "Core Hero 1 · Free", heroNum: 1 },
  { href: "/admin/rotations", secKey: "rotations", label: "Tele-Rotation Pipeline", icon: "🩺", badge: "Core Hero 2 · Teams", heroNum: 2 },
  { href: "/admin/classes", secKey: "classes", label: "Live Classes & Seminars", icon: "🎥", badge: "Core Hero 3 · Teams Pro", heroNum: 3 },
  { href: "/admin/tests", secKey: "tests", label: "Question Bank CMS", icon: "📝", badge: "Core Hero 4 · 28 Mods", heroNum: 4 },
];

// ADDITIONAL SECONDARY CMS & ADMINISTRATIVE MODULES
const MORE_SECTIONS = [
  {
    title: "Staff Governance & Security",
    items: [
      { href: "/admin/subadmins", label: "Sub-Admins & Permissions", icon: "🛡️", badge: "Doctor Only", doctorOnly: true },
      { href: "/admin/emergency", label: "Security & 2FA Controls", icon: "🔒", badge: "Doctor Only", doctorOnly: true },
    ],
  },
  {
    title: "Trainees & Admissions",
    items: [
      { href: "/admin/students", secKey: "students", label: "Students Directory", icon: "👥" },
      { href: "/admin/enrollments", secKey: "enrollments", label: "Enrollments Manager", icon: "📋" },
      { href: "/admin/documents", secKey: "documents", label: "Document Review Queue", icon: "📁" },
      { href: "/admin/submissions", secKey: "submissions", label: "Student Submissions", icon: "📥" },
    ],
  },
  {
    title: "Programs & Content CMS",
    items: [
      { href: "/admin/programs", secKey: "programs", label: "Programs & Live Pricing", icon: "🧭" },
      { href: "/admin/content", secKey: "content", label: "Site Content CMS", icon: "🌐" },
      { href: "/admin/about", secKey: "about", label: "About Dr. Mydam CMS", icon: "👨‍⚕️" },
      { href: "/admin/disclaimers", secKey: "disclaimers", label: "Section Disclaimers", icon: "⚖️" },
      { href: "/admin/reports", secKey: "reports", label: "Platform Reports", icon: "📈" },
      { href: "/admin/marketing", secKey: "marketing", label: "Marketing & Promotions", icon: "📢" },
      { href: "/admin/requests", secKey: "rotations", label: "Consultation Requests", icon: "✉" },
    ],
  },
];

const ALL_ITEMS = [
  OVERVIEW_ITEM,
  ...HERO_PILLARS,
  ...MORE_SECTIONS.flatMap((s) => s.items),
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if current route is within the secondary modules
  const isMoreRouteActive = MORE_SECTIONS.some((sec) =>
    sec.items.some((item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/")))
  );
  const [showMoreTools, setShowMoreTools] = useState(isMoreRouteActive);

  useEffect(() => {
    if (isMoreRouteActive) setShowMoreTools(true);
  }, [isMoreRouteActive]);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (e) {
        console.error("Error loading session:", e);
      }
    }
    loadUser();
  }, []);

  const isSubAdmin = currentUser?.role === "sub_admin";
  const userPermissions = Array.isArray(currentUser?.permissions) ? currentUser.permissions : [];

  // Filter hero pillars based on sub-admin permissions
  const filteredHeroPillars = HERO_PILLARS.filter((item) => {
    if (item.doctorOnly && isSubAdmin) return false;
    if (isSubAdmin && item.secKey && !userPermissions.includes(item.secKey)) return false;
    return true;
  });

  // Filter secondary sections based on sub-admin permissions
  const filteredMoreSections = MORE_SECTIONS.map((sec) => {
    const filteredItems = sec.items.filter((item) => {
      if (item.doctorOnly && isSubAdmin) return false;
      if (isSubAdmin && item.secKey && !userPermissions.includes(item.secKey)) return false;
      return true;
    });
    return { ...sec, items: filteredItems };
  }).filter((sec) => sec.items.length > 0);

  const totalMoreItemsCount = filteredMoreSections.reduce((acc, sec) => acc + sec.items.length, 0);

  const currentNavItem = ALL_ITEMS.find(
    (item) => item.href === pathname || (item.href !== "/admin" && pathname.startsWith(item.href + "/"))
  );
  const isAccessDenied =
    isSubAdmin &&
    currentNavItem &&
    (currentNavItem.doctorOnly || (currentNavItem.secKey && !userPermissions.includes(currentNavItem.secKey)));

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/student-login";
    } catch (e) {
      window.location.href = "/student-login";
    }
  };

  return (
    <div className="dash-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#F8FAFC" }}>
      {/* MOBILE RESPONSIVE TOPBAR */}
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
              <div style={{ fontSize: "10px", color: "#E9C989", fontWeight: 600 }}>Command Center</div>
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
        {/* SIDEBAR */}
        <aside
          className={`dash-side ${mobileOpen ? "open" : ""}`}
          style={{
            backgroundColor: "#0E182A",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            width: "280px",
          }}
        >
          {/* Brand Header */}
          <div
            style={{
              padding: "16px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link href="/admin" className="brand" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
              <span
                style={{
                  backgroundColor: isSubAdmin ? "#0D9488" : "#B4832A",
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
                {isSubAdmin ? "SA" : "JM"}
              </span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
                  {isSubAdmin ? (currentUser?.name || "Sub-Admin User") : "Dr. Janardhan Mydam"}
                </div>
                <div style={{ color: isSubAdmin ? "#5EEAD4" : "#E9C989", fontSize: "11px", fontWeight: 600, marginTop: "2px" }}>
                  {isSubAdmin ? "Sub-Admin Portal" : "Super-Admin Command Center"}
                </div>
              </div>
            </Link>

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

          {/* Clean Navigation */}
          <nav className="dash-nav" style={{ padding: "14px 12px", overflowY: "auto", flex: 1 }}>
            {/* 1. Overview Item */}
            <div style={{ marginBottom: "16px" }}>
              <Link
                href={OVERVIEW_ITEM.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: pathname === "/admin" ? 700 : 500,
                  color: pathname === "/admin" ? "#FFFFFF" : "rgba(255,255,255,0.8)",
                  backgroundColor: pathname === "/admin" ? "rgba(180,131,42,0.25)" : "rgba(255,255,255,0.03)",
                  border: pathname === "/admin" ? "1px solid rgba(233,201,137,0.4)" : "1px solid rgba(255,255,255,0.06)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "16px" }}>{OVERVIEW_ITEM.icon}</span>
                  <span>{OVERVIEW_ITEM.label}</span>
                </div>
                {pathname === "/admin" && (
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#E9C989" }}>ACTIVE</span>
                )}
              </Link>
            </div>

            {/* 2. CORE HEROES SECTION (4 PRIMARY HEROES) */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 8px 8px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#E9C989",
                  }}
                >
                  ⭐ Core Operations (4 Heroes)
                </span>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
                  Primary Focus
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {filteredHeroPillars.map((item) => {
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
                        padding: "9px 12px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.85)",
                        backgroundColor: isActive ? "rgba(180,131,42,0.28)" : "rgba(255,255,255,0.04)",
                        border: isActive ? "1.5px solid #E9C989" : "1px solid rgba(255,255,255,0.07)",
                        textDecoration: "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "9.5px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          backgroundColor: isActive ? "#B4832A" : "rgba(255,255,255,0.12)",
                          color: isActive ? "#FFFFFF" : "#E2E8F0",
                          whiteSpace: "nowrap",
                          flexShrink: 0,
                        }}
                      >
                        {item.badge}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* 3. COLLAPSIBLE ACCORDION FOR MORE SYSTEM TOOLS */}
            {totalMoreItemsCount > 0 && (
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <button
                  type="button"
                  onClick={() => setShowMoreTools(!showMoreTools)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    backgroundColor: showMoreTools ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#CBD5E1",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>⚙️</span>
                    <span>More Administrative Tools &amp; CMS ({totalMoreItemsCount})</span>
                  </span>
                  <span style={{ fontSize: "11px", color: "#E9C989" }}>
                    {showMoreTools ? "▲ Collapse" : "▼ Expand"}
                  </span>
                </button>

                {showMoreTools && (
                  <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "14px", paddingLeft: "4px" }}>
                    {filteredMoreSections.map((sec, secIdx) => (
                      <div key={secIdx}>
                        <div
                          style={{
                            fontSize: "9px",
                            fontWeight: 800,
                            textTransform: "uppercase",
                            letterSpacing: "0.08em",
                            color: "rgba(233,201,137,0.7)",
                            padding: "0 6px 4px",
                          }}
                        >
                          {sec.title}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
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
                                  padding: "7px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  fontWeight: isActive ? 700 : 500,
                                  color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                                  backgroundColor: isActive ? "rgba(180,131,42,0.22)" : "transparent",
                                  border: isActive ? "1px solid rgba(233,201,137,0.3)" : "1px solid transparent",
                                  textDecoration: "none",
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                                  <span style={{ fontSize: "13px", flexShrink: 0 }}>{item.icon}</span>
                                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {item.label}
                                  </span>
                                </div>
                                {item.badge && (
                                  <span
                                    style={{
                                      fontSize: "8.5px",
                                      fontWeight: 700,
                                      padding: "1px 5px",
                                      borderRadius: "4px",
                                      backgroundColor: "rgba(255,255,255,0.08)",
                                      color: "#CBD5E1",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Footer info */}
          <div
            className="foot"
            style={{
              fontSize: "11px",
              padding: "12px 16px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.6)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>Authenticated</span>
              <span
                style={{
                  fontSize: "9px",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  backgroundColor: isSubAdmin ? "rgba(13,148,136,0.3)" : "rgba(180,131,42,0.3)",
                  color: isSubAdmin ? "#5EEAD4" : "#E9C989",
                  fontWeight: 700,
                }}
              >
                {isSubAdmin ? "Sub-Admin" : "Super-Admin"}
              </span>
            </div>
            <div style={{ color: "#CBD5E1", fontWeight: 500, fontSize: "11px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentUser?.email || "admin@jvmmedicalservices.com"}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px", paddingTop: "6px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <Link
                href="/student/dashboard"
                style={{
                  color: "#E9C989",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "11px",
                }}
              >
                Student Portal &rarr;
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#EF4444",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign Out
              </button>
            </div>
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Active Third-Party Integrations Banner (Microsoft Teams & Resend Email Service) */}
          <div
            style={{
              padding: "10px 24px",
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid #E2E8F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
              fontSize: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10B981", display: "inline-block" }} />
                <span style={{ fontWeight: 700, color: "#1E293B" }}>Microsoft Teams:</span>
                <span style={{ color: "#059669", fontWeight: 600 }}>Active &amp; Ready for US Tele-Rotations &amp; Research Sync</span>
              </div>
              <div style={{ color: "#CBD5E1" }}>|</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#3B82F6", display: "inline-block" }} />
                <span style={{ fontWeight: 700, color: "#1E293B" }}>Resend Email Service:</span>
                <span style={{ color: "#2563EB", fontWeight: 600 }}>Automated Admissions Notifications Active</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link
                href="/student/dashboard"
                target="_blank"
                style={{
                  padding: "4px 10px",
                  borderRadius: 5,
                  backgroundColor: "#F8FAFC",
                  color: "#1E293B",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "11.5px",
                  border: "1px solid #CBD5E1",
                }}
              >
                Open Student Portal &#8599;
              </Link>
            </div>
          </div>

          {/* Page Content / Intercept Access Denied */}
          <div style={{ flex: 1, padding: "24px 30px" }}>
            {isAccessDenied ? (
              <div
                style={{
                  maxWidth: "600px",
                  margin: "60px auto",
                  padding: "36px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #FCA5A5",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
                <h2 style={{ fontSize: "20px", color: "#991B1B", marginBottom: "8px" }}>Section Restricted by Dr. Janardhan Mydam</h2>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.5, marginBottom: "20px" }}>
                  Your sub-administrator account does not currently have permissions to access <strong>{currentNavItem?.label || pathname}</strong>.
                  Please contact Dr. Mydam or request updated access roles.
                </p>
                <Link
                  href="/admin"
                  className="btn btn-primary"
                  style={{
                    display: "inline-block",
                    padding: "8px 18px",
                    backgroundColor: "#0E182A",
                    color: "#FFFFFF",
                    borderRadius: "6px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  &larr; Return to Permitted Sections
                </Link>
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
