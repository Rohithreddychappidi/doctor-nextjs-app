"use client";

import Link from "next/link";

export default function AboutCompanyPage() {
  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#1E293B", minHeight: "100vh" }}>
      {/* 1. HERO SECTION */}
      <section style={{ padding: "70px 0 50px", background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "40px", alignItems: "center" }}>
            <div>
              <div className="eyebrow" style={{ color: "#0F766E" }}>Organization Overview</div>
              <h1 style={{ fontSize: "clamp(2rem, 3.2vw, 2.7rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: "16px" }}>
                About JVM Medical Services
              </h1>
              <p className="lede" style={{ fontSize: "16px", color: "#475569", lineHeight: 1.7, marginBottom: "18px" }}>
                <strong>JVM Medical Services</strong> is a premier healthcare education, neonatal clinical advisory, and medical training organization founded and directed by <strong>Dr. Janardhan Mydam, MD, FAAP</strong>.
              </p>
              <p style={{ fontSize: "14.5px", color: "#64748B", lineHeight: 1.65, marginBottom: "26px" }}>
                Our mission is dual-focused: empowering medical students and international medical graduates (IMGs) with rigorous, authentic US clinical experience (USCE), and providing hospital systems with elite neonatal resuscitation pathways, quality improvement governance, and community infant health programs.
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/education-training/tele-rotations" className="btn btn-primary btn-sm">
                  Explore Tele-Rotations &rarr;
                </Link>
                <Link href="/about/doctor" className="btn btn-gold btn-sm">
                  About Dr. Mydam
                </Link>
                <Link href="/contact" className="btn btn-outline btn-sm">
                  Contact Advisory
                </Link>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: 440, borderRadius: "16px", overflow: "hidden", boxShadow: "0 14px 35px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0" }}>
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
                  alt="JVM Medical Services Healthcare and Education"
                  style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "18px 20px", backgroundColor: "#0E182A", color: "#FFFFFF" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>JVM Medical Services · Chicago, IL</div>
                  <div style={{ fontSize: "12px", color: "#E9C989", marginTop: "4px" }}>Neonatal &amp; Pediatric Clinical Preceptorship · USCE Programs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE PILLARS */}
      <section style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 50px" }}>
            <div className="eyebrow" style={{ justifyContent: "center" }}>Core Mission &amp; Purpose</div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: "14px" }}>
              Built for Clinical Excellence &amp; Trainee Empowerment
            </h2>
            <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.6 }}>
              JVM Medical Services combines over two decades of Chicago hospital leadership with cutting-edge digital learning platforms to bridge the gap between academic theory and high-stakes bedside decision-making.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "28px" }}>
            {/* Pillar 1 */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "14px", border: "1px solid #E2E8F0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: "32px", marginBottom: "14px" }}>🩺</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "10px" }}>
                1. US Clinical Tele-Rotations (USCE)
              </h3>
              <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "14px" }}>
                Structured 4-week clinical rotations designed specifically for medical trainees seeking US residency matching. Features interactive patient cases, daily SOAP notes, preceptor feedback, and personalized letters of recommendation (LoR).
              </p>
              <ul style={{ paddingLeft: "18px", fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>
                <li>Live neonatal &amp; pediatric grand rounds</li>
                <li>Comprehensive preceptor feedback &amp; grading</li>
                <li>Attending physician signed evaluation letters</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "14px", border: "1px solid #E2E8F0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: "32px", marginBottom: "14px" }}>📝</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "10px" }}>
                2. 28-Module Board-Style Question Bank
              </h3>
              <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "14px" }}>
                High-yield question banks covering neonatology, general pediatrics, emergency resuscitation, infectious disease, and congenital cardiology formatted according to USMLE Step 2 CK and pediatric shelf exam standards.
              </p>
              <ul style={{ paddingLeft: "18px", fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>
                <li>Instant score reports &amp; peer percentiles</li>
                <li>Vivid clinical rationale for every option</li>
                <li>Dynamic faculty question updates &amp; new modules</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "14px", border: "1px solid #E2E8F0", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: "32px", marginBottom: "14px" }}>👶</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "10px" }}>
                3. Hospital Quality Advisory &amp; Protocols
              </h3>
              <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.6, marginBottom: "14px" }}>
                Consultative advisory for hospitals seeking to establish or upgrade Level II/III neonatal intensive care units, implement targeted neonatal echocardiography (TnECHO), and reduce unnecessary antibiotic exposures.
              </p>
              <ul style={{ paddingLeft: "18px", fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>
                <li>Maternal-fetal morbidity review protocols</li>
                <li>Antibiotic stewardship &amp; infection control</li>
                <li>NRP (Neonatal Resuscitation Program) certification</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXECUTIVE LEADERSHIP SPOTLIGHT */}
      <section style={{ padding: "70px 0", backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "18px", border: "1px solid #E2E8F0", padding: "40px", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "36px", alignItems: "center" }}>
              <div style={{ borderRadius: "14px", overflow: "hidden", border: "2px solid #E9C989" }}>
                <img
                  src="/images/dr-janardhan-mydam.jpg"
                  alt="Dr. Janardhan Mydam"
                  style={{ width: "100%", height: 260, objectFit: "cover", objectPosition: "top center", display: "block" }}
                />
              </div>

              <div>
                <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 10px", borderRadius: "4px", backgroundColor: "#F0FDFA", color: "#0F766E", textTransform: "uppercase" }}>
                  Founder &amp; Chief Medical Director
                </span>
                <h3 style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", margin: "8px 0 6px" }}>
                  Dr. Janardhan Mydam, MD, FAAP
                </h3>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#4338CA", marginBottom: "14px" }}>
                  Chair of Pediatrics, Humboldt Park Health · Chair of Pediatrics Academics (Volunteer), Windsor University · Attending Neonatologist, Cook County Health
                </div>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65, marginBottom: "16px" }}>
                  Dr. Mydam brings over 25 years of international clinical experience spanning India, the United Kingdom NHS, and premier US academic medical centers. Under his leadership, JVM Medical Services upholds the highest standards of evidence-based medical education, patient safety, and physician mentorship.
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <Link href="/doctor-portfolio" className="btn btn-primary btn-sm">
                    View Doctor Portfolio &rarr;
                  </Link>
                  <Link href="/about/doctor" className="btn btn-outline btn-sm">
                    Read Complete Academic CV
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPLIANCE, SECURITY & ACCREDITATION STANDARDS */}
      <section style={{ padding: "60px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "36px" }}>
            <div style={{ padding: "26px", backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🔒</div>
              <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
                HIPAA &amp; FERPA Educational Compliance
              </h4>
              <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: 1.6 }}>
                All clinical tele-rotations, case materials, and trainee assignments strictly adhere to HIPAA privacy regulations. Patient health information is completely de-identified in educational simulations, and all faculty and students execute formal educational compliance agreements.
              </p>
            </div>

            <div style={{ padding: "26px", backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>🛡️</div>
              <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>
                Multi-Factor Security &amp; Access Controls
              </h4>
              <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: 1.6 }}>
                Our digital infrastructure features mandatory Two-Factor Authentication (RFC 6238 TOTP) for all administrative and preceptor access, role-based granular permissions governed directly by Dr. Mydam, and encrypted student data repositories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER CTA */}
      <section style={{ backgroundColor: "#0E182A", padding: "60px 0", color: "#FFFFFF", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ color: "#FFFFFF", fontSize: "26px", fontWeight: 800, marginBottom: "12px" }}>
            Partner with JVM Medical Services
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14.5px", lineHeight: 1.6, marginBottom: "24px" }}>
            Whether you are a medical student seeking transformative US clinical training or a healthcare institution seeking pediatric and neonatal expertise, we welcome your inquiry.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/education-training" className="btn btn-gold">
              Explore Programs &rarr;
            </Link>
            <Link href="/contact" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#FFFFFF" }}>
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
