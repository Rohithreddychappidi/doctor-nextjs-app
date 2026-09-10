"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EnrollmentGate from "@/components/EnrollmentGate";
import StatusTimeline from "@/components/StatusTimeline";
import DocumentList from "@/components/DocumentList";
import DocumentUploader from "@/components/DocumentUploader";

export default function StudentResearchPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [files, setFiles] = useState([
    {
      id: "file_res_1",
      title: "IRB Approved Research Protocol & Informed Consent",
      category: "IRB Training / Ethics",
      file_name: "irb_preterm_delayed_cord_protocol.pdf",
      file_size_kb: 1420,
      uploaded_at: "2026-06-10T11:00:00Z",
      status: "Approved",
      file_url: "/uploads/sample_irb.pdf",
    },
    {
      id: "file_res_2",
      title: "Manuscript Working Draft v2.4 (Introduction & Methods)",
      category: "Manuscript Draft",
      file_name: "manuscript_draft_v2_4.docx",
      file_size_kb: 780,
      uploaded_at: "2026-09-02T16:00:00Z",
      status: "Under Review",
      file_url: "/uploads/sample_manuscript.docx",
      feedback: "Review Table 1 demographics and add p-values for gestational age comparisons.",
    },
    {
      id: "file_res_3",
      title: "De-identified Cohort Dataset & Statistical Analysis (SPSS)",
      category: "Other",
      file_name: "cohort_neonatal_transition_data.xlsx",
      file_size_kb: 2150,
      uploaded_at: "2026-08-20T09:30:00Z",
      status: "Approved",
      file_url: "/uploads/sample_dataset.xlsx",
    },
  ]);

  useEffect(() => {
    async function loadResearch() {
      try {
        const res = await fetch("/api/student/research");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Research load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResearch();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-500">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading research projects...</p>
      </div>
    );
  }

  const isEnrolled = !!data?.is_enrolled;
  const projects = data?.projects || [];
  const tasks = data?.tasks || [];

  const researchStages = [
    "Idea",
    "Literature Review",
    "Protocol / IRB",
    "Data Collection",
    "Manuscript Drafting",
    "Peer Review",
    "Published",
  ];

  return (
    <EnrollmentGate
      isEnrolled={isEnrolled}
      programKey="research"
      programTitle="Clinical Research &amp; PubMed Publication Mentorship"
      programDescription="Co-author multicenter clinical research studies, IRB protocol documentation, and peer-reviewed neonatal manuscripts under the direct mentorship of Dr. Janardhan Mydam."
      icon="academic"
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-1.5">
              <span>🔬</span> Academic Medicine &amp; Publications
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Clinical Research Workspace
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Principal Investigator &amp; Mentor: <strong>Dr. Janardhan Mydam, MD, FAAP</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUploader(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 shadow-sm transition inline-flex items-center gap-1.5"
            >
              <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Upload Manuscript Draft
            </button>
          </div>
        </div>

        {/* Projects List & Detail */}
        <div className="space-y-6">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {proj.specialty || "Neonatal Medicine"} Clinical Investigation
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{proj.title}</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Lead Principal Investigator: <strong>{proj.lead_investigator || "Dr. Janardhan Mydam, MD, FAAP"}</strong> • Study ID: <span className="font-mono text-slate-500">{proj.id}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Stage: {proj.stage || "Manuscript Drafting"}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">IRB Approval: Active</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {proj.description || "Investigating hemodynamic transition in preterm infants undergoing delayed cord clamping compared with immediate umbilical cord clamping. Multicenter prospective observational study designed for submission to the Journal of Perinatology."}
              </p>

              {/* SECTION I: Research Stage Status Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Research Pipeline &amp; Publication Milestones:
                </h4>
                <StatusTimeline steps={researchStages} currentStep={proj.stage || "Manuscript Drafting"} />
              </div>

              {/* Research Team & Advisory Strip */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Your Contributor Role</span>
                  <span className="font-bold text-slate-800">Co-Investigator (Methods &amp; Data Analysis)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Target Journal</span>
                  <span className="font-bold text-slate-800">Journal of Perinatology (PubMed Indexed)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Faculty Reviewer</span>
                  <span className="font-bold text-teal-700">Dr. Janardhan Mydam</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION I: Research Project Files & Manuscripts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Study Documents &amp; Manuscript Drafts</h3>
              <p className="text-xs text-slate-500">Private research file vault for drafts, protocol certificates, and statistical runs.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowUploader(true)}
              className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition"
            >
              + Upload File
            </button>
          </div>

          <DocumentList
            documents={files}
            onUploadClick={() => setShowUploader(true)}
            emptyMessage="No research files uploaded yet."
          />
        </div>

        {/* Actionable Research Tasks */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                Assigned Research Deliverables
              </h3>
              <span className="text-xs text-slate-500 font-medium">{tasks.length} open items</span>
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 self-start sm:self-auto shrink-0">
                    Due: {task.due_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <DocumentUploader
        isOpen={showUploader}
        onClose={() => setShowUploader(false)}
        onSuccess={(newDoc) => setFiles((prev) => [newDoc, ...prev])}
        defaultCategory="Manuscript Draft"
      />
    </EnrollmentGate>
  );
}
