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
            <h4>Learn &amp; Train</h4>
            <Link href="/education-training">Education &amp; Training</Link>
            <Link href="/education-training/live-learning">Live Learning</Link>
            <Link href="/education-training/question-banks">Question Banks</Link>
            <Link href="/education-training/tele-rotations">Tele-Rotations</Link>
            <Link href="/education-training/physical-rotations">Physical Rotations</Link>
          </div>
          <div>
            <h4>Services</h4>
            <Link href="/clinical-services">Clinical Services</Link>
            <Link href="/advisory-services">Advisory Services</Link>
            <Link href="/research">Research</Link>
            <Link href="/student-login">Student Login</Link>
          </div>
          <div>
            <h4>About &amp; Support</h4>
            <Link href="/about">About</Link>
            <Link href="/community-impact">Community Impact</Link>
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
