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
  { key: "education", label: "Education & Training", href: "/education-training" },
  { key: "question-banks", label: "Question Banks", href: "/question-banks" },
  { key: "research", label: "Research", href: "/research" },
  { key: "clinical", label: "Clinical Guidance", href: "/clinical-services" },
  { key: "newborn-care", label: "Newborn Care Programs", href: "/advisory-services" },
  { key: "community", label: "Community Health", href: "/community-impact" },
  { key: "contact", label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const headerRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
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

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
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
  const isAboutActive =
    pathname.startsWith("/about") || pathname === "/doctor-portfolio";

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-wrap">
        <Link href="/" className="brand">
          <span className="mark">JVM</span>
          <span>
            jvmmedicalservices
            <small>JVM Medical Services · Neonatology, Pediatrics &amp; USCE Training</small>
          </span>
        </Link>

        <nav className={`nav-links${open ? " open" : ""}`} id="navLinks">
          {NAV_ITEMS.map((item) => {
            if (item.isDropdown) {
              return (
                <div
                  key={item.key}
                  className="nav-item-dropdown"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  style={{ position: "relative" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Link
                      href={item.href}
                      className={isAboutActive ? "active" : ""}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      aria-label="Toggle About submenu"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen((prev) => !prev);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "4px 2px",
                        fontSize: "10px",
                        color: isAboutActive ? "var(--accent)" : "var(--ink-soft)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ▾
                    </button>
                  </div>

                  {/* Desktop / Mobile Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className="nav-dropdown-menu"
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "-20px",
                        backgroundColor: "#FFFFFF",
                        minWidth: "280px",
                        padding: "8px 0",
                        borderRadius: "10px",
                        boxShadow: "0 14px 35px rgba(14,24,42,0.14), 0 2px 6px rgba(0,0,0,0.06)",
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
                              setDropdownOpen(false);
                              setOpen(false);
                            }}
                            style={{
                              display: "block",
                              padding: "10px 18px",
                              textDecoration: "none",
                              backgroundColor: isSubActive ? "rgba(180,131,42,0.08)" : "transparent",
                              borderLeft: isSubActive ? "3px solid #B4832A" : "3px solid transparent",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
                              <span
                                style={{
                                  fontSize: "13px",
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
                                    padding: "1px 6px",
                                    borderRadius: "4px",
                                    backgroundColor: "#F1F5F9",
                                    color: "#64748B",
                                    fontWeight: 700,
                                  }}
                                >
                                  {subItem.badge}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "11.5px", color: "#64748B", lineHeight: 1.3 }}>
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
              Portal Sign In
            </Link>
          )}
          <Link href="/question-banks" className="nav-cta-mobile" style={{ background: "var(--accent)", color: "#fff" }}>
            Free Mock Tests
          </Link>
          <Link href="/clinical-services" className="nav-cta-mobile">
            Clinical Guidance
          </Link>
        </nav>

        <div className="nav-cta" style={{ gap: 8 }}>
          <Link href="/question-banks" className="btn btn-gold btn-sm" style={{ fontWeight: 600 }}>
            Free Mock Tests
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
