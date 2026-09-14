"use client";

import Link from "next/link";
import StatStrip from "@/components/StatStrip";
import JourneyTimeline from "@/components/JourneyTimeline";
import CitationChart from "@/components/CitationChart";
import ScholarCard from "@/components/ScholarCard";
import { Accordion, AccordionItem } from "@/components/Accordion";
import { useSiteData } from "@/lib/DataContext";

const COUNT_LABELS = [
  ["publications", "Publications"],
  ["oralPresentations", "Oral Presentations"],
  ["posterPresentations", "Poster Presentations"],
  ["manuscriptReviews", "Manuscript Reviews"],
  ["journalsReviewed", "Journals Reviewed For"],
  ["citedByInvestigators", "Cited By Investigators"],
];

export default function CompleteDoctorInfoPage() {
  const { content } = useSiteData();
  const c = content.about;

  return (
    <div style={{ backgroundColor: "#FFFFFF", color: "#1E293B", minHeight: "100vh" }}>
      {/* 1. HERO SECTION */}
      <section className="hero" style={{ padding: "60px 0 40px", background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)", borderBottom: "1px solid #E2E8F0" }}>
        <div className="container hero-grid" style={{ gridTemplateColumns: "0.85fr 1.15fr", alignItems: "center", gap: "40px" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 12px 32px rgba(0,0,0,0.1)", maxWidth: 360, margin: "0 auto", border: "1px solid #E2E8F0" }}>
            <img
              src="/images/dr-janardhan-mydam.jpg"
              alt="Dr. Janardhan Mydam, MD, FAAP"
              style={{ width: "100%", height: 440, objectFit: "cover", objectPosition: "top center", display: "block" }}
            />
            <div style={{ padding: "14px 16px", backgroundColor: "#0E182A", color: "#FFFFFF", textAlign: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: 700 }}>Dr. Janardhan Mydam, MD, FAAP</div>
              <div style={{ fontSize: "11px", color: "#E9C989", marginTop: "2px" }}>Chicago Level III NICU Attending &amp; Academic Preceptor</div>
            </div>
          </div>

          <div>
            <div className="eyebrow">Faculty Profile &amp; Complete Bio</div>
            <h1 style={{ marginBottom: 14, fontSize: "clamp(2rem, 3.2vw, 2.7rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
              Dr. Janardhan Mydam, MD, FAAP
            </h1>
            <p className="lede" style={{ marginBottom: 14, fontSize: "16px", color: "#0F766E", fontWeight: 600 }}>
              Board-Certified Neonatologist &amp; Pediatrician · Preceptor &amp; Clinical Researcher
            </p>

            {/* Official Appointment Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
              <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#F0FDFA", border: "1px solid #99F6E4", fontSize: "12px", fontWeight: 700, color: "#0F766E" }}>
                🏥 Chair of Pediatrics, Humboldt Park Health
              </span>
              <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#EEF2FF", border: "1px solid #C7D2FE", fontSize: "12px", fontWeight: 700, color: "#4338CA" }}>
                🎓 Chair of Pediatrics Academics (Volunteer), Windsor University
              </span>
              <span style={{ padding: "5px 12px", borderRadius: "6px", backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0", fontSize: "12px", fontWeight: 600, color: "#334155" }}>
                👶 Attending Neonatologist, Cook County Health
              </span>
            </div>

            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "16px" }}>
              Dr. Janardhan Mydam is an internationally recognized neonatologist and pediatric clinician-educator with over 25 years of specialized bedside medical care. He serves as <strong>Chair of Pediatrics, Humboldt Park Health</strong> in Chicago, <strong>Chair of Pediatrics Academics (Volunteer), Windsor University School of Medicine</strong>, and Attending Physician in Neonatal-Perinatal Medicine at <strong>John H. Stroger, Jr. Hospital of Cook County</strong>.
            </p>

            <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.65, marginBottom: "24px" }}>
              Throughout his career spanning India, the United Kingdom (NHS / Nobles Hospital), and premier United States institutions (Wayne State University, Children’s Hospital of Michigan, and Cook County Health), Dr. Mydam has combined rigorous bedside clinical resuscitation with multicenter clinical trials (including NIH-funded PREMOD2) and extensive physician mentoring.
            </p>

            <div className="hero-actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/doctor-portfolio" className="btn btn-primary btn-sm">
                View Executive Portfolio &rarr;
              </Link>
              <Link href="/about/company" className="btn btn-gold btn-sm">
                About JVM Medical Services
              </Link>
              <Link href="/education-training/tele-rotations" className="btn btn-outline btn-sm">
                Apply for Tele-Rotation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STAT STRIP */}
      <div className="container" style={{ margin: "30px auto" }}>
        <StatStrip />
      </div>

      {/* 3. EXTENSIVE CLINICAL JOURNEY */}
      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Medical Career Timeline</div>
              <h2>From Medical School in India to US Clinical Leadership</h2>
            </div>
            <p className="lede">
              A comprehensive chronological journey spanning foundational MBBS &amp; MD degrees in India, specialist registrar training in the UK NHS, and neonatology fellowship, NIH research, and hospital chairmanship in Chicago, USA.
            </p>
          </div>
          <JourneyTimeline items={c.journey} />
        </div>
      </section>

      {/* 4. GOOGLE SCHOLAR CITATIONS & RESEARCH IMPACT */}
      <section className="section center">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: "center" }}>Academic Publications &amp; Research Citations</div>
          <h2 style={{ marginBottom: 12 }}>Google Scholar Citation Metrics</h2>
          <p className="lede mx-auto" style={{ marginBottom: 36, maxWidth: 680 }}>
            Dr. Mydam’s research on umbilical cord milking, delayed cord clamping, extremely low birth weight infants, and maternal-infant health disparities is cited by hundreds of investigative teams across the world.
          </p>
          <CitationChart data={c.citationsByYear} />
          <ScholarCard profile={c.scholarProfile} />
        </div>
      </section>

      {/* 5. ALL 18 CV SECTIONS CMS ACCORDION */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Comprehensive Academic Curriculum Vitae</div>
              <h2>Appointments, Certifications, Peer Reviews &amp; Teaching</h2>
            </div>
            <p className="lede">
              Complete, authoritative record maintained directly through our medical faculty CMS. Click any category below to expand clinical entries, hospital appointments, publications, and curriculum contributions.
            </p>
          </div>

          {c.sections.map((section, idx) => (
            <Accordion
              key={section.key}
              index={idx + 1}
              label={section.label}
              meta={`${section.items.length} records`}
              driveLink={section.driveLink}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {section.items.map((it, itemIdx) => (
                  <AccordionItem
                    key={itemIdx}
                    title={it.title}
                    meta={it.meta}
                    body={it.body}
                  />
                ))}
              </div>
            </Accordion>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section style={{ backgroundColor: "#0E182A", padding: "60px 0", color: "#FFFFFF" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: 700 }}>
          <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px", color: "#E9C989", marginBottom: "10px" }}>
            US Clinical Experience &amp; Research Preceptorship
          </div>
          <h2 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 800, marginBottom: "14px" }}>
            Train Directly with Dr. Janardhan Mydam
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", lineHeight: 1.6, marginBottom: "26px" }}>
            Enrolled medical students receive direct mentorship, live seminar discussions, daily case review, and board-style question coaching across all stages of their clinical journey.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/education-training/tele-rotations" className="btn btn-gold">
              Apply for Tele-Rotation &rarr;
            </Link>
            <Link href="/contact" className="btn btn-outline" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#FFFFFF" }}>
              Request Advisory Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
