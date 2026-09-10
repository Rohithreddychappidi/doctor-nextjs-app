"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import StatusTimeline from "@/components/StatusTimeline";

export default function AdminStudentDetailPage({ params }) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.studentId;

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("enrollments");

  // Enrollment Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProgramId, setNewProgramId] = useState("prog_qbank");
  const [newPlan, setNewPlan] = useState("Standard Access");
  const [newStatus, setNewStatus] = useState("Active");
  const [newPayment, setNewPayment] = useState("Paid");
  const [savingEnrollment, setSavingEnrollment] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Admin notes state
  const [adminNote, setAdminNote] = useState("");
  const [adminNotesList, setAdminNotesList] = useState([
    {
      id: "note_1",
      author: "Dr. Janardhan Mydam",
      date: "2026-08-15 14:20",
      text: "Candidate verified via Windsor University registrar. Approved for neonatal tele-rounds cohort.",
    },
    {
      id: "note_2",
      author: "Admissions Coordinator",
      date: "2026-08-14 09:15",
      text: "Immunization records and HIPAA privacy certificates reviewed and confirmed in compliance.",
    },
  ]);

  useEffect(() => {
    loadStudent();
  }, [studentId]);

  async function loadStudent() {
    try {
      const res = await fetch(`/api/admin/students/${studentId}`);
      if (res.ok) {
        const json = await res.json();
        setRecord(json.record);
      }
    } catch (e) {
      console.error("Student detail error:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateEnrollment = async (e) => {
    e.preventDefault();
    setSavingEnrollment(true);
    setFeedbackMsg("");
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          program_id: newProgramId,
          plan: newPlan,
          enrollment_status: newStatus,
          payment_status: newPayment,
        }),
      });
      if (res.ok) {
        setFeedbackMsg("Enrollment assigned successfully!");
        setShowAddModal(false);
        loadStudent();
      }
    } catch (e) {
      setFeedbackMsg("Error assigning enrollment: " + e.message);
    } finally {
      setSavingEnrollment(false);
    }
  };

  const handleUpdateStatus = async (enrollmentId, newStatusVal) => {
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: enrollmentId,
          updates: { enrollment_status: newStatusVal },
        }),
      });
      if (res.ok) {
        loadStudent();
      }
    } catch (e) {
      console.error("Update status error:", e);
    }
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!confirm("Are you sure you want to remove this enrollment?")) return;
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: enrollmentId }),
      });
      if (res.ok) {
        loadStudent();
      }
    } catch (e) {
      console.error("Delete error:", e);
    }
  };

  const handleDocumentAction = async (docId, status, feedback = "") => {
    try {
      const res = await fetch("/api/admin/documents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId, status, feedback }),
      });
      if (res.ok) {
        loadStudent();
      }
    } catch (e) {
      console.error("Doc update error:", e);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!adminNote.trim()) return;
    setAdminNotesList([
      {
        id: `note_${Date.now()}`,
        author: "Dr. Janardhan Mydam",
        date: new Date().toLocaleString(),
        text: adminNote.trim(),
      },
      ...adminNotesList,
    ]);
    setAdminNote("");
  };

  if (loading) return <AdminShell><div className="p-8 text-center text-slate-500">Loading student dossier...</div></AdminShell>;
  if (!record) return <AdminShell><div className="p-8 text-center text-slate-500">Student record not found.</div></AdminShell>;

  const { profile, enrollments = [], documents = [], certificates = [], test_attempts = [], tasks = [] } = record;

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "enrollments", label: `Programs (${enrollments.length})` },
    { id: "qbank", label: "QBank Progress" },
    { id: "courses", label: "Courses" },
    { id: "rotation", label: "Rotation Status" },
    { id: "research", label: "Research" },
    { id: "mentor", label: "Mentor" },
    { id: "documents", label: `Documents (${documents.length})` },
    { id: "meetings", label: "Meetings" },
    { id: "certificates", label: `Certificates (${certificates.length})` },
    { id: "account", label: "Account Status" },
    { id: "notes", label: "Admin Notes" },
  ];

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Link & Header */}
        <div>
          <Link href="/admin/students" className="text-xs font-semibold text-teal-700 hover:underline inline-flex items-center gap-1 mb-2">
            ← Back to Students Directory
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-900 text-amber-300 font-bold text-xl flex items-center justify-center shadow">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Student
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {profile.email} • {profile.medical_school} • Stage: <strong className="text-teal-700">{profile.usmle_stage}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 shadow-sm transition inline-flex items-center gap-1.5 shrink-0"
            >
              <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Assign / Modify Enrollment
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium">
            {feedbackMsg}
          </div>
        )}

        {/* SECTION I: Full 12-Tab Dossier Navigation */}
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? "border-teal-600 text-teal-700 bg-teal-50/50 rounded-t-lg"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Personal Information */}
        {activeTab === "personal" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Academic &amp; Student Profile Dossier</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 uppercase font-semibold block text-[10px]">Full Legal Name</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profile.first_name} {profile.last_name}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 uppercase font-semibold block text-[10px]">Email Address</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profile.email}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 uppercase font-semibold block text-[10px]">Phone Number</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profile.phone || "+1 (555) 234-5678"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 uppercase font-semibold block text-[10px]">Medical School</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profile.medical_school}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 uppercase font-semibold block text-[10px]">Graduation Year</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profile.graduation_year}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 uppercase font-semibold block text-[10px]">Country of Residence</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profile.country}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 uppercase font-semibold block text-[10px]">Specialty Career Interest</span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">{profile.specialty_interest || "Neonatology & Pediatrics"}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 uppercase font-semibold block text-[10px]">USMLE Milestone</span>
                <span className="font-bold text-teal-700 text-sm mt-0.5 block">{profile.usmle_stage}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Programs / Enrollments */}
        {activeTab === "enrollments" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Program Enrollments &amp; Access Controls</h3>
              <span className="text-xs text-slate-500">{enrollments.length} records</span>
            </div>

            <div className="divide-y divide-slate-100">
              {enrollments.map((enr) => (
                <div key={enr.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{enr.program_name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Key: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] text-slate-700">{enr.program_key}</code> • Plan: {enr.plan} • Payment: <strong className={enr.payment_status === "Paid" ? "text-emerald-700" : "text-amber-700"}>{enr.payment_status}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={enr.enrollment_status}
                      onChange={(e) => handleUpdateStatus(enr.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Paused">Paused</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => handleDeleteEnrollment(enr.id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: QBank Progress */}
        {activeTab === "qbank" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Question Bank Activity &amp; Practice Scores</h3>
            {test_attempts.length === 0 ? (
              <p className="text-xs text-slate-400">No practice attempts recorded for this student yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {test_attempts.map((att) => (
                  <div key={att.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{att.title}</h4>
                      <p className="text-[11px] text-slate-500">Mode: {att.mode} • Questions: {att.total_questions}</p>
                    </div>
                    <div className={`text-base font-extrabold ${att.score_percent >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                      {att.score_percent}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Courses */}
        {activeTab === "courses" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Video Curriculum Progress</h3>
            <p className="text-xs text-slate-600">Student enrolled in Comprehensive Pediatric &amp; Neonatal Masterclasses.</p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Mastering Neonatal Resuscitation &amp; Delivery Room Management</span>
                <p className="text-slate-500 mt-0.5">Lesson 4 of 24 in progress</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                33% Complete
              </span>
            </div>
          </div>
        )}

        {/* TAB 5: Rotation Status */}
        {activeTab === "rotation" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Clinical Placement &amp; Rounds Performance</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Virtual Neonatal &amp; Pediatric Tele-Rotation</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                  Week 4 of 6 (On Track)
                </span>
              </div>
              <p className="text-xs text-slate-600">Attending: Dr. Janardhan Mydam, MD, FAAP • Hospital: JVA Tele-Neonatology Clinical Network</p>
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-700">
                <strong>Midterm Attending Feedback:</strong> Student exhibits outstanding diagnostic reasoning regarding delivery room management and surfactant titration.
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Research */}
        {activeTab === "research" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Clinical Research Projects &amp; Manuscripts</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Delayed Cord Clamping Preterm Study</span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-semibold">
                  Manuscript Drafting
                </span>
              </div>
              <p className="text-xs text-slate-600">Role: Co-Investigator (Methods &amp; Demographics Analysis) • PI: Dr. Janardhan Mydam</p>
            </div>
          </div>
        )}

        {/* TAB 7: Mentor */}
        {activeTab === "mentor" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Faculty Mentorship Assignment</h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Dr. Janardhan Mydam, MD, FAAP</h4>
                <p className="text-xs text-slate-500">Supervising Faculty Mentor • Track: USMLE Prep &amp; Residency Matching</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800">
                Active Assignment
              </span>
            </div>
          </div>
        )}

        {/* TAB 8: Documents */}
        {activeTab === "documents" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Document Verification Queue</h3>
            <div className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{doc.title}</h4>
                    <p className="text-[11px] text-slate-500">{doc.category} • Status: <strong className="text-slate-800">{doc.status}</strong></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDocumentAction(doc.id, "Approved")}
                      className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDocumentAction(doc.id, "Revision Required", "Please re-upload with clear official university seal.")}
                      className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold hover:bg-rose-100"
                    >
                      Request Revision
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: Meetings */}
        {activeTab === "meetings" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Scheduled Microsoft Teams Consultations</h3>
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Bi-Weekly Clinical Tele-Rounds &amp; Case Conference</h4>
                <p className="text-xs text-slate-600">Thursdays at 18:00 CST • Microsoft Teams Live</p>
              </div>
              <a
                href="https://teams.microsoft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
              >
                Join Teams
              </a>
            </div>
          </div>
        )}

        {/* TAB 10: Certificates */}
        {activeTab === "certificates" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Issued Verifiable Certificates</h3>
            {certificates.length === 0 ? (
              <p className="text-xs text-slate-400">No certificates issued yet (eligible upon completion of rotation or course).</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {certificates.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{c.title}</h4>
                      <p className="text-[11px] text-slate-500">Hash: {c.verification_hash}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700">Issued</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 11: Account Status */}
        {activeTab === "account" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Account Credentials &amp; Role Management</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span>Account Authentication Status</span>
                <span className="font-bold text-emerald-700">Verified (Active)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span>Assigned System Roles</span>
                <span className="font-bold text-slate-900">Student</span>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert("Password reset link dispatched to " + profile.email)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Send Password Reset Link to Student
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: Admin Notes */}
        {activeTab === "notes" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Internal Faculty &amp; Admissions Notes</h3>
              <p className="text-xs text-slate-500">Private notes accessible only to Dr. Janardhan Mydam and system administrators.</p>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder="Write private administrative note, interview observation, or audit detail..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700"
              >
                Save Internal Note
              </button>
            </form>

            <div className="space-y-3 pt-2">
              {adminNotesList.map((n) => (
                <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-900">{n.author}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="text-xs text-slate-700">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Assigning Enrollment */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Assign Program Enrollment</h3>

              <form onSubmit={handleCreateEnrollment} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Program</label>
                  <select
                    value={newProgramId}
                    onChange={(e) => setNewProgramId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="prog_tele_rotation">Virtual Tele-Rotation (tele_rotation)</option>
                    <option value="prog_physical_rotation">US Clinical Experience (physical_rotation)</option>
                    <option value="prog_qbank">Clinical Question Bank (qbank)</option>
                    <option value="prog_live_learning">Live Clinical Classes (live_learning)</option>
                    <option value="prog_courses">Recorded Masterclasses (courses)</option>
                    <option value="prog_research">Clinical Research Mentorship (research)</option>
                    <option value="prog_mentorship">1-on-1 Faculty Mentorship (mentorship)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Plan / Cohort Description</label>
                  <input
                    type="text"
                    required
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Paused">Paused</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Payment</label>
                    <select
                      value={newPayment}
                      onChange={(e) => setNewPayment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEnrollment}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition"
                  >
                    {savingEnrollment ? "Saving..." : "Confirm Enrollment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
