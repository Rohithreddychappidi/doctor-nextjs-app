"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function StudentLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeKeys, setActiveKeys] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function loadStudentData() {
    try {
      const res = await fetch("/api/student/dashboard");
      if (res.ok) {
        const data = await res.json();
        setUser(data.dashboard.profile);
        setProfile(data.dashboard.profile);
        setActiveKeys(data.dashboard.active_keys || []);
        setUnreadNotifications(data.dashboard.unread_notifications_count || 0);
        setNotificationsList(data.dashboard.notifications || []);
      } else {
        // Not logged in or error
        router.push("/student-login");
      }
    } catch (e) {
      console.error("Layout data error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/student-login");
  }

  const navItems = [
    { label: "Dashboard", href: "/student/dashboard", icon: "📊", requiredKey: null },
    { label: "My Clinical Rotation", href: "/student/rotations", icon: "🩺", requiredKey: ["tele_rotation", "physical_rotation"] },
    { label: "Question Bank (QBank)", href: "/student/qbank", icon: "📝", requiredKey: ["qbank"] },
    { label: "Live Clinical Classes", href: "/student/live-learning", icon: "🎥", requiredKey: ["live_learning"] },
    { label: "Research Mentorship", href: "/student/research", icon: "🔬", requiredKey: ["research"] },
    { label: "1-on-1 Mentorship", href: "/student/mentorship", icon: "👨‍⚕️", requiredKey: ["mentorship"] },
    { label: "Recorded Masterclasses", href: "/student/courses", icon: "📺", requiredKey: ["courses"] },
  ];

  const utilityNav = [
    { label: "Document Vault", href: "/student/documents", icon: "📁" },
    { label: "Certificates", href: "/student/certificates", icon: "🎓" },
    { label: "Support & Helpdesk", href: "/student/support", icon: "💬" },
    { label: "Academic Profile", href: "/student/profile", icon: "👤" },
    { label: "Explore More Programs", href: "/student/explore", icon: "🧭" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F9F8F5", color: "#171A21", fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)" }}>

      {/* Mobile Top Header (Visible on screens <= 768px) */}
      <header
        className="student-mobile-topbar"
        style={{
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          backgroundColor: "#12203B",
          color: "#FFFFFF",
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
            aria-label="Open student navigation menu"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#FFFFFF",
              borderRadius: "6px",
              padding: "6px 10px",
              fontSize: "16px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ☰
          </button>
          <div>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#E9C989", fontWeight: 700 }}>
              Dr. Janardhan Mydam
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
              Student Hub
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "6px",
              padding: "5px 8px",
              cursor: "pointer",
              color: "#FFFFFF",
              fontSize: "13px",
            }}
          >
            🔔 {unreadNotifications > 0 ? unreadNotifications : ""}
          </button>
          {profile && (
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#B4832A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "11px" }}>
              {profile.first_name[0]}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(18, 32, 59, 0.65)",
            backdropFilter: "blur(3px)",
            zIndex: 99998,
          }}
          aria-hidden="true"
        />
      )}

      {/* Main App Container */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Dynamic Sidebar */}
        <aside
          className={`student-sidebar ${mobileOpen ? "open" : ""}`}
          style={{
            width: "270px",
            backgroundColor: "#12203B",
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #1E2D4A",
            flexShrink: 0,
          }}
        >
          {/* Brand Header */}
          <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <Link href="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.2px", color: "#E9C989", fontWeight: 700 }}>
                Dr. Janardhan Mydam
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginTop: "2px" }}>
                Student Learning Hub
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="student-drawer-close"
              aria-label="Close navigation menu"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "#CBD2E1",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              ✕
            </button>
          </div>

          {profile && (
            <div style={{ margin: "14px 14px 0", padding: "10px 12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#FFFFFF" }}>
                {profile.first_name} {profile.last_name}
              </div>
              <div style={{ fontSize: "11px", color: "#A5ADC0", marginTop: "2px" }}>
                {profile.medical_school}
              </div>
              <div style={{ marginTop: "6px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "10px", backgroundColor: "rgba(180,131,42,0.25)", color: "#E9C989", padding: "1px 6px", borderRadius: "3px", fontWeight: 600 }}>
                  {profile.usmle_stage}
                </span>
                <span style={{ fontSize: "10px", backgroundColor: "rgba(74,222,128,0.15)", color: "#4ADE80", padding: "1px 6px", borderRadius: "3px", fontWeight: 600 }}>
                  {activeKeys.length} Active Module{activeKeys.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          )}

          {/* Nav List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#8E98B0", padding: "0 8px 8px", fontWeight: 700 }}>
              Clinical Programs &amp; Training
            </div>

            {navItems.map((item) => {
              const isDashboard = item.requiredKey === null;
              const isEnrolled = isDashboard || (item.requiredKey && item.requiredKey.some((k) => activeKeys.includes(k)));
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              let tagLabel = null;
              let tagBg = "transparent";
              let tagColor = "#CBD2E1";

              if (!isDashboard) {
                if (isEnrolled) {
                  tagLabel = "Active";
                  tagBg = "rgba(74, 222, 128, 0.15)";
                  tagColor = "#4ADE80";
                } else if (item.href === "/student/rotations" || item.href === "/student/research") {
                  tagLabel = "Apply";
                  tagBg = "rgba(147, 197, 253, 0.18)";
                  tagColor = "#93C5FD";
                } else if (item.href === "/student/qbank") {
                  tagLabel = "Free/Pro";
                  tagBg = "rgba(233, 201, 137, 0.18)";
                  tagColor = "#E9C989";
                } else if (item.href === "/student/live-learning") {
                  tagLabel = "Live";
                  tagBg = "rgba(244, 114, 182, 0.18)";
                  tagColor = "#F472B6";
                }
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "9px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#FFFFFF" : "#CBD2E1",
                    backgroundColor: isActive ? "#8A2A34" : "transparent",
                    textDecoration: "none",
                    marginBottom: "3px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {tagLabel && (
                    <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "10px", backgroundColor: tagBg, color: tagColor, fontWeight: 700, letterSpacing: "0.3px" }}>
                      {tagLabel}
                    </span>
                  )}
                  {isActive && <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#E9C989" }}></span>}
                </Link>
              );
            })}

            {/* Common Student Tools */}
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#8E98B0", padding: "20px 8px 8px", fontWeight: 700 }}>
              Academic Tools
            </div>

            {utilityNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#FFFFFF" : "#9AA4BC",
                    backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                    textDecoration: "none",
                    marginBottom: "2px",
                  }}
                >
                  <span style={{ fontSize: "15px" }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer User & Logout */}
          <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" onClick={() => setMobileOpen(false)} style={{ color: "#A5ADC0", fontSize: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
              ← Return to Site
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#F87171",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowY: "auto" }}>
          {/* Top Bar with Notifications */}
          <header className="student-header" style={{ height: "60px", backgroundColor: "#FFFFFF", borderBottom: "1px solid #E6E2D8", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h1 style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "#12203B" }}>
                {pathname === "/student/dashboard" && "Personalized Dashboard"}
                {pathname.startsWith("/student/rotations") && "Clinical Rotation & Tele-Rounds"}
                {pathname.startsWith("/student/qbank") && "Board-Style Clinical Question Bank"}
                {pathname.startsWith("/student/live-learning") && "Live Clinical Seminars (Microsoft Teams)"}
                {pathname.startsWith("/student/research") && "Clinical Research & Publication Mentorship"}
                {pathname.startsWith("/student/mentorship") && "1-on-1 Faculty Mentorship with Dr. Mydam"}
                {pathname.startsWith("/student/courses") && "Recorded Masterclasses & Curriculum"}
                {pathname === "/student/documents" && "Private Document Vault"}
                {pathname === "/student/certificates" && "Issued Certificates of Completion"}
                {pathname === "/student/support" && "Student Support & Helpdesk"}
                {pathname === "/student/profile" && "Academic Profile & Settings"}
                {pathname === "/student/explore" && "Explore & Enroll in Medical Programs"}
              </h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }}>
              {/* Notification Bell */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    background: "none",
                    border: "1px solid #E6E2D8",
                    borderRadius: "6px",
                    padding: "6px 10px",
                    cursor: "pointer",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#12203B",
                    fontSize: "14px",
                  }}
                >
                  🔔
                  {unreadNotifications > 0 && (
                    <span style={{ backgroundColor: "#8A2A34", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, padding: "1px 6px", borderRadius: "10px" }}>
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Popover */}
                {showNotifications && (
                  <div style={{ position: "absolute", right: 0, top: "45px", width: "340px", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", border: "1px solid #E6E2D8", zIndex: 100, padding: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F0ECE1", paddingBottom: "8px", marginBottom: "8px" }}>
                      <strong style={{ fontSize: "13px", color: "#12203B" }}>Notifications</strong>
                      <span style={{ fontSize: "11px", color: "#767C87" }}>{notificationsList.length} updates</span>
                    </div>
                    <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                      {notificationsList.length === 0 ? (
                        <div style={{ fontSize: "12px", color: "#767C87", padding: "12px 0", textAlign: "center" }}>
                          No unread notifications
                        </div>
                      ) : (
                        notificationsList.map((notif) => (
                          <div key={notif.id} style={{ padding: "8px", borderRadius: "4px", backgroundColor: notif.is_read ? "#FFFFFF" : "#F7F4EE", marginBottom: "6px", border: "1px solid #F0ECE1" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#12203B" }}>{notif.title}</div>
                            <div style={{ fontSize: "11px", color: "#4B505C", marginTop: "2px" }}>{notif.message}</div>
                            {notif.link && (
                              <Link href={notif.link} onClick={() => setShowNotifications(false)} style={{ display: "inline-block", marginTop: "4px", fontSize: "11px", color: "#8A2A34", fontWeight: 600, textDecoration: "none" }}>
                                View Details →
                              </Link>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Student Avatar */}
              {profile && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "#12203B", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }}>
                    {profile.first_name[0]}{profile.last_name ? profile.last_name[0] : ""}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#12203B" }}>
                      {profile.first_name} {profile.last_name}
                    </span>
                    <span style={{ fontSize: "11px", color: "#767C87" }}>
                      {profile.email}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Page Body */}
          <main className="student-main-content" style={{ flex: 1, padding: "28px", backgroundColor: "#F9F8F5" }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
