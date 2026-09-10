"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About", href: "/about" },
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
  const [user, setUser] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    setOpen(false);
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

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-wrap">
        <Link href="/" className="brand">
          <span className="mark">JM</span>
          <span>
            Dr. Janardhan Mydam, MD, FAAP
            <small>Neonatology · Pediatrics · Education · Research</small>
          </span>
        </Link>

        <nav className={`nav-links${open ? " open" : ""}`} id="navLinks">
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} href={item.href} className={isActive(item.href) ? "active" : ""}>
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/student/dashboard"}
                className="nav-login-mobile"
                style={{ fontWeight: 600, color: "var(--accent)" }}
              >
                {user.role === "admin" ? "Admin Portal" : "Student Portal"}
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
              Student Portal Login
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
                href={user.role === "admin" ? "/admin" : "/student/dashboard"}
                className="btn btn-primary btn-sm"
              >
                {user.role === "admin" ? "Admin" : "Student Portal"}
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
