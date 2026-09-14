"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EnrollmentGate from "@/components/EnrollmentGate";
import StatusTimeline from "@/components/StatusTimeline";
import DocumentList from "@/components/DocumentList";
import DocumentUploader from "@/components/DocumentUploader";
import SectionDisclaimer from "@/components/SectionDisclaimer";

export default function StudentRotationsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payMsg, setPayMsg] = useState("");
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
  const applications = data?.applications || [];
  const latestApp = applications[0];

  const handlePayTuition = async () => {
    setPaying(true);
    setPayMsg("");
    try {
      const res = await fetch("/api/student/rotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pay_tuition" }),
      });
      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.error || "Payment processing failed");
      setPayMsg("Tuition payment confirmed! Your seat is active.");
      // Refresh rotations state
      const refreshRes = await fetch("/api/student/rotations");
      if (refreshRes.ok) {
        const refreshJson = await refreshRes.json();
        setData(refreshJson);
      }
    } catch (e) {
      alert("Payment error: " + e.message);
    } finally {
      setPaying(false);
    }
  };

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

  // If student has an application that is approved or pending review, show dedicated workflow
  if (!isEnrolled && latestApp) {
    const isApproved = latestApp.status === "Approved" || latestApp.status === "Approved - Payment Pending";
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-3xl shadow-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center text-2xl mx-auto mb-4 border border-teal-200">
          {isApproved ? "🎉" : "📋"}
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 mb-3">
          Status: {latestApp.status}
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
          {isApproved
            ? "Your Tele-Rotation Application is Approved!"
            : "Application Under Faculty Review"}
        </h2>

        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed">
          {isApproved
            ? "Dr. Janardhan Mydam has reviewed and approved your medical background and credentials. Complete tuition payment below to confirm your seat in the upcoming cohort and activate Microsoft Teams Pro rounds."
            : `Your application submitted on ${new Date(latestApp.applied_at || Date.now()).toLocaleDateString()} is currently being evaluated by attending preceptor Dr. Janardhan Mydam.`}
        </p>

        {payMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold mb-4">
            ✓ {payMsg}
          </div>
        )}

        {isApproved ? (
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-lg mx-auto text-left mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Virtual Tele-Rotation Tuition</h4>
                <p className="text-xs text-slate-500">6-Week USCE Immersion &amp; Attending LOR</p>
              </div>
              <span className="text-2xl font-black text-teal-700">$1,250</span>
            </div>

            <ul className="text-xs text-slate-600 space-y-2 mb-6 border-t border-slate-200/80 pt-4">
              <li className="flex items-center gap-2">✓ Microsoft Teams Pro live bedside rounds (multi-session weekly)</li>
              <li className="flex items-center gap-2">✓ 1-on-1 Graded Examine Calls with clinical rubric feedback</li>
              <li className="flex items-center gap-2">✓ Cloud recording playback access &amp; AI clinical summaries</li>
              <li className="flex items-center gap-2">✓ Merit-based Attending Physician Letter of Recommendation (LOR)</li>
            </ul>

            <button
              onClick={handlePayTuition}
              disabled={paying}
              className="w-full py-3.5 px-6 rounded-xl bg-teal-700 text-white font-bold text-sm hover:bg-teal-800 shadow-md transition flex items-center justify-center gap-2"
            >
              {paying ? "Processing Payment & Unlocking Cohort..." : "💳 Pay Tuition & Join Cohort Now ($1,250)"}
            </button>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto text-xs text-slate-600 mb-6">
            <p className="m-0">
              <strong>Applicant:</strong> {latestApp.applicant_name} ({latestApp.applicant_email})
            </p>
            <p className="mt-1 mb-0">
              <strong>Target Timing:</strong> {latestApp.timing_preference || "Evenings CST"}
            </p>
          </div>
        )}

        <div className="flex justify-center gap-4 text-xs font-semibold">
          <Link href="/education-training/tele-rotations" className="text-teal-700 hover:underline">
            View Rotation Curriculum Syllabus →
          </Link>
          <Link href="/student/dashboard" className="text-slate-500 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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

        {/* Section Compliance Disclaimer (Admin Controlled) */}
        <SectionDisclaimer sectionKey="tele_rotations" />

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

            {/* SECTION: Flexible Multi-Meeting Clinical Schedule */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                    Live Clinical Sessions &amp; Examine Calls
                  </h3>
                  <p className="text-xs text-slate-500">
                    Multiple scheduled rounds, graded oral examine calls, and faculty check-ins per week.
                  </p>
                </div>
                <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs">
                  <span className="px-2.5 py-1 rounded-md font-semibold text-slate-700 bg-white shadow-xs">
                    {data?.meetings?.length || 0} Scheduled Sessions
                  </span>
                </div>
              </div>

              {/* Meetings List */}
              <div className="grid grid-cols-1 gap-3.5">
                {(data?.meetings || []).map((meet) => {
                  const isExamine = meet.meeting_type === "Examine Call";
                  const isCompleted = meet.status === "Completed";
                  const typeColors = {
                    "Live Teaching Session": "bg-blue-50 text-blue-700 border-blue-200",
                    "Examine Call": "bg-amber-50 text-amber-800 border-amber-200 font-bold",
                    "Mentor Check-in": "bg-teal-50 text-teal-700 border-teal-200",
                    "Make-up Session": "bg-indigo-50 text-indigo-700 border-indigo-200",
                    "Orientation Call": "bg-emerald-50 text-emerald-700 border-emerald-200",
                  };
                  const badgeColor = typeColors[meet.meeting_type] || "bg-slate-100 text-slate-700 border-slate-200";

                  return (
                    <div
                      key={meet.id}
                      className={`p-4 sm:p-5 rounded-xl border transition-all ${
                        isExamine
                          ? "bg-amber-50/40 border-amber-200 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isExamine ? "bg-amber-600 text-white" : "bg-indigo-600 text-white"
                            }`}
                          >
                            {isExamine ? (
                              <span style={{ fontSize: 18 }}>⚖️</span>
                            ) : (
                              <svg width="18" height="18" style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.5 5h-15C3.12 5 2 6.12 2 7.5v9C2 17.88 3.12 19 4.5 19h15c1.38 0 2.5-1.12 2.5-2.5v-9C22 6.12 20.88 5 19.5 5zm-3.5 9h-8v-1.5h8V14zm0-3h-8V9.5h8V11z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${badgeColor}`}>
                                {meet.meeting_type}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium">
                                ⏱️ {meet.duration_minutes} mins
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  isCompleted
                                    ? "bg-slate-100 text-slate-600"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                {meet.status}
                              </span>
                            </div>

                            <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                              {meet.title}
                            </h4>
                            <p className="text-xs text-slate-600 mt-1">
                              <strong>Date &amp; Time:</strong>{" "}
                              {new Date(meet.scheduled_at).toLocaleString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                timeZoneName: "short",
                              })}
                            </p>

                            {/* Teams Pro Room Credentials */}
                            {(meet.teams_meeting_id || meet.teams_passcode) && (
                              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-600 font-mono bg-slate-100/80 px-2.5 py-1 rounded-md">
                                <span><strong>Teams Room ID:</strong> {meet.teams_meeting_id || "Direct URL"}</span>
                                {meet.teams_passcode && <span><strong>Passcode:</strong> {meet.teams_passcode}</span>}
                                <span className="font-sans font-bold text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                                  Teams Pro
                                </span>
                              </div>
                            )}

                            {meet.notes && (
                              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                                <strong>Topic &amp; Clinical Syllabus:</strong> {meet.notes}
                              </p>
                            )}

                            {/* Teams Pro AI Clinical Recap */}
                            {meet.ai_summary && (
                              <div className="mt-2 p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 leading-relaxed">
                                <span className="font-bold text-indigo-800 flex items-center gap-1 mb-0.5">
                                  <span>🤖</span> Teams Pro AI Clinical Recap:
                                </span>
                                {meet.ai_summary}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 items-end">
                          {isCompleted && meet.recording_url ? (
                            <a
                              href={meet.recording_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5 justify-center w-full md:w-auto bg-indigo-700 text-white hover:bg-indigo-800"
                            >
                              <span>▶</span> Watch Cloud Recording (Teams Pro)
                            </a>
                          ) : meet.teams_join_url ? (
                            <a
                              href={meet.teams_join_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5 justify-center w-full md:w-auto bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                              <svg width="15" height="15" style={{ width: 15, height: 15 }} viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.5 5h-15C3.12 5 2 6.12 2 7.5v9C2 17.88 3.12 19 4.5 19h15c1.38 0 2.5-1.12 2.5-2.5v-9C22 6.12 20.88 5 19.5 5zm-3.5 9h-8v-1.5h8V14zm0-3h-8V9.5h8V11z" />
                              </svg>
                              Join Teams Meeting
                            </a>
                          ) : null}
                          {meet.materials_url && (
                            <a
                              href={meet.materials_url}
                              download
                              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition inline-flex items-center gap-1"
                            >
                              📄 Session Materials
                            </a>
                          )}
                        </div>
                      </div>

                      {/* If Graded Examine Call: Detailed Assessment Breakdown */}
                      {isExamine && meet.score !== null && (
                        <div className="mt-4 pt-3.5 border-t border-amber-200/70 bg-white p-3.5 rounded-xl border">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                Oral Examine Evaluation Result:
                              </span>
                              <span className="px-2 py-0.5 rounded text-xs font-extrabold bg-emerald-100 text-emerald-800">
                                Score: {meet.score}/100 ({meet.pass_fail || "Pass"})
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              Evaluator: {meet.physician}
                            </span>
                          </div>
                          {meet.grader_notes && (
                            <p className="text-xs text-slate-700 mt-2 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                              &ldquo;{meet.grader_notes}&rdquo;
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Evaluation & Faculty Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Clinical Evaluation Status
                </h4>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-emerald-700">{rotation.evaluation_status}</p>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Grade: Honors (92%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Attending feedback: Outstanding presentation on exchange transfusion indications. Active participant in differential diagnoses during morning rounds. Surfactant administration presentation received top marks.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  Certificate &amp; US LOR Issuance
                </h4>
                <p className="text-sm font-semibold text-slate-700">
                  {rotation.certificate_issued ? "Issued" : "Pending Week 6 Clinical Exit Exam"}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Upon completion of Week 6 and evaluation sign-off by Dr. Janardhan Mydam, your verifiable digital credential and clinical Letter of Recommendation (LOR) will be generated in Certificates.
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
