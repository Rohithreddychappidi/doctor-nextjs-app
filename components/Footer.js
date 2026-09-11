import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: "#fff", marginBottom: 16 }}>
              <span className="mark">JVM</span>
              <span>
                jvmmedicalservices
                <br />
                <small style={{ color: "rgba(255,255,255,.6)" }}>JVM Medical Services · Neonatal &amp; Pediatric Care</small>
              </span>
            </div>
            <p style={{ maxWidth: 280, fontSize: 13.5, color: "rgba(255,255,255,.55)" }}>
              Dedicated to clinical excellence, evidence-based newborn care, US clinical education, and worldwide physician mentorship.
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
            <h4>About &amp; Portfolio</h4>
            <Link href="/about">About Practice</Link>
            <Link href="/doctor-portfolio">Doctor Portfolio</Link>
            <Link href="/community-impact">Community Impact</Link>
            <Link href="/testimonials">Testimonials</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 jvmmedicalservices (JVM Medical Services) · Chief Medical Director: Dr. Janardhan Mydam, MD, FAAP. All rights reserved.</span>
          <span>
            Privacy Policy &nbsp;·&nbsp; Terms of Use &nbsp;·&nbsp;{" "}
            <Link href="/admin" style={{ color: "rgba(255,255,255,.45)" }}>Admin Panel (preview)</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
