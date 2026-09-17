"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  {
    key: "about",
    label: "About",
    href: "/about",
    isDropdown: true,
    children: [
      {
        label: "Doctor Portfolio",
        href: "/doctor-portfolio",
        badge: "Executive",
        desc: "Credentials, USCE Leadership & Portfolio",
      },
      {
        label: "Complete Info About Doctor",
        href: "/about/doctor",
        badge: "Full Bio",
        desc: "Comprehensive Bio, Hospital Chairs & Academic Roles",
      },
      {
        label: "About JVM Medical Services",
        href: "/about/company",
        badge: "Mission",
        desc: "Company Vision, Clinical Rotations & Organization",
      },
    ],
  },
  {
    key: "education",
    label: "Education & Training",
    href: "/education-training",
    isDropdown: true,
    children: [
      {
        label: "Live Clinical Classes & Seminars",
        href: "/education-training/live-learning",
        badge: "Weekly Live",
        desc: "Weekly clinical grand rounds, webinar lectures & seminar notes",
      },
      {
        label: "Virtual NICU & Tele-Rotations",
        href: "/education-training/tele-rotations",
        badge: "USCE Preceptor",
        desc: "6-week structured US clinical tele-rotations with attending LOR",
      },
      {
        label: "Clinical Question Banks",
        href: "/education-training/question-banks",
        badge: "Boards & USMLE",
        desc: "Neonatology, Pediatrics & Biostatistics vignettes with rationales",
      },
      {
        label: "Research Mentorship & Publications",
        href: "/research",
        badge: "IRB & Cohorts",
        desc: "Clinical study authorship, protocol vault & collaborative mentoring",
      },
    ],
  },
  { key: "clinical", label: "Clinical Guidance", href: "/clinical-services" },
  { key: "newborn-care", label: "Newborn Care Programs", href: "/advisory-services" },
  { key: "community", label: "Community Health", href: "/community-impact" },
  { key: "consultation", label: "General Consultation", href: "/consultation" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const headerRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setActiveDropdown(null);
    // Check authentication status
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    function setHeaderHeight() {
      if (headerRef.current) {
        document.documentElement.style.setProperty("--header-h", `${headerRef.current.offsetHeight}px`);
      }
    }
    setHeaderHeight();
    window.addEventListener("resize", setHeaderHeight);
    return () => window.removeEventListener("resize", setHeaderHeight);
  }, []);

  const handleMouseEnter = (key) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  };

  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (e) {
      // ignore
    }
  };

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const isAboutActive = pathname.startsWith("/about") || pathname === "/doctor-portfolio";
  const isEducationActive =
    pathname.startsWith("/education-training") ||
    pathname.startsWith("/question-banks") ||
    pathname.startsWith("/research");

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-wrap">
        <Link href="/" className="brand" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <span
            className="mark"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#12203B",
              color: "#E9C989",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "15px",
              flexShrink: 0,
              border: "1.5px solid #B4832A",
              boxShadow: "0 2px 6px rgba(18,32,59,0.15)",
            }}
          >
            JVM
          </span>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "#0F172A",
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-display)",
              }}
            >
              JVM Medical Services
            </span>
            <span style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 600, letterSpacing: "0.02em", marginTop: "2px" }}>
              Dr. Janardhan Mydam · Academic &amp; Clinical Excellence
            </span>
          </div>
        </Link>

        <nav className={`nav-links${open ? " open" : ""}`} id="navLinks">
          {NAV_ITEMS.map((item) => {
            if (item.isDropdown) {
              const isGroupActive = item.key === "about" ? isAboutActive : isEducationActive;
              const isMenuOpen = activeDropdown === item.key;

              return (
                <div
                  key={item.key}
                  className="nav-item-dropdown"
                  onMouseEnter={() => handleMouseEnter(item.key)}
                  onMouseLeave={handleMouseLeave}
                  style={{ position: "relative" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Link
                      href={item.href}
                      className={isGroupActive ? "active" : ""}
                      onClick={() => setOpen(false)}
                      style={{ fontWeight: isGroupActive ? 700 : 500 }}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-label={`Toggle ${item.label} submenu`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(item.key);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px 2px",
                        fontSize: "11px",
                        color: isGroupActive ? "var(--accent)" : "var(--ink-soft)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ▾
                    </button>
                  </div>

                  {/* Desktop / Mobile Dropdown Menu */}
                  {isMenuOpen && (
                    <div
                      className="nav-dropdown-menu"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "-10px",
                        backgroundColor: "#FFFFFF",
                        minWidth: "300px",
                        padding: "8px 0",
                        borderRadius: "12px",
                        boxShadow: "0 14px 35px rgba(14,24,42,0.16), 0 2px 8px rgba(0,0,0,0.06)",
                        border: "1px solid #E2E8F0",
                        zIndex: 1000,
                        marginTop: "8px",
                      }}
                    >
                      {item.children.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => {
                              setActiveDropdown(null);
                              setOpen(false);
                            }}
                            style={{
                              display: "block",
                              padding: "11px 18px",
                              textDecoration: "none",
                              backgroundColor: isSubActive ? "rgba(180,131,42,0.08)" : "transparent",
                              borderLeft: isSubActive ? "3px solid #B4832A" : "3px solid transparent",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3px" }}>
                              <span
                                style={{
                                  fontSize: "13.5px",
                                  fontWeight: 600,
                                  color: isSubActive ? "var(--accent)" : "#1E293B",
                                }}
                              >
                                {subItem.label}
                              </span>
                              {subItem.badge && (
                                <span
                                  style={{
                                    fontSize: "9.5px",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    backgroundColor: isSubActive ? "#FDF2E9" : "#F1F5F9",
                                    color: isSubActive ? "#B4832A" : "#64748B",
                                    fontWeight: 700,
                                  }}
                                >
                                  {subItem.badge}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "11.5px", color: "#64748B", lineHeight: 1.35 }}>
                              {subItem.desc}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.key} href={item.href} className={isActive(item.href) ? "active" : ""}>
                {item.label}
              </Link>
            );
          })}

          {user ? (
            <>
              <Link
                href={user.role === "admin" || user.role === "super_admin" || user.role === "sub_admin" ? "/admin" : "/student/dashboard"}
                className="nav-login-mobile"
                style={{ fontWeight: 600, color: "var(--accent)" }}
              >
                {user.role === "admin" || user.role === "super_admin" || user.role === "sub_admin" ? "Admin Portal" : "Student Portal"}
              </Link>
              <button
                onClick={handleLogout}
                className="nav-login-mobile"
                style={{ background: "transparent", border: "none", textAlign: "left", cursor: "pointer", color: "var(--muted)" }}
              >
                Log Out
              </button>
            </>
          ) : (
            <Link href="/student-login" className={`nav-login-mobile${isActive("/student-login") ? " active" : ""}`}>
              Student Sign In
            </Link>
          )}
          <Link href="/consultation" className="nav-cta-mobile" style={{ background: "var(--gold)", color: "#fff" }}>
            Book Consultation
          </Link>
          <Link href="/clinical-services" className="nav-cta-mobile">
            Clinical Guidance
          </Link>
        </nav>

        <div className="nav-cta" style={{ gap: 8 }}>
          <Link href="/consultation" className="btn btn-gold btn-sm" style={{ fontWeight: 700 }}>
            Book Consultation
          </Link>
          {user ? (
            <>
              <Link
                href={user.role === "admin" || user.role === "super_admin" || user.role === "sub_admin" ? "/admin" : "/student/dashboard"}
                className="btn btn-primary btn-sm"
              >
                {user.role === "admin" || user.role === "super_admin" || user.role === "sub_admin" ? "Admin Portal" : "Student Portal"}
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log Out"
                style={{ padding: "6px 10px" }}
              >
                Exit
              </button>
            </>
          ) : (
            <Link href="/student-login" className="btn btn-outline btn-sm">
              Student Login
            </Link>
          )}
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
