import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: "#fff", marginBottom: 16 }}>
              <span className="mark">DR</span>
              <span>
                Dr. Doctor Name
                <br />
                <small style={{ color: "rgba(255,255,255,.5)" }}>Neonatology &amp; Pediatrics</small>
              </span>
            </div>
            <p style={{ maxWidth: 280, fontSize: 13.5, color: "rgba(255,255,255,.55)" }}>
              A free consultation and mentorship practice — from India to students and
              families around the world. This site exists to record and share how many
              people we&apos;ve been able to help.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/doctor-profile">Doctor Profile</Link>
            <Link href="/research">Research</Link>
            <Link href="/question-bank">Question Bank</Link>
            <Link href="/meetings">Meetings</Link>
          </div>
          <div>
            <h4>Programs</h4>
            <Link href="/tele-rotation">Tele-Rotation</Link>
            <Link href="/physical-rotation">Physical Rotation</Link>
            <Link href="/consultation">Free Consultation</Link>
            <Link href="/student-login">Student Login</Link>
          </div>
          <div>
            <h4>Support the Work</h4>
            <Link href="/donate">Donate</Link>
            <Link href="/testimonials">Testimonials</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Dr. Doctor Name — Free Consultation &amp; Mentorship Practice. All rights reserved.</span>
          <span>
            Privacy Policy &nbsp;·&nbsp; Terms of Use &nbsp;·&nbsp;{" "}
            <Link href="/admin" style={{ color: "rgba(255,255,255,.45)" }}>Admin Panel (preview)</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
