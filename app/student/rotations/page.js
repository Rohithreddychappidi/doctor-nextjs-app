"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EnrollmentGate from "@/components/EnrollmentGate";
import StatusTimeline from "@/components/StatusTimeline";
import DocumentList from "@/components/DocumentList";
import DocumentUploader from "@/components/DocumentUploader";

export default function StudentRotationsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [documents, setDocuments] = useState([
    {
      id: "doc_rot_1",
      title: "HIPAA & Patient Privacy Compliance Certificate",
      category: "HIPAA Compliance Certificate",
      file_name: "hipaa_training_cert.pdf",
      file_size_kb: 420,
      uploaded_at: "2026-08-12T10:00:00Z",
      status: "Approved",
      file_url: "/uploads/sample_hipaa.pdf",
    },
    {
      id: "doc_rot_2",
      title: "Immunization Record & Titer Verification",
      category: "Immunization Record",
      file_name: "immunization_titer_lab.pdf",
      file_size_kb: 1180,
      uploaded_at: "2026-08-14T15:30:00Z",
      status: "Approved",
      file_url: "/uploads/sample_immunization.pdf",
    },
    {
      id: "doc_rot_3",
      title: "Dean's Letter of Good Standing (MSPE)",
      category: "Dean's Letter (MSPE)",
      file_name: "deans_recommendation.pdf",
      file_size_kb: 890,
      uploaded_at: "2026-08-16T12:00:00Z",
      status: "Approved",
      file_url: "/uploads/sample_deans_letter.pdf",
    },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/student/rotations");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Rotations error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-500">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading rotation curriculum...</p>
      </div>
    );
  }

  const isEnrolled = !!data?.is_enrolled;
  const rotation = data?.rotation;
  const programs = data?.programs || [];

  const rotationSteps = [
    "Submitted",
    "Under Review",
    "Documents Required",
    "Approved",
    "Payment Confirmed",
    "Scheduled",
    "Active",
    "Completed",
    "Evaluation",
    "Certificate",
  ];

  return (
    <EnrollmentGate
      isEnrolled={isEnrolled}
      programKey="tele_rotation"
      programTitle="Virtual Neonatal &amp; Pediatric Tele-Rotation"
      programDescription="Complete 6 weeks of live clinical rounds, case discussions, and neonatal pathophysiology directly mentored by Dr. Janardhan Mydam."
      icon="stethoscope"
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-1.5">
              <span>🩺</span> US Clinical Experience
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Clinical Rotation &amp; Tele-Rounds Portal
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Supervising Attending: <strong>{rotation?.physician || "Dr. Janardhan Mydam, MD, FAAP"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/education-training/tele-rotations"
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition"
            >
              Curriculum Syllabus
            </Link>
            <a
              href="https://teams.microsoft.com/l/meetup-join/jva-medical-neonatology-week1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm transition inline-flex items-center gap-1.5"
            >
              <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.5 5h-15C3.12 5 2 6.12 2 7.5v9C2 17.88 3.12 19 4.5 19h15c1.38 0 2.5-1.12 2.5-2.5v-9C22 6.12 20.88 5 19.5 5zm-3.5 9h-8v-1.5h8V14zm0-3h-8V9.5h8V11z"/>
              </svg>
              Join Live Rounds (Teams)
            </a>
          </div>
        </div>

        {/* SECTION I: Pipeline Status Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Clinical Placement Pipeline</h3>
              <p className="text-xs text-slate-500">Track your progress from application review to credential issuance.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Current Stage: Active Rounds
            </span>
          </div>
          <StatusTimeline steps={rotationSteps} currentStep="Active" />
        </div>

        {/* Placement Details Card */}
        {rotation && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                  Active Clinical Cohort
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{rotation.hospital_site}</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Supervising Attending: <strong>{rotation.physician}</strong>
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-2xl font-black text-emerald-600">
                  Week {rotation.current_week} <span className="text-sm font-semibold text-slate-400">of {rotation.total_weeks}</span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {rotation.start_date} through {rotation.end_date}
                </div>
              </div>
            </div>

            {/* Live Rounds Schedule Box */}
            <div className="p-5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.5 5h-15C3.12 5 2 6.12 2 7.5v9C2 17.88 3.12 19 4.5 19h15c1.38 0 2.5-1.12 2.5-2.5v-9C22 6.12 20.88 5 19.5 5zm-3.5 9h-8v-1.5h8V14zm0-3h-8V9.5h8V11z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Multidisciplinary Neonatal Morning Rounds</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{rotation.schedule_summary}</p>
                  <p className="text-[11px] text-indigo-700 font-semibold mt-1">
                    Platform: Microsoft Teams (Meeting link active during rounds)
                  </p>
                </div>
              </div>

              <a
                href="https://teams.microsoft.com/l/meetup-join/jva-medical-neonatology-week1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm transition inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                Join Teams Meeting
              </a>
            </div>

            {/* Evaluation & Faculty Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Clinical Evaluation Status
                </h4>
                <p className="text-sm font-semibold text-emerald-700">{rotation.evaluation_status}</p>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Attending feedback: Active participant in differential diagnoses during morning rounds. Case presentation on surfactant administration received top marks.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  Certificate of Completion
                </h4>
                <p className="text-sm font-semibold text-slate-700">
                  {rotation.certificate_issued ? "Issued" : "Pending Week 6 Clinical Exit Exam"}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Upon completion of Week 6 and evaluation sign-off by Dr. Janardhan Mydam, your verifiable digital credential and LOR will be generated in Certificates.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION I: Required vs. Uploaded Documents */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Rotation Compliance Documents</h3>
              <p className="text-xs text-slate-500">All 3 required credentials verified by Dr. Janardhan Mydam.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowUploader(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition"
            >
              + Upload File
            </button>
          </div>

          <DocumentList
            documents={documents}
            onUploadClick={() => setShowUploader(true)}
            emptyMessage="No rotation documents uploaded yet."
          />
        </div>

        {/* Rotation Catalog Outline */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Rotation Programs Catalog</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => (
              <div key={prog.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{prog.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                      {prog.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{prog.curriculum}</p>
                </div>
                <div className="text-[11px] font-medium text-slate-400">
                  Duration: {prog.duration_weeks} Weeks • Accreditation Available
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DocumentUploader
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
        onSuccess={(newDoc) => setDocuments((prev) => [newDoc, ...prev])}
        defaultCategory="Immunization Record"
      />
    </EnrollmentGate>
  );
}
