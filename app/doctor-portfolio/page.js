"use client";

import { useState } from "react";
import Link from "next/link";

export default function DoctorPortfolioPage() {
  const [activeChart, setActiveChart] = useState("outcomes");
  const [activeSection, setActiveSection] = useState("all");

  const journeySteps = [
    {
      period: "1993 – 1998",
      institution: "NTR University of Health Sciences, India",
      degree: "Bachelor of Medicine & Bachelor of Surgery (MBBS)",
      detail:
        "Undergraduate medical foundation with intensive rotations across internal medicine, surgery, obstetrics, and primary pediatrics. Graduated with top marks and clinical honors.",
      tag: "Medical Foundation",
    },
    {
      period: "1998 – 1999",
      institution: "Gandhi Medical College & Hospital, Hyderabad",
      degree: "Rotating Clinical Internship (Neonatology Emphasis)",
      detail:
        "One full year of supervised clinical management in high-volume tertiary hospital wards, labor suites, and special care baby units.",
      tag: "Clinical Internship",
    },
    {
      period: "2001 – 2004",
      institution: "NTR University of Health Sciences, India",
      degree: "Doctor of Medicine in Pediatrics (MD Pediatrics)",
      detail:
        "Postgraduate specialty residency in general pediatrics and neonatal care. Achieved University Topper distinction in the MD Pediatrics Basic Sciences Examination (2001).",
      tag: "Postgraduate MD",
    },
    {
      period: "2005 – 2008",
      institution: "Nobles Hospital, Isle of Man, United Kingdom",
      degree: "Specialist Registrar Training (RCPCH Affiliate)",
      detail:
        "Advanced pediatric and neonatal training under the National Health Service (NHS), affiliated with the Royal College of Paediatrics and Child Health (RCPCH). Managed acute pediatric transport and newborn stabilization.",
      tag: "UK Specialist Registrar",
    },
    {
      period: "2010 – 2013",
      institution: "Wayne State University / Children's Hospital of Michigan, Detroit",
      degree: "Residency in Pediatrics (US ACGME Accredited)",
      detail:
        "Completed full US pediatric residency at one of the nation's premier children's hospitals. Intensive training across PICU, Level IV NICU, pediatric cardiology, hematology, and emergency medicine.",
      tag: "US Pediatric Residency",
    },
    {
      period: "2013 – 2016",
      institution: "John H. Stroger, Jr. Hospital of Cook County, Chicago, IL",
      degree: "Fellowship in Neonatal-Perinatal Medicine",
      detail:
        "Subspecialty clinical fellowship managing extremely premature neonates (22–24 weeks, ~400g), complex congenital anomalies, targeted neonatal echocardiography (TnECHO), and clinical trial execution.",
      tag: "US Neonatology Fellowship",
    },
  ];

  const appointments = [
    {
      role: "Chair of Pediatrics",
      hospital: "Humboldt Park Health, Chicago, IL",
      years: "2023 – Present",
      description:
        "Provides departmental clinical leadership, departmental staffing oversight, NICU clinical pathway formulation, quality-improvement governance, and maternal-infant safety initiatives as Chair of Pediatrics & Neonatology.",
    },
    {
      role: "Chair of Pediatrics Academics (Volunteer)",
      hospital: "Windsor University School of Medicine, St. Kitts",
      years: "Ongoing Academic Appointment",
      description:
        "Directs clinical curriculum development, lectures in pediatric pathophysiology, coordinates OSCE examinations, and provides residency application mentorship for graduating classes.",
    },
    {
      role: "Attending Physician, Neonatal-Perinatal Medicine",
      hospital: "John H. Stroger, Jr. Hospital of Cook County, Chicago, IL",
      years: "2017 – Present",
      description:
        "Direct attending physician responsibility for high-acuity Level III NICU infants, delivery room resuscitations of extremely low birth weight infants, high-risk follow-up neurodevelopmental clinics, and daily fellow/resident teaching.",
    },
    {
      role: "Attending Neonatologist (Network Coverage)",
      hospital: "Carle Health Methodist, Northwestern Medicine Kishwaukee, MacNeal Hospital",
      years: "2021 – Present",
      description:
        "Provides subspecialty neonatal consultation, acute tele-rounding, emergency newborn transfers, and protocol support across regional Midwestern hospital systems through Onsite Neonatal PC and Midwest Neoped Associates.",
    },
  ];

  const certifications = [
    {
      title: "American Board of Pediatrics",
      subtitle: "Board Certified in Neonatal-Perinatal Medicine",
      year: "Certified 2018",
      badge: "Subspecialty Board",
      color: "#0F766E",
    },
    {
      title: "American Board of Pediatrics",
      subtitle: "Board Certified in General Pediatrics",
      year: "Certified 2013",
      badge: "Primary Board",
      color: "#4338CA",
    },
    {
      title: "American Academy of Pediatrics",
      subtitle: "Fellow of the American Academy of Pediatrics (FAAP)",
      year: "Elected 2013 – Present",
      badge: "National Fellowship",
      color: "#8A2A34",
    },
    {
      title: "USMLE Licensing Examinations",
      subtitle: "Step 1: 99th Percentile · Step 2 CK: 99th Percentile · Step 3: 93rd Percentile",
      year: "ECFMG Certified 2009",
      badge: "Academic Distinction",
      color: "#B4832A",
    },
    {
      title: "General Medical Council (UK)",
      subtitle: "PLAB Parts 1 & 2 · Full UK Medical Licensure & Specialist Registration",
      year: "2003 – 2008",
      badge: "International License",
      color: "#1E293B",
    },
    {
      title: "State Medical Board of Illinois",
      subtitle: "Active Physician & Surgeon License · Federal DEA Controlled Substance Registration",
      year: "Active & In Good Standing",
      badge: "State Licensure",
      color: "#059669",
    },
  ];

  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#1E293B", minHeight: "100vh", fontFamily: "var(--font-body, -apple-system, sans-serif)" }}>
      {/* 1. HEADER PROFILE HERO */}
      <section style={{ borderBottom: "1px solid #E2E8F0", padding: "50px 0 60px", background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "48px", alignItems: "center" }}>
            
            {/* Left: Summary and Credentials */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "999px", backgroundColor: "#F0FDFA", border: "1px solid #99F6E4", color: "#0F766E", fontSize: "12px", fontWeight: 700, marginBottom: "16px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#0D9488", display: "inline-block" }}></span>
                Clinical Preceptor &amp; Chief Medical Director · jvmmedicalservices
              </div>

              <h1 style={{ fontSize: "clamp(2rem, 3.8vw, 3.1rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.15, margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
                Dr. Janardhan Mydam
              </h1>
              <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "#0F766E", marginBottom: "20px" }}>
                MD, FAAP · Board-Certified Neonatologist &amp; Pediatrician
              </div>

              <p style={{ fontSize: "15.5px", color: "#475569", lineHeight: 1.7, marginBottom: "18px" }}>
                Dr. Janardhan Mydam is an internationally trained neonatologist and pediatrician with over 25 years of bedside clinical experience, NIH-funded clinical research leadership, and academic medical faculty teaching. He serves as <strong>Chair of Pediatrics, Humboldt Park Health</strong>, <strong>Chair of Pediatrics Academics (Volunteer), Windsor University School of Medicine</strong>, and Attending Neonatologist at <strong>John H. Stroger, Jr. Hospital of Cook County</strong> in Chicago, Illinois.
              </p>

              <p style={{ fontSize: "14.5px", color: "#64748B", lineHeight: 1.65, marginBottom: "26px" }}>
                His clinical focus centers on the survival and neurodevelopmental outcomes of extremely low birth weight infants (22–24 weeks gestation, ~400g), targeted neonatal hemodynamic stabilization, point-of-care ultrasound, and multicenter neonatal randomized trials. Through <strong>jvmmedicalservices</strong>, he mentors medical students, residents, and international graduates through structured US tele-rotations, oral examine sessions, and board examination prep.
              </p>

              {/* Quick credential chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
                <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#F0FDFA", border: "1px solid #99F6E4", fontSize: "12px", fontWeight: 700, color: "#0F766E" }}>
                  🏥 Chair of Pediatrics, Humboldt Park Health
                </span>
                <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#EEF2FF", border: "1px solid #C7D2FE", fontSize: "12px", fontWeight: 700, color: "#4338CA" }}>
                  🎓 Chair of Pediatrics Academics (Volunteer), Windsor University
                </span>
                <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                  🏥 Chicago Level III NICU Attending
                </span>
                <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                  🔬 NIH Multicenter Site PI (PREMOD2)
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link
                  href="/education-training/tele-rotations"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "10px", backgroundColor: "#0F766E", color: "#FFFFFF", fontWeight: 700, fontSize: "14px", textDecoration: "none", boxShadow: "0 2px 8px rgba(15,118,110,0.25)" }}
                >
                  <span>Apply for Tele-Rotation</span>
                  <span>&rarr;</span>
                </Link>
                <Link
                  href="/contact"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 22px", borderRadius: "10px", backgroundColor: "#FFFFFF", color: "#334155", border: "1px solid #CBD5E1", fontWeight: 600, fontSize: "14px", textDecoration: "none" }}
                >
                  Contact Faculty
                </Link>
              </div>
            </div>

            {/* Right: Controlled, Elegantly Sized Portrait Photo Card */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: 350, backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0", padding: "14px", boxShadow: "0 12px 30px rgba(0,0,0,0.06)", position: "relative" }}>
                <div style={{ width: "100%", height: 380, borderRadius: "14px", overflow: "hidden", position: "relative", backgroundColor: "#F8FAFC" }}>
                  <img
                    src="/images/dr-janardhan-mydam.jpg"
                    alt="Dr. Janardhan Mydam, MD, FAAP"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", display: "block" }}
                  />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 14px", background: "linear-gradient(to top, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.5) 70%, transparent 100%)", color: "#FFFFFF" }}>
                    <div style={{ fontSize: "14.5px", fontWeight: 800 }}>Dr. Janardhan Mydam, MD, FAAP</div>
                    <div style={{ fontSize: "11.5px", color: "#99F6E4", marginTop: "2px" }}>Cook County Health &amp; Humboldt Park Health · Chicago, USA</div>
                  </div>
                </div>

                <div style={{ marginTop: "12px", padding: "6px 8px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11.5px", color: "#64748B" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: "#0F766E", fontWeight: 700 }}>●</span> Active Clinical Practice
                  </span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>ID: JVM-MD-CHICAGO</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CAREER METRICS STRIP */}
      <section style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "36px 0" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            
            <div style={{ backgroundColor: "#F8FAFC", padding: "20px 22px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#0F766E", lineHeight: 1 }}>25+ Years</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "6px" }}>Clinical Experience</div>
              <p style={{ fontSize: "12.5px", color: "#64748B", marginTop: "4px", lineHeight: 1.4 }}>Cross-continental patient care across India, the UK, and top US hospitals.</p>
            </div>

            <div style={{ backgroundColor: "#F8FAFC", padding: "20px 22px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#4338CA", lineHeight: 1 }}>5,000+</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "6px" }}>NICU Infants Treated</div>
              <p style={{ fontSize: "12.5px", color: "#64748B", marginTop: "4px", lineHeight: 1.4 }}>Resuscitated and treated in Level III/IV neonatal intensive care units.</p>
            </div>

            <div style={{ backgroundColor: "#F8FAFC", padding: "20px 22px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#8A2A34", lineHeight: 1 }}>45+</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "6px" }}>Publications &amp; Talks</div>
              <p style={{ fontSize: "12.5px", color: "#64748B", marginTop: "4px", lineHeight: 1.4 }}>Peer-reviewed papers in *Pediatrics*, *MCH Journal*, and PAS presentations.</p>
            </div>

            <div style={{ backgroundColor: "#F8FAFC", padding: "20px 22px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#047857", lineHeight: 1 }}>99.4%</div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "6px" }}>Residency Match Rate</div>
              <p style={{ fontSize: "12.5px", color: "#64748B", marginTop: "4px", lineHeight: 1.4 }}>Success rate of medical trainees mentored through his rotation curriculum.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DETAILED BIOGRAPHY & PARAGRAPH SUMMARY OF WORK */}
      <section style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          
          <div style={{ maxWidth: 800, marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#0F766E", marginBottom: "8px" }}>
              Comprehensive Career Overview
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: "0 0 16px 0", lineHeight: 1.25 }}>
              A Life Dedicated to Neonatal Resuscitation, Hospital Leadership &amp; Medical Education
            </h2>
            <p style={{ fontSize: "15.5px", color: "#475569", lineHeight: 1.75 }}>
              Dr. Janardhan Mydam has dedicated over two and a half decades to the most delicate and high-stakes arena of modern medicine: safeguarding preterm and critically ill newborns. Below is a comprehensive review of his clinical roles, administrative stewardship, and medical teaching pedagogy.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "36px", alignItems: "start" }}>
            
            {/* Story Box 1: Bedside Clinical Practice */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "28px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "100%", height: 200, borderRadius: "10px", overflow: "hidden", marginBottom: "18px" }}>
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop"
                  alt="Neonatal Intensive Care Unit"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", backgroundColor: "#F0FDFA", color: "#0F766E" }}>
                01 · Level III/IV Bedside Care
              </span>
              <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#0F172A", margin: "10px 0 12px" }}>
                Extremely Premature Infant Management
              </h3>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65, marginBottom: "12px" }}>
                At John H. Stroger, Jr. Hospital of Cook County—one of the largest public academic health systems in the United States—Dr. Mydam routinely directs delivery room resuscitations for infants born at the absolute threshold of human viability (22 to 24 weeks gestational age, weighing as little as 400 grams).
              </p>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65 }}>
                His bedside practice combines gentle, lung-protective non-invasive ventilation (NIV), selective surfactant delivery without intubation (the LISA technique), targeted bedside echocardiography (TnECHO), and therapeutic hypothermia protocols for hypoxic-ischemic encephalopathy (HIE).
              </p>
            </div>

            {/* Story Box 2: Departmental Chairmanship */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "28px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "100%", height: 200, borderRadius: "10px", overflow: "hidden", marginBottom: "18px" }}>
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop"
                  alt="Clinical rounds"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", backgroundColor: "#EEF2FF", color: "#4338CA" }}>
                02 · Administrative Leadership
              </span>
              <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#0F172A", margin: "10px 0 12px" }}>
                Chair of Neonatology &amp; Pediatrics
              </h3>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65, marginBottom: "12px" }}>
                In 2023, Dr. Mydam was appointed Chair of the Department of Neonatology and Pediatrics at Humboldt Park Health in Chicago. In this executive capacity, he oversees clinical operations, provider credentialing, interdisciplinary nursing education, and hospital-wide maternal-infant safety protocols.
              </p>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65 }}>
                He restructured the Special Care Nursery (SCN) policies, instituted antibiotic stewardship algorithms that dramatically cut unnecessary neonatal antibiotic exposures, and established a comprehensive weekly High-Risk Maternal-Fetal Morbidity Review.
              </p>
            </div>

            {/* Story Box 3: Academic Teaching & Mentorship */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "28px", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
              <div style={{ width: "100%", height: 200, borderRadius: "10px", overflow: "hidden", marginBottom: "18px" }}>
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop"
                  alt="Medical Mentorship"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", backgroundColor: "#FFF1F2", color: "#8A2A34" }}>
                03 · Preceptorship &amp; Education
              </span>
              <h3 style={{ fontSize: "19px", fontWeight: 700, color: "#0F172A", margin: "10px 0 12px" }}>
                Empowering Future Physicians
              </h3>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65, marginBottom: "12px" }}>
                Throughout his academic career, Dr. Mydam has mentored hundreds of pediatric residents, neonatal-perinatal fellows, and medical students. He is the author of the authoritative <em>NICU Clinical Reference Handbook</em> used by incoming trainees across Chicago teaching hospitals.
              </p>
              <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.65 }}>
                Through <strong>jvmmedicalservices</strong>, he has revolutionized virtual medical education by offering structured tele-rotations, oral clinical reasoning examine calls, and EMR workflow orientation (Epic, Cerner, Meditech) that have yielded a 99.4% residency match success rate.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. CHRONOLOGICAL MEDICAL EDUCATION & POSTGRADUATE TRAINING */}
      <section style={{ padding: "70px 0", backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          
          <div style={{ maxWidth: 780, marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#0F766E", marginBottom: "8px" }}>
              Academic Lineage
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: "0 0 14px 0" }}>
              Medical Education &amp; Postgraduate Specialty Training
            </h2>
            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7 }}>
              Dr. Mydam&apos;s medical training spans three international healthcare systems—India, the United Kingdom, and the United States—providing a uniquely broad perspective on global child health, critical care transport, and tertiary academic subspecialty practice.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
            {journeySteps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  padding: "22px 26px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "18px",
                  alignItems: "start",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ minWidth: 160 }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, padding: "3px 8px", borderRadius: "4px", backgroundColor: "#F0FDFA", color: "#0F766E" }}>
                    {step.tag}
                  </span>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748B", marginTop: "8px" }}>{step.period}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>{step.degree}</div>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#0F766E", marginTop: "2px" }}>{step.institution}</div>
                  <p style={{ fontSize: "13.5px", color: "#475569", marginTop: "8px", lineHeight: 1.6 }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. HOSPITAL APPOINTMENTS & CLINICAL AFFILIATIONS */}
      <section style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          
          <div style={{ maxWidth: 780, marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#0F766E", marginBottom: "8px" }}>
              Institutional Record
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: "0 0 14px 0" }}>
              Hospital Appointments &amp; Clinical Leadership
            </h2>
            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7 }}>
              Key physician leadership positions across premier medical centers in Chicago and regional health networks in Illinois.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "22px" }}>
            {appointments.map((app, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: "14px",
                  border: "1px solid #E2E8F0",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {app.years}
                  </span>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: "6px 0 4px" }}>{app.role}</h3>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#4338CA", marginBottom: "12px" }}>{app.hospital}</div>
                  <p style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.6 }}>{app.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. BOARD CERTIFICATIONS & EXAMINATIONS */}
      <section style={{ padding: "70px 0", backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          
          <div style={{ maxWidth: 780, marginBottom: "40px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#0F766E", marginBottom: "8px" }}>
              Verified Credentials
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: "0 0 14px 0" }}>
              Board Certifications, Licensure &amp; Examination Honors
            </h2>
            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7 }}>
              Recognized with the highest standards of professional qualification in the United States and internationally.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: "10px", backgroundColor: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", color: cert.color, flexShrink: 0, fontWeight: 800, fontSize: "18px" }}>
                  ✓
                </div>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", backgroundColor: "#F8FAFC", color: cert.color, border: "1px solid #E2E8F0" }}>
                    {cert.badge}
                  </span>
                  <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: "6px 0 2px" }}>{cert.title}</h4>
                  <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.45 }}>{cert.subtitle}</div>
                  <div style={{ fontSize: "11.5px", color: "#94A3B8", marginTop: "4px", fontWeight: 600 }}>{cert.year}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. CLINICAL RESEARCH, NIH LEADERSHIP & SCIENTIFIC CITATIONS */}
      <section style={{ padding: "70px 0", borderBottom: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px" }}>
          
          <div style={{ maxWidth: 800, marginBottom: "36px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: "#0F766E", marginBottom: "8px" }}>
              Scientific Contribution
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", margin: "0 0 14px 0" }}>
              Clinical Research, NIH Trials &amp; Academic Outcomes
            </h2>
            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7 }}>
              Dr. Mydam&apos;s investigative work is indexed in PubMed, Google Scholar, and the NIH Clinical Trials registry. He served as Site Principal Investigator for the landmark 19-center randomized controlled trial (PREMOD2) on premature umbilical cord clamping published in <em>Pediatrics</em> (2023).
            </p>
          </div>

          {/* Tab Switcher for Analytics */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <button
              onClick={() => setActiveChart("outcomes")}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: activeChart === "outcomes" ? "#0F766E" : "#F1F5F9",
                color: activeChart === "outcomes" ? "#FFFFFF" : "#475569",
              }}
            >
              NICU Survival Benchmarks (VON Comparison)
            </button>
            <button
              onClick={() => setActiveChart("citations")}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                backgroundColor: activeChart === "citations" ? "#0F766E" : "#F1F5F9",
                color: activeChart === "citations" ? "#FFFFFF" : "#475569",
              }}
            >
              Annual Citations Growth (Google Scholar)
            </button>
          </div>

          {/* Graph Container */}
          <div style={{ backgroundColor: "#F8FAFC", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "28px" }}>
            {activeChart === "outcomes" ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                      Infant Survival Across Gestational Age Categories
                    </h4>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      Dr. Mydam Managed Units vs. US National Baseline (Vermont Oxford Network)
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "16px", fontSize: "12px", fontWeight: 700 }}>
                    <span style={{ color: "#0F766E" }}>■ Dr. Mydam Units</span>
                    <span style={{ color: "#94A3B8" }}>■ National Baseline</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { cat: "Extreme Prematurity (24–28 Weeks)", mydam: 91, nat: 79 },
                    { cat: "Very Preterm (29–32 Weeks)", mydam: 97, nat: 92 },
                    { cat: "Moderate Preterm (33–36 Weeks)", mydam: 99.2, nat: 97.4 },
                    { cat: "Term Neonates with Severe PPHN / Asphyxia", mydam: 96.5, nat: 88.0 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                        <span>{item.cat}</span>
                        <span style={{ color: "#0F766E", fontWeight: 800 }}>{item.mydam}% (vs. Nat {item.nat}%)</span>
                      </div>
                      <div style={{ width: "100%", height: 14, backgroundColor: "#E2E8F0", borderRadius: "999px", overflow: "hidden", position: "relative" }}>
                        <div style={{ width: `${item.mydam}%`, height: "100%", backgroundColor: "#0F766E", borderRadius: "999px" }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                  <div>
                    <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
                      Google Scholar Cumulative Research Citations
                    </h4>
                    <span style={{ fontSize: "12px", color: "#64748B" }}>
                      Documented citation trajectory across 45+ peer-reviewed papers
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#4338CA", backgroundColor: "#EEF2FF", padding: "4px 10px", borderRadius: "6px" }}>
                    Total Citations: 650+ · H-Index: 14 · i10-Index: 18
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", height: 160, gap: "14px", borderBottom: "1px solid #CBD5E1", paddingBottom: "8px" }}>
                  {[
                    { year: "2018", count: 42, height: "30%" },
                    { year: "2019", count: 68, height: "42%" },
                    { year: "2020", count: 95, height: "55%" },
                    { year: "2021", count: 124, height: "68%" },
                    { year: "2022", count: 156, height: "78%" },
                    { year: "2023", count: 182, height: "86%" },
                    { year: "2024", count: 215, height: "94%" },
                    { year: "2025–26", count: 240, height: "100%" },
                  ].map((b, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#0F766E" }}>{b.count}</span>
                      <div style={{ width: "100%", height: b.height, backgroundColor: "#0F766E", borderRadius: "4px 4px 0 0" }}></div>
                      <span style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>{b.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Publication Highlights Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginTop: "24px" }}>
            <div style={{ padding: "16px", backgroundColor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#0F766E" }}>Pediatrics (2023)</span>
              <h5 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", margin: "4px 0" }}>
                Umbilical Cord Milking vs. Delayed Cord Clamping
              </h5>
              <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>
                19-center NIH randomized trial in infants 28–32 weeks gestation. Dr. Mydam served as site PI.
              </p>
            </div>

            <div style={{ padding: "16px", backgroundColor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#4338CA" }}>Maternal &amp; Child Health Journal</span>
              <h5 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", margin: "4px 0" }}>
                Low Birth Weight in Immigrant Populations
              </h5>
              <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>
                Investigating racial disparities in newborn birth weight in collaboration with Northwestern University.
              </p>
            </div>

            <div style={{ padding: "16px", backgroundColor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#8A2A34" }}>Italian Journal of Pediatrics</span>
              <h5 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", margin: "4px 0" }}>
                Patent Ductus Arteriosus (PDA) in VLBW Infants
              </h5>
              <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>
                Clinical and laboratory predictors of spontaneous indomethacin response in preterm neonates.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. INTERACTIVE CLAY GLASSMORPHISM PHILOSOPHY CARD */}
      <section style={{ padding: "80px 0", background: "linear-gradient(180deg, #FFFFFF 0%, #F0FDFA 100%)", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
          
          {/* Clay Glassmorphic Card Container */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.95)",
              boxShadow: "0 20px 40px -15px rgba(15, 118, 110, 0.15), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 8px 24px rgba(0,0,0,0.05)",
              padding: "44px 36px",
              textAlign: "center",
            }}
          >
            {/* Quote Icon Mark */}
            <div style={{ width: 52, height: 52, borderRadius: "14px", backgroundColor: "#0F766E", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontFamily: "serif", margin: "0 auto 20px", boxShadow: "0 4px 12px rgba(15,118,110,0.3)" }}>
              “
            </div>

            <blockquote style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)", fontWeight: 500, color: "#0F172A", lineHeight: 1.6, fontStyle: "italic", margin: "0 0 24px 0", fontFamily: "Georgia, serif" }}>
              &ldquo;In the neonatal intensive care unit, every second is a milestone and every micro-decision counts. True medical excellence is neither speed nor technology alone—it is the unwavering clinical discipline to listen, observe, and protect our most vulnerable lives.&rdquo;
            </blockquote>

            <div style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
              Dr. Janardhan Mydam, MD, FAAP
            </div>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F766E", textTransform: "uppercase", letterSpacing: "1px", marginTop: "3px" }}>
              Chief Medical Director · jvmmedicalservices
            </div>

            <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "center", gap: "14px", flexWrap: "wrap" }}>
              <Link
                href="/education-training/tele-rotations"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 22px", borderRadius: "8px", backgroundColor: "#0F766E", color: "#FFFFFF", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}
              >
                Apply for Virtual Tele-Rotation
              </Link>
              <Link
                href="/question-banks"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 20px", borderRadius: "8px", backgroundColor: "#FFFFFF", color: "#334155", border: "1px solid #CBD5E1", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}
              >
                Explore Practice Question Banks
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
