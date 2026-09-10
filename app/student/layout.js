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
  const [currentPersona, setCurrentPersona] = useState("student_a");
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    loadStudentData();
  }, []);

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

        // Detect persona by email
        const email = data.dashboard.profile.email;
        if (email.includes("student.a")) setCurrentPersona("student_a");
        else if (email.includes("student.b")) setCurrentPersona("student_b");
        else if (email.includes("student.c")) setCurrentPersona("student_c");
        else if (email.includes("student.d")) setCurrentPersona("student_d");
        else if (email.includes("student.f")) setCurrentPersona("student_f");
        else if (email.includes("admin")) setCurrentPersona("admin");
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

  async function handleSwitchPersona(personaKey) {
    setSwitching(true);
    try {
      const res = await fetch("/api/auth/demo-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona: personaKey }),
      });
      if (res.ok) {
        setCurrentPersona(personaKey);
        // Refresh page data
        window.location.reload();
      }
    } catch (e) {
      console.error("Persona switch error:", e);
    } finally {
      setSwitching(false);
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

  const personas = [
    { key: "student_a", label: "Student A", desc: "Rotation Only (Alex Rivera)" },
    { key: "student_b", label: "Student B", desc: "QBank Only (Bethany Chen)" },
    { key: "student_c", label: "Student C", desc: "QBank + Live + Mentor (Carlos Mendez)" },
    { key: "student_d", label: "Student D", desc: "Research + Rotation (Divya Patel)" },
    { key: "student_f", label: "Student F", desc: "All Programs (Fatima Al-Mansoor)" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F9F8F5", color: "#171A21", fontFamily: "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)" }}>
      {/* Top Demo Persona Switcher Bar */}
      <div style={{ backgroundColor: "#0B1E36", color: "#FFFFFF", padding: "8px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ backgroundColor: "#B4832A", color: "#FFFFFF", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontSize: "11px", letterSpacing: "0.5px" }}>
            DEMO TESTER
          </span>
          <span style={{ opacity: 0.85 }}>Switch Persona to Test Section E Personalization:</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {personas.map((p) => {
            const isSelected = currentPersona === p.key;
            return (
              <button
                key={p.key}
                onClick={() => handleSwitchPersona(p.key)}
                disabled={switching}
                title={p.desc}
                style={{
                  backgroundColor: isSelected ? "#8A2A34" : "rgba(255,255,255,0.12)",
                  color: "#FFFFFF",
                  border: isSelected ? "1px solid #E9C989" : "1px solid rgba(255,255,255,0.15)",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {isSelected ? `✓ ${p.label}` : p.label}
              </button>
            );
          })}
          <Link
            href="/admin"
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "#E9C989",
              border: "1px solid rgba(233,201,137,0.4)",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 600,
              textDecoration: "none",
              marginLeft: "6px"
            }}
          >
            Admin Portal ⚙️
          </Link>
        </div>
      </div>

      {/* Main App Container */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Dynamic Sidebar */}
        <aside style={{ width: "270px", backgroundColor: "#12203B", color: "#FFFFFF", display: "flex", flexDirection: "column", borderRight: "1px solid #1E2D4A", flexShrink: 0 }}>
          {/* Brand Header */}
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.2px", color: "#E9C989", fontWeight: 700 }}>
                Dr. Janardhan Mydam
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF", marginTop: "2px" }}>
                Student Learning Hub
              </div>
            </Link>
            {profile && (
              <div style={{ marginTop: "14px", padding: "10px 12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.08)" }}>
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
          </div>

          {/* Nav List */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#8E98B0", padding: "0 8px 8px", fontWeight: 700 }}>
              Enrolled Modules
            </div>

            {navItems.map((item) => {
              const isDashboard = item.requiredKey === null;
              const isEnrolled = isDashboard || (item.requiredKey && item.requiredKey.some((k) => activeKeys.includes(k)));
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

              if (!isEnrolled) return null; // Only show enrolled modules in primary nav!

              return (
                <Link
                  key={item.href}
                  href={item.href}
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
            <Link href="/" style={{ color: "#A5ADC0", fontSize: "12px", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
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
          <header style={{ height: "60px", backgroundColor: "#FFFFFF", borderBottom: "1px solid #E6E2D8", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", flexShrink: 0 }}>
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
          <main style={{ flex: 1, padding: "28px", backgroundColor: "#F9F8F5" }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
