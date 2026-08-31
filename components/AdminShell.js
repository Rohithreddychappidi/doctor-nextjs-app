"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview & Stats" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/meetings", label: "Live Learning" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/requests", label: "Consultation Records" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  return (
    <div className="dash">
      <aside className="dash-side">
        <Link href="/" className="brand">
          <span className="mark">DR</span>
          <span>Admin Panel<br /><small style={{ color: "rgba(255,255,255,.5)" }}>Front-end preview</small></span>
        </Link>
        <nav className="dash-nav">
          {ADMIN_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""}>
              <span className="dot"></span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="foot">Front-end demo — edits save to this browser only.<br />v0.2</div>
      </aside>
      <main className="dash-main">{children}</main>
    </div>
  );
}
