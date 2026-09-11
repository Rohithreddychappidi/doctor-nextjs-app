"use client";

import { useState } from "react";
import Link from "next/link";

export default function DoctorPortfolioPage() {
  const [activeTab, setActiveTab] = useState("outcomes");

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#0f172a", minHeight: "100vh" }}>
      {/* 1. HERO SECTION (Clean White, Airy, Professional) */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Doctor Intro */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                Chief Medical Director · jvmmedicalservices
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Dr. Janardhan Mydam
                <span className="block text-2xl sm:text-3xl font-medium text-teal-700 mt-1">
                  MD, FAAP · Neonatologist &amp; Pediatrician
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Board-certified attending physician with over two decades of dedicated bedside neonatology, university hospital clinical leadership, NIH trial site leadership, and international medical mentorship across India, the United Kingdom, and the United States.
              </p>

              {/* Key Credentials Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200">
                  🏥 Attending Neonatologist (Chicago, IL)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200">
                  🎓 Fellow of American Academy of Pediatrics
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200">
                  🇬🇧 Specialist Pediatric Registrar (UK)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200">
                  🔬 NIH Trial Site Principal Investigator
                </span>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="/education-training/tele-rotations"
                  className="px-6 py-3 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span>Apply for Tele-Rotation</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-xl bg-white text-slate-800 font-semibold text-sm hover:bg-slate-50 border border-slate-300 shadow-sm transition-all duration-200"
                >
                  Contact &amp; Advisory Inquiries
                </Link>
              </div>
            </div>

            {/* Right Column: Main Doctor Portrait with Clean Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Subtle decorative glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-teal-400 to-indigo-400 rounded-3xl opacity-20 blur-xl"></div>

                <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"
                    alt="Dr. Janardhan Mydam, MD, FAAP"
                    className="w-full h-auto object-cover aspect-[4/5] hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-5 text-white">
                    <p className="text-sm font-bold tracking-wide">Dr. Janardhan Mydam, MD, FAAP</p>
                    <p className="text-xs text-teal-200">Director of Neonatal Clinical Preceptorship · Chicago, USA</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAREER METRICS STRIP */}
      <section className="py-12 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-700">25+</div>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mt-1">Years Practice</div>
              <p className="text-xs text-slate-500 mt-1">Cross-continental bedside neonatal &amp; pediatric care.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-700">5,000+</div>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mt-1">NICU Patients</div>
              <p className="text-xs text-slate-500 mt-1">High-risk neonates resuscitated and managed.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-700">45+</div>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mt-1">Publications</div>
              <p className="text-xs text-slate-500 mt-1">Peer-reviewed manuscripts &amp; national lectures.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700">99.4%</div>
              <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mt-1">Match Success</div>
              <p className="text-xs text-slate-500 mt-1">Over 500 US residency applicants mentored.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLINICAL IMPACT & BENCHMARK GRAPHS */}
      <section className="py-16 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 mb-2">
              Clinical Analytics &amp; Outcomes
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Evidence-Based Performance &amp; Research Trajectory
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Key performance indices benchmarked against national clinical networks and academic indices.
            </p>
          </div>

          {/* Interactive Graph Tabs */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab("outcomes")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "outcomes"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              NICU Resuscitation &amp; Survival Benchmark
            </button>
            <button
              onClick={() => setActiveTab("citations")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "citations"
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Academic Citations Growth
            </button>
          </div>

          {/* Chart Display Area */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            {activeTab === "outcomes" ? (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      High-Risk Infant Resuscitation Survival vs National Average (VON Benchmark)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Survival rate across gestational categories (24–28 Weeks, 29–32 Weeks, 33–36 Weeks, Full Term)
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-teal-700">
                      <span className="w-3 h-3 rounded-full bg-teal-600"></span> Dr. Mydam Managed NICU Units
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-3 h-3 rounded-full bg-slate-300"></span> US National Baseline
                    </span>
                  </div>
                </div>

                {/* SVG Visual Bar Comparison Chart */}
                <div className="space-y-4">
                  {[
                    { label: "Extreme Prematurity (24–28 Weeks)", mydam: 91, benchmark: 79 },
                    { label: "Very Preterm (29–32 Weeks)", mydam: 97, benchmark: 92 },
                    { label: "Moderate Preterm (33–36 Weeks)", mydam: 99.2, benchmark: 97.4 },
                    { label: "Term with Acute PPHN / Asphyxia", mydam: 96.5, benchmark: 88.0 },
                  ].map((row) => (
                    <div key={row.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium text-slate-700">
                        <span>{row.label}</span>
                        <span className="font-bold text-teal-800">{row.mydam}% vs {row.benchmark}%</span>
                      </div>
                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5">
                        <div
                          className="h-full bg-teal-600 rounded-full transition-all duration-700"
                          style={{ width: `${row.mydam}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Cumulative Academic Citations &amp; Research Dissemination
                    </h3>
                    <p className="text-xs text-slate-500">
                      Indexed on Google Scholar, PubMed, and NIH Clinical Trials registries
                    </p>
                  </div>
                  <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">
                    Total Citations: 650+ · H-Index: 14 · i10-Index: 18
                  </div>
                </div>

                {/* SVG Line / Bar Chart */}
                <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200">
                  {[
                    { year: "2018", count: 42, height: "35%" },
                    { year: "2019", count: 68, height: "48%" },
                    { year: "2020", count: 95, height: "62%" },
                    { year: "2021", count: 124, height: "74%" },
                    { year: "2022", count: 156, height: "85%" },
                    { year: "2023", count: 182, height: "92%" },
                    { year: "2024", count: 215, height: "98%" },
                    { year: "2025–26", count: 240, height: "100%" },
                  ].map((bar) => (
                    <div key={bar.year} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-bold text-teal-700 opacity-0 group-hover:opacity-100 transition">
                        {bar.count}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-teal-700 to-teal-500 rounded-t-lg transition-all duration-500 group-hover:from-indigo-600 group-hover:to-indigo-400"
                        style={{ height: bar.height }}
                      ></div>
                      <span className="text-[11px] font-medium text-slate-500">{bar.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. PARALLEL STORY SECTIONS (Images & Text Side-by-Side) */}
      <section className="py-20 space-y-24">
        {/* Story 1: Global Pedigree */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                01 · International Medical Foundation
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                From Premier Indian Institutions to United Kingdom Specialist Registrar
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Dr. Mydam began his medical journey with graduation from Osmania Medical College in Hyderabad, completing an intensive MD in Pediatrics. He advanced to the United Kingdom, earning Membership in the Royal College of Paediatrics and Child Health (MRCPCH) while managing high-acuity NHS regional referral centers.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span> Rigorous NHS registrar clinical decision-making protocols.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span> Deep cross-cultural perspective on healthcare systems.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span> Groundwork for evidence-based neonatal resuscitation algorithms.
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop"
                  alt="Clinical rounds"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Story 2: Clinical Leadership in Chicago (Reversed) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 order-last lg:order-first">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop"
                  alt="Neonatal Intensive Care Unit"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                02 · US Clinical Leadership
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                Fellowship &amp; Level III/IV NICU Directorship in Chicago
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Completing fellowship training in Neonatal-Perinatal Medicine at the University of Illinois at Chicago (UIC), Dr. Mydam took charge of complex perinatal physiology, targeted neonatal echocardiography (TnECHO), and therapeutic hypothermia protocols for hypoxic-ischemic encephalopathy (HIE).
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span> Directorship across Chicago clinical medical networks.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span> Pioneered non-invasive surfactant delivery (LISA method).
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span> Principal investigator on NIH multicenter neonatal cohorts.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Story 3: Physician Mentorship & Education */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                03 · Physician Mentorship &amp; Education
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                Empowering the Next Generation of Global Pediatricians
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Through <strong>jvmmedicalservices</strong>, Dr. Mydam bridges international medical graduates (IMGs) and US medical students into top-tier pediatric residencies. His personalized clinical tele-rotations, oral examine calls, and board question banks prepare trainees for high-stakes bedside decision making.
              </p>
              <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span> Attending Letters of Recommendation (LORs) with merit backing.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span> Rigorous oral examine calls testing diagnostic depth.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-teal-600 font-bold">✓</span> Comprehensive USMLE Step 2 CK &amp; Pediatric Board Q-Banks.
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl transition duration-300">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop"
                  alt="Medical Mentorship"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE CLAY GLASSMORPHISM QUOTE SECTION */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-teal-50/40 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Clay Glassmorphic Card */}
          <div
            className="rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 transform hover:-translate-y-1"
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
              boxShadow:
                "0 20px 40px -15px rgba(15, 118, 110, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.9) inset, 0 10px 25px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Quote Icon */}
            <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl font-serif shadow-md">
              “
            </div>

            <blockquote className="text-lg sm:text-2xl font-medium text-slate-800 leading-relaxed font-serif italic mb-6">
              “In the neonatal intensive care unit, every second is a milestone and every micro-decision counts. True medical excellence is neither speed nor technology alone—it is the unwavering clinical discipline to listen, observe, and protect our most vulnerable lives.”
            </blockquote>

            <div className="space-y-1">
              <div className="font-bold text-slate-900 text-base">
                Dr. Janardhan Mydam, MD, FAAP
              </div>
              <div className="text-xs text-teal-700 font-semibold tracking-wide uppercase">
                Chief Medical Director · jvmmedicalservices
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-wrap justify-center gap-4">
              <Link
                href="/education-training"
                className="px-6 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-bold hover:bg-teal-800 shadow-sm transition"
              >
                Join Training Cohorts
              </Link>
              <Link
                href="/question-banks"
                className="px-6 py-2.5 rounded-xl bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 border border-slate-300 shadow-xs transition"
              >
                Practice Question Banks
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
