"use client";

import { useState } from "react";
import Link from "next/link";
import HomeBanner from "@/components/HomeBanner";
import StatStrip from "@/components/StatStrip";
import MeetingCard from "@/components/MeetingCard";
import TestimonialCard from "@/components/TestimonialCard";
import { useSiteData } from "@/lib/DataContext";

const CLINICAL_GALLERY = [
  {
    title: "Level III Neonatal Intensive Care Unit",
    subtitle: "High-acuity resuscitation suites & Giraffe incubators for extremely premature infants (22–24 weeks).",
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop",
    category: "NICU Resuscitation",
  },
  {
    title: "Bedside Clinical Rounds & Patient Management",
    subtitle: "Interdisciplinary daily rounds integrating lung-protective ventilation and non-invasive surfactant.",
    imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    category: "Clinical Care",
  },
  {
    title: "Academic Seminar & Pathophysiology Lecture",
    subtitle: "Weekly live clinical case conferences, neonatal EEG reviews, and EMR workflow teaching.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    category: "Medical Education",
  },
  {
    title: "Targeted Neonatal Echocardiography (TnECHO)",
    subtitle: "Point-of-care hemodynamics, cardiac output monitoring, and patent ductus arteriosus evaluation.",
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop",
    category: "Clinical Technology",
  },
  {
    title: "Simulated OSCE & Trainee Skills Workshop",
    subtitle: "Hands-on neonatal resuscitation simulation (NRP) for medical students and pediatric residents.",
    imageUrl: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?q=80&w=800&auto=format&fit=crop",
    category: "Simulated OSCE",
  },
  {
    title: "Community Maternal-Infant Health Outreach",
    subtitle: "Multicultural health literacy seminars, newborn wellness advocacy, and immigrant family guidance.",
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop",
    category: "Community Impact",
  },
];

export default function HomePage() {
  const { content, meetings, testimonials } = useSiteData();
  const c = content.home;
  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#1E293B" }}>
      {/* 1. TOP FULL-BLEED HERO BANNER */}
      <section style={{ padding: "24px 0 10px" }}>
        <div className="container" style={{ maxWidth: 1280 }}>
          <HomeBanner />
        </div>
      </section>

      {/* 2. STAT STRIP */}
      <div className="container" style={{ margin: "24px auto 36px", maxWidth: 1280 }}>
        <StatStrip />
      </div>

      {/* 3. SECTION 1: DOCTOR PORTFOLIO & LEADERSHIP SHOWCASE */}
      <section className="section" style={{ padding: "60px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="responsive-split-grid">
            <div style={{ position: "relative" }}>
              <div style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 16px 36px rgba(14,24,42,0.12)", border: "1px solid #E2E8F0" }}>
                <img
                  src="/images/dr-janardhan-mydam.jpg"
                  alt="Dr. Janardhan Mydam"
                  style={{ width: "100%", height: "clamp(260px, 40vw, 460px)", objectFit: "cover", objectPosition: "top center", display: "block" }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-14px",
                  right: "14px",
                  backgroundColor: "#0E182A",
                  color: "#FFFFFF",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                  border: "1px solid #B4832A",
                }}
              >
                <div style={{ fontSize: "10.5px", fontWeight: 700, color: "#E9C989", textTransform: "uppercase" }}>25+ Years Experience</div>
                <div style={{ fontSize: "14px", fontWeight: 800 }}>Dr. Janardhan Mydam, MD, FAAP</div>
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ color: "#0F766E" }}>Menu Spotlight · Doctor Portfolio</div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, margin: "10px 0 16px" }}>
                Academic Leadership &amp; Board-Certified Neonatology
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
                <span style={{ padding: "4px 10px", borderRadius: "6px", backgroundColor: "#F0FDFA", border: "1px solid #99F6E4", fontSize: "12px", fontWeight: 700, color: "#0F766E" }}>
                  🏥 Chair of Pediatrics, Humboldt Park Health
                </span>
                <span style={{ padding: "4px 10px", borderRadius: "6px", backgroundColor: "#EEF2FF", border: "1px solid #C7D2FE", fontSize: "12px", fontWeight: 700, color: "#4338CA" }}>
                  🎓 Chair of Pediatrics Academics (Volunteer), Windsor University
                </span>
                <span style={{ padding: "4px 10px", borderRadius: "6px", backgroundColor: "#F1F5F9", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                  👶 Attending Neonatologist, Cook County Health
                </span>
              </div>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "18px" }}>
                With an international medical trajectory spanning MBBS and MD distinction in India, UK NHS Specialist Registrar training, and ACGME pediatric residency &amp; neonatology fellowship in Detroit and Chicago, Dr. Mydam provides authoritative clinical preceptor guidance and institutional hospital stewardship.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/doctor-portfolio" className="btn btn-primary btn-sm">
                  View Doctor Portfolio &rarr;
                </Link>
                <Link href="/about/doctor" className="btn btn-gold btn-sm">
                  Complete Info About Doctor
                </Link>
                <Link href="/about/company" className="btn btn-outline btn-sm">
                  About JVM Medical Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION 2: EDUCATION & TRAINING (USCE TELE-ROTATIONS) */}
      <section className="section soft" style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="responsive-split-grid reverse">
            <div>
              <div className="eyebrow">Menu Spotlight · Education &amp; Training</div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, margin: "10px 0 16px" }}>
                Structured US Clinical Tele-Rotations &amp; Case Rounds
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "18px" }}>
                Designed specifically for medical students and international medical graduates preparing for US residency matching. Enrolled scholars participate in weekly Microsoft Teams live rounds, neonatal morbidity conferences, EMR navigation (Epic &amp; Cerner), and daily patient SOAP notes evaluated directly by faculty preceptors.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "24px" }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "14px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>🩺</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>Real Patient Scenarios</div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>Extremely preterm &amp; pediatric inpatient management</div>
                </div>
                <div style={{ backgroundColor: "#FFFFFF", padding: "14px", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>📝</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>Merit-Based LoR</div>
                  <div style={{ fontSize: "12px", color: "#64748B" }}>Personalized attending physician letter of recommendation</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/education-training/tele-rotations" className="btn btn-primary btn-sm">
                  Explore Tele-Rotation Cohorts &rarr;
                </Link>
                <Link href="/education-training" className="btn btn-outline btn-sm">
                  View Education Hub
                </Link>
              </div>
            </div>

            <div>
              <div style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 14px 35px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0" }}>
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop"
                  alt="Medical Students and Preceptor in Clinical Training"
                  style={{ width: "100%", height: "clamp(220px, 35vw, 360px)", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "16px 20px", backgroundColor: "#0E182A", color: "#FFFFFF" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>Virtual Tele-Rotation Clinical Hub</div>
                  <div style={{ fontSize: "12px", color: "#E9C989", marginTop: "2px" }}>Weekly Live Rounds · Case Writeups · EMR Orientation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 3: QUESTION BANKS & FREE MOCK EXAMS */}
      <section className="section" style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="responsive-split-grid">
            <div style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 14px 35px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0" }}>
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=800&auto=format&fit=crop"
                alt="Medical Question Bank and Board Prep"
                style={{ width: "100%", height: "clamp(220px, 35vw, 360px)", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "16px 20px", backgroundColor: "#0E182A", color: "#FFFFFF" }}>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>28-Module Dynamic Board Question Bank</div>
                <div style={{ fontSize: "12px", color: "#5EEAD4", marginTop: "2px" }}>USMLE Step 2 CK · Pediatric Shelf · Peer Analytics</div>
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ color: "#4338CA" }}>Menu Spotlight · Question Banks</div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, margin: "10px 0 16px" }}>
                Board-Style Reasoning with Verified Explanations
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "18px" }}>
                Master clinical reasoning across 28 specialized modules including neonatal jaundice, early-onset sepsis, congenital heart defects, and acute pediatric resuscitation. Every question contains thorough explanations demonstrating why the correct choice is right and why each distractor is incorrect.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                <div style={{ backgroundColor: "#F0FDF4", padding: "12px 18px", borderRadius: "10px", border: "1px solid #BBF7D0" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#15803D" }}>100% Free</div>
                  <div style={{ fontSize: "12px", color: "#166534" }}>Full access during current promotion</div>
                </div>
                <div style={{ backgroundColor: "#EEF2FF", padding: "12px 18px", borderRadius: "10px", border: "1px solid #C7D2FE" }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#4338CA" }}>28 Modules</div>
                  <div style={{ fontSize: "12px", color: "#3730A3" }}>Dynamic faculty question updates</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/question-banks" className="btn btn-gold btn-sm" style={{ fontWeight: 700 }}>
                  Take Free Mock Test &rarr;
                </Link>
                <Link href="/student-signup" className="btn btn-outline btn-sm">
                  Create Student Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SECTION 4: RESEARCH & INVESTIGATOR MENTORSHIP */}
      <section className="section soft" style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="responsive-split-grid reverse">
            <div>
              <div className="eyebrow" style={{ color: "#0284C7" }}>Menu Spotlight · Research &amp; Publications</div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, margin: "10px 0 16px" }}>
                Multicenter Clinical Trials &amp; Investigator Mentorship
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "18px" }}>
                Dr. Mydam serves as site Principal Investigator on the NIH-funded PREMOD2 clinical trial evaluating umbilical cord milking versus delayed cord clamping in premature neonates. His published investigative record in <em>Pediatrics</em> and <em>Maternal and Child Health Journal</em> provides trainees a platform to learn study design, biostatistics, and abstract preparation.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#FFFFFF", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600 }}>
                  🔬 NIH Multicenter Site PI
                </span>
                <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#FFFFFF", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600 }}>
                  📊 212+ Global Citations
                </span>
                <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#FFFFFF", border: "1px solid #CBD5E1", fontSize: "12px", fontWeight: 600 }}>
                  📜 75+ Peer Reviews across 24 Journals
                </span>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/research" className="btn btn-primary btn-sm">
                  Explore Research Studies &rarr;
                </Link>
                <Link href="/about/doctor" className="btn btn-outline btn-sm">
                  View Academic Citations
                </Link>
              </div>
            </div>

            <div>
              <div style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 14px 35px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0" }}>
                <img
                  src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800&auto=format&fit=crop"
                  alt="Clinical Research and Neonatal Data Science"
                  style={{ width: "100%", height: "clamp(220px, 35vw, 360px)", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "16px 20px", backgroundColor: "#0E182A", color: "#FFFFFF" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>Investigator Research Mentorship</div>
                  <div style={{ fontSize: "12px", color: "#E9C989", marginTop: "2px" }}>PAS Presentations · Study Design · Biostatistics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 5: CLINICAL GUIDANCE FOR FAMILIES */}
      <section className="section" style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="responsive-split-grid">
            <div style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 14px 35px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0" }}>
              <img
                src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=800&auto=format&fit=crop"
                alt="Newborn Care and Family Guidance"
                style={{ width: "100%", height: "clamp(220px, 35vw, 360px)", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "16px 20px", backgroundColor: "#0E182A", color: "#FFFFFF" }}>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>Compassionate Family Educational Advisory</div>
                <div style={{ fontSize: "12px", color: "#FCA5A5", marginTop: "2px" }}>NICU Discharge · Growth &amp; Development · Neonatal Guidance</div>
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ color: "#E11D48" }}>Menu Spotlight · Clinical Guidance</div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, margin: "10px 0 16px" }}>
                Educational Guidance for Parents &amp; Families
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "18px" }}>
                Navigating a newborn’s health, prematurity diagnosis, or hospital discharge can be overwhelming. Dr. Mydam offers compassionate, non-diagnostic educational telephone consultations to help families understand medical jargon, prepare for follow-up appointments, and support neurodevelopment.
              </p>
              <div style={{ padding: "14px 18px", backgroundColor: "#FFF1F2", borderRadius: "10px", border: "1px solid #FECDD3", marginBottom: "22px", fontSize: "13.5px", color: "#9F1239" }}>
                <strong>No-Fee Educational Service:</strong> Consultations are provided freely as part of our platform mission to bridge health literacy for families in need.
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/clinical-services" className="btn btn-primary btn-sm">
                  Request Clinical Guidance &rarr;
                </Link>
                <Link href="/contact" className="btn btn-outline btn-sm">
                  Contact Consultation Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION 6: NEWBORN CARE PROGRAMS & INSTITUTIONAL ADVISORY */}
      <section className="section soft" style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="responsive-split-grid reverse">
            <div>
              <div className="eyebrow" style={{ color: "#D97706" }}>Menu Spotlight · Newborn Care Programs</div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, margin: "10px 0 16px" }}>
                Hospital NICU Development &amp; Advisory Services
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "18px" }}>
                Strategic consultative guidance for regional hospitals, healthcare systems, and medical colleges seeking to establish or modernize Level II/III nurseries, institute antibiotic stewardship protocols, and build mother-baby safety programs.
              </p>
              <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "#475569", lineHeight: 1.7, marginBottom: "22px" }}>
                <li>Special Care Nursery (SCN) clinical protocol design</li>
                <li>Targeted neonatal echocardiography (TnECHO) implementation</li>
                <li>Multidisciplinary NRP neonatal resuscitation team training</li>
              </ul>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/advisory-services" className="btn btn-primary btn-sm">
                  Learn About Advisory Services &rarr;
                </Link>
                <Link href="/advisory-services/nicu-development" className="btn btn-outline btn-sm">
                  NICU Expansion Guidance
                </Link>
              </div>
            </div>

            <div>
              <div style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 14px 35px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0" }}>
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
                  alt="Modern Hospital and Medical Center"
                  style={{ width: "100%", height: "clamp(220px, 35vw, 360px)", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "16px 20px", backgroundColor: "#0E182A", color: "#FFFFFF" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700 }}>Hospital System Consulting &amp; Clinical Safety</div>
                  <div style={{ fontSize: "12px", color: "#FCD34D", marginTop: "2px" }}>Quality Improvement · SCN Accreditation · Mortality Reduction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. SECTION 7: COMMUNITY HEALTH & MATERNAL IMPACT */}
      <section className="section" style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1200 }}>
          <div className="responsive-split-grid">
            <div style={{ borderRadius: "18px", overflow: "hidden", boxShadow: "0 14px 35px rgba(0,0,0,0.1)", border: "1px solid #E2E8F0" }}>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop"
                alt="Community Health and Healthcare Outreach"
                style={{ width: "100%", height: "clamp(220px, 35vw, 360px)", objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "16px 20px", backgroundColor: "#0E182A", color: "#FFFFFF" }}>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>Global &amp; Local Community Health</div>
                <div style={{ fontSize: "12px", color: "#6EE7B7", marginTop: "2px" }}>Pulse Polio India · Cook County Outreach · Health Literacy</div>
              </div>
            </div>

            <div>
              <div className="eyebrow" style={{ color: "#059669" }}>Menu Spotlight · Community Health</div>
              <h2 style={{ fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, margin: "10px 0 16px" }}>
                Community Outreach &amp; Healthcare Navigation
              </h2>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "18px" }}>
                Dr. Mydam’s volunteer service spans decades: from India’s National Pulse Polio Immunization Program to British developmental clinics, to health education broadcasts with Congressman Danny K. Davis in Cook County. We support immigrant families in understanding preventive care, vaccinations, and US health coverage navigation.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link href="/community-impact" className="btn btn-primary btn-sm">
                  View Community Initiatives &rarr;
                </Link>
                <Link href="/contact" className="btn btn-outline btn-sm">
                  Partner with Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SECTION 8: CONTACT & DIRECT APPOINTMENT BOOKING */}
      <section className="section soft" style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container" style={{ maxWidth: 1000, textAlign: "center" }}>
          <div className="eyebrow" style={{ justifyContent: "center", color: "#7C3AED" }}>Menu Spotlight · Contact &amp; Inquiries</div>
          <h2 style={{ fontSize: "clamp(1.9rem, 3vw, 2.5rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, margin: "10px 0 16px" }}>
            Connect with JVM Medical Services
          </h2>
          <p style={{ fontSize: "15.5px", color: "#64748B", lineHeight: 1.65, maxWidth: "700px", margin: "0 auto 30px" }}>
            Whether you are applying for tele-rotations, requesting an institutional lecture, seeking clinical guidance for your family, or inquiring about research collaboration, our administration follows up directly.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn btn-primary" style={{ padding: "13px 28px" }}>
              Submit Online Inquiry &rarr;
            </Link>
            <Link href="/student-login" className="btn btn-outline" style={{ padding: "13px 24px" }}>
              Log In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* 11. CLINICAL PHOTO GALLERY (Curated high-res imagery at bottom) */}
      <section style={{ padding: "80px 0 90px", backgroundColor: "#0E182A", color: "#FFFFFF" }}>
        <div className="container" style={{ maxWidth: 1240 }}>
          <div style={{ textAlign: "center", maxWidth: 740, margin: "0 auto 50px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "#E9C989", marginBottom: "10px" }}>
              Clinical Environment &amp; Academic Atmosphere
            </div>
            <h2 style={{ color: "#FFFFFF", fontSize: "clamp(2rem, 3.2vw, 2.6rem)", fontWeight: 800, marginBottom: "14px" }}>
              Clinical Photo Gallery
            </h2>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", lineHeight: 1.65 }}>
              Explore the clinical facilities, high-acuity neonatal intensive care suites, simulation workshops, and academic teaching sessions that define the JVM Medical Services environment.
            </p>
          </div>

          <div className="clinical-gallery-grid">
            {CLINICAL_GALLERY.map((item, idx) => (
              <div
                key={idx}
                className="clinical-gallery-card"
                onClick={() => setActivePhoto(item)}
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                }}
              >
                <div style={{ width: "100%", height: "clamp(120px, 24vw, 230px)", overflow: "hidden", position: "relative" }}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s ease" }}
                  />
                  <div style={{ position: "absolute", top: "8px", right: "8px", padding: "2px 8px", borderRadius: "12px", backgroundColor: "rgba(14,24,42,0.85)", border: "1px solid rgba(233,201,137,0.4)", color: "#E9C989", fontSize: "9.5px", fontWeight: 700 }}>
                    {item.category}
                  </div>
                </div>

                <div style={{ padding: "12px 14px" }}>
                  <h4 style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, marginBottom: "4px" }}>
                    {item.title}
                  </h4>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "11.5px", lineHeight: 1.4, margin: 0 }}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Photo Modal Lightbox */}
          {activePhoto && (
            <div
              onClick={() => setActivePhoto(null)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15,23,42,0.88)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                padding: "20px",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  backgroundColor: "#0E182A",
                  borderRadius: "16px",
                  maxWidth: "760px",
                  width: "100%",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ width: "100%", height: "420px", overflow: "hidden", backgroundColor: "#000" }}>
                  <img
                    src={activePhoto.imageUrl}
                    alt={activePhoto.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#E9C989", textTransform: "uppercase" }}>
                      {activePhoto.category}
                    </span>
                    <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#FFFFFF", margin: "4px 0 6px" }}>
                      {activePhoto.title}
                    </h3>
                    <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                      {activePhoto.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActivePhoto(null)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      border: "none",
                      color: "#FFFFFF",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    Close ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

