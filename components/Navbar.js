"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/lib/defaultData";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    setOpen(false);
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

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="site-header" ref={headerRef}>
      <div className="nav-wrap">
        <Link href="/" className="brand">
          <span className="mark">DR</span>
          <span>
            Dr. Doctor Name
            <small>Neonatology &amp; Pediatrics · India to the World</small>
          </span>
        </Link>

        <nav className={`nav-links${open ? " open" : ""}`} id="navLinks">
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} href={item.href} className={isActive(item.href) ? "active" : ""}>
              {item.label}
            </Link>
          ))}
          <Link href="/student-login" className={`nav-login-mobile${isActive("/student-login") ? " active" : ""}`}>
            Student Login
          </Link>
          <Link href="/community-impact" className="nav-cta-mobile" style={{ background: "var(--gold)" }}>
            Donate
          </Link>
          <Link href="/clinical-services" className="nav-cta-mobile">
            Free Consultation
          </Link>
        </nav>

        <div className="nav-cta">
          <Link href="/student-login" className="btn btn-outline btn-sm">Student Login</Link>
          <Link href="/community-impact" className="btn btn-gold btn-sm">Donate</Link>
          <Link href="/clinical-services" className="btn btn-primary btn-sm">Free Consultation</Link>
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
