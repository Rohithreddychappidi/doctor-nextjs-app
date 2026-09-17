"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardWidget from "@/components/DashboardWidget";
import StatusTimeline from "@/components/StatusTimeline";

export default function StudentDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/student/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json.dashboard);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-semibold text-sm">Loading your personalized student portal...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Error loading portal</h3>
        <p className="text-slate-600 text-sm mb-6">Could not retrieve enrollment records. Please try signing in again.</p>
        <Link
          href="/student-login"
          className="inline-block px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition"
        >
          Go to Sign In →
        </Link>
      </div>
    );
  }

  const { profile, active_enrollments = [], active_keys = [], widgets = [], notifications = [], pending_tasks = [] } = data;

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

  const researchSteps = [
    "Idea",
    "Literature Review",
    "Protocol / IRB",
    "Data Collection",
    "Manuscript Drafting",
    "Peer Review",
    "Published",
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* SECTION I: Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2">
            <span>🎓</span> USMLE Stage: {profile.usmle_stage || "Candidate"}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {profile.first_name}!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1">
            Here&apos;s what&apos;s happening with your training.
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-300">
            <span>{profile.medical_school || "Medical University"}</span>
            <span>•</span>
            <span>Graduation: {profile.graduation_year || "2026"}</span>
            <span>•</span>
            <span>{profile.country || "United States"}</span>
          </div>
        </div>

        {/* Enrolled Modules Pill Bar */}
        <div className="flex flex-wrap gap-2 max-w-md">
          {active_enrollments.map((enr) => (
            <div
              key={enr.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-xl text-xs"
            >
              <span className="text-amber-300 font-bold block text-[10px] uppercase tracking-wider">Active</span>
              <span className="font-semibold text-white truncate block max-w-[160px]">{enr.program_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION I: Global Row (Today's Schedule, Notifications, Upcoming Events, Recent Activity) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Today's Schedule */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Today&apos;s Schedule</span>
            <span className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-base font-bold text-slate-900 truncate">
            {active_keys.includes("tele_rotation")
              ? "Neonatal Live Rounds"
              : active_keys.includes("live_learning")
              ? "Live Pediatric Seminar"
              : "Self-Paced Study"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {active_keys.includes("tele_rotation")
              ? "18:00 CST • Microsoft Teams"
              : active_keys.includes("live_learning")
              ? "19:00 CST • Microsoft Teams"
              : "QBank Practice Mode Open"}
          </p>
        </div>

        {/* 2. Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Notifications</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </span>
          </div>
          <p className="text-base font-bold text-slate-900">
            {notifications.length} Unread Updates
          </p>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {notifications[0]?.title || "All notifications up to date"}
          </p>
        </div>

        {/* 3. Upcoming Events */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Upcoming Milestone</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
          </div>
          <p className="text-base font-bold text-slate-900 truncate">
            {pending_tasks[0]?.title || "Midterm Evaluation"}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Due: {pending_tasks[0]?.due_date || "End of Rotation"}
          </p>
        </div>

        {/* 4. Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recent Activity</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <p className="text-base font-bold text-slate-900">
            Active in {active_enrollments.length} Program{active_enrollments.length !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Logged in via Secure Session
          </p>
        </div>
      </div>

      {/* SECTION I & APPENDIX: Dynamic Enrolled Widget Assembly (Ordered by recent activity) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Un-enrolled Clinical Rotation Card if not active in tele_rotation */}
        {!active_keys.includes("tele_rotation") && !active_keys.includes("physical_rotation") && (
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-indigo-900/60 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  US Clinical Experience · Credential Verification Open
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Virtual Neonatal &amp; Pediatric Clinical Rotation
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Join <strong>Dr. Janardhan Mydam, MD, FAAP</strong> for live bedside tele-rounds on Microsoft Teams, neonatal resuscitation (NRP) algorithms, and clinical case presentations. Complete your credential verification to apply for faculty review.
                </p>
                <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-medium">✓ 6-Week Cohort</span>
                  <span className="flex items-center gap-1.5 font-medium">✓ Microsoft Teams Live Rounds</span>
                  <span className="flex items-center gap-1.5 font-medium">✓ Merit Faculty LOR Eligibility</span>
                  <span className="flex items-center gap-1.5 font-medium">✓ Free Scholarship &amp; Paid Options</span>
                </div>
              </div>
              <div className="shrink-0 flex flex-col gap-2.5 sm:items-end">
                <Link
                  href="/student/rotations"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm transition shadow-lg text-center flex items-center justify-center gap-2"
                >
                  <span>🩺</span>
                  <span>Apply for Clinical Rotation →</span>
                </Link>
                <Link
                  href="/education-training/tele-rotations"
                  className="text-xs text-indigo-300 hover:text-white underline text-center sm:text-right transition"
                >
                  View Curriculum &amp; Syllabus
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Un-enrolled QBank Quick Card */}
        {!active_keys.includes("qbank") && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📝</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Free Practice Available
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                USMLE &amp; Pediatric Board Question Bank
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Test your clinical judgment on high-yield neonatal, pediatric, and biostatistics vignettes with Dr. Janardhan Mydam&apos;s AI debate preceptor.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">3 Core Subject Pillars</span>
              <Link
                href="/student/qbank"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
              >
                Launch QBank →
              </Link>
            </div>
          </div>
        )}

        {/* Un-enrolled Research Quick Card */}
        {!active_keys.includes("research") && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🔬</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                  Proposals Accepted
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900">
                Clinical Research Mentorship &amp; Publications
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Collaborate with Dr. Mydam on neonatal clinical studies, retrospective audits, and IRB protocols targeting PubMed-indexed publications.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Faculty Cohort Syncs</span>
              <Link
                href="/student/research"
                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition"
              >
                Submit Proposal →
              </Link>
            </div>
          </div>
        )}

        {widgets.map((widget) => {
          // 1. Clinical Rotation Widget (Student A, D, F)
          if (widget.type === "rotation") {
            const { rotation, next_rounds, teams_join_link } = widget.data;
            return (
              <DashboardWidget
                key={widget.id}
                title="My Clinical Rotation"
                subtitle={`Week ${rotation?.current_week || 4} of ${rotation?.total_weeks || 6} • ${rotation?.physician || "Dr. Janardhan Mydam"}`}
                badge="Active Rotation"
                icon={(
                  <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                actionText="Rotation Portal"
                actionHref="/student/rotations"
                className="lg:col-span-2"
              >
                <div className="space-y-6">
                  {/* Status Timeline */}
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Application &amp; Placement Pipeline:
                    </div>
                    <StatusTimeline steps={rotationSteps} currentStep="Active" />
                  </div>

                  {/* Program Metadata Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold uppercase block text-[10px]">Supervising Attending</span>
                      <span className="font-bold text-slate-900 text-sm">{rotation?.physician || "Dr. Janardhan Mydam, MD, FAAP"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase block text-[10px]">Hospital &amp; Network</span>
                      <span className="font-semibold text-slate-800">{rotation?.hospital_site || "JVA Tele-Neonatology Network"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold uppercase block text-[10px]">Evaluation Status</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-0.5 border border-emerald-200">
                        ✓ {rotation?.evaluation_status || "On Track"}
                      </span>
                    </div>
                  </div>

                  {/* Next Live Rounds Box */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-indigo-50/70 rounded-xl border border-indigo-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.5 5h-15C3.12 5 2 6.12 2 7.5v9C2 17.88 3.12 19 4.5 19h15c1.38 0 2.5-1.12 2.5-2.5v-9C22 6.12 20.88 5 19.5 5zm-3.5 9h-8v-1.5h8V14zm0-3h-8V9.5h8V11z"/>
                        </svg>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                          Next Clinical Rounds • Microsoft Teams
                        </span>
                        <span className="text-sm font-bold text-slate-900">{next_rounds}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{rotation?.schedule_summary}</p>
                      </div>
                    </div>

                    <a
                      href={teams_join_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm transition inline-flex items-center gap-1.5 shrink-0"
                    >
                      <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 8v8l7-4-7-4zm-2-4H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z"/>
                      </svg>
                      Join Rounds on Teams
                    </a>
                  </div>
                </div>
              </DashboardWidget>
            );
          }

          // 2. Question Bank Widget (Student B, C, F)
          if (widget.type === "qbank") {
            const { questions_completed, total_questions_bank, overall_accuracy, recent_attempts = [], bookmarks_count } = widget.data;
            return (
              <DashboardWidget
                key={widget.id}
                title="Board Exam Question Bank"
                subtitle="USMLE Step 1 / Step 2 CK & Board Prep"
                badge={`${bookmarks_count || 0} Bookmarks`}
                icon={(
                  <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
                actionText="QBank Hub"
                actionHref="/student/qbank"
              >
                <div className="space-y-4">
                  {/* Performance Metrics Strip */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <div className="text-2xl font-extrabold text-slate-900">{questions_completed} / {total_questions_bank}</div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Questions Completed</div>
                    </div>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <div className={`text-2xl font-extrabold ${overall_accuracy >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                        {overall_accuracy}%
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase mt-0.5">Overall Accuracy</div>
                    </div>
                  </div>

                  {/* Recent Tests List */}
                  {recent_attempts.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Recent Test Blocks:</div>
                      <div className="space-y-1.5">
                        {recent_attempts.map((att) => (
                          <div key={att.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-xs">
                            <span className="font-semibold text-slate-800 truncate">{att.title}</span>
                            <span className={`font-bold ${att.score_percent >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                              {att.score_percent}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      href="/student/qbank/create"
                      className="flex-1 text-center py-2.5 px-4 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 shadow-sm transition"
                    >
                      + Create New Test
                    </Link>
                    <Link
                      href="/student/qbank"
                      className="py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition"
                    >
                      Review Weak Areas
                    </Link>
                  </div>
                </div>
              </DashboardWidget>
            );
          }

          // 3. Live Learning Widget (Student C, F)
          if (widget.type === "live_learning") {
            const { next_session } = widget.data;
            return (
              <DashboardWidget
                key={widget.id}
                title="Live Clinical Learning"
                subtitle="Interactive Seminars & Grand Rounds"
                badge="Microsoft Teams"
                icon={(
                  <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                actionText="All Sessions"
                actionHref="/student/live-learning"
              >
                <div className="space-y-4">
                  {next_session ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
                        Upcoming Interactive Class
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{next_session.title}</h4>
                      <p className="text-xs text-slate-600">Faculty: <strong>{next_session.instructor}</strong></p>
                      <p className="text-xs text-slate-500 mt-1">🗓 {next_session.date_time} ({next_session.duration_minutes} mins)</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">No scheduled sessions for today.</p>
                  )}

                  {next_session?.meeting_link && (
                    <a
                      href={next_session.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm transition inline-flex items-center justify-center gap-2"
                    >
                      <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.5 5h-15C3.12 5 2 6.12 2 7.5v9C2 17.88 3.12 19 4.5 19h15c1.38 0 2.5-1.12 2.5-2.5v-9C22 6.12 20.88 5 19.5 5zm-3.5 9h-8v-1.5h8V14zm0-3h-8V9.5h8V11z"/>
                      </svg>
                      Join Live Session on Teams
                    </a>
                  )}
                </div>
              </DashboardWidget>
            );
          }

          // 4. Clinical Research Widget (Student D, F)
          if (widget.type === "research") {
            const { active_projects = [], lead_mentor } = widget.data;
            const primary = active_projects[0];
            return (
              <DashboardWidget
                key={widget.id}
                title="Clinical Research Project"
                subtitle={`Lead: ${lead_mentor || "Dr. Janardhan Mydam"}`}
                badge={primary?.stage || "Active Stage"}
                icon={(
                  <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )}
                actionText="Research Workspace"
                actionHref="/student/research"
                className="lg:col-span-2"
              >
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Manuscript &amp; Publication Milestones:
                    </div>
                    <StatusTimeline steps={researchSteps} currentStep="Manuscript Drafting" />
                  </div>

                  {primary && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{primary.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Role: Investigator • IRB Protocol Approved</p>
                      </div>
                      <Link
                        href="/student/research"
                        className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition shrink-0"
                      >
                        Open Manuscript Drafts →
                      </Link>
                    </div>
                  )}
                </div>
              </DashboardWidget>
            );
          }

          // 5. Mentorship Widget (Student C, F)
          if (widget.type === "mentorship") {
            const mentorData = widget.data;
            return (
              <DashboardWidget
                key={widget.id}
                title="Faculty Mentorship"
                subtitle={mentorData.mentor_name}
                badge="1-on-1 Advisory"
                icon={(
                  <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                actionText="Mentorship Notes"
                actionHref="/student/mentorship"
              >
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{mentorData.mentor_name}</p>
                    <p className="text-xs text-slate-500">{mentorData.mentor_title}</p>
                    {mentorData.next_meeting && (
                      <div className="mt-3 pt-3 border-t border-slate-200 text-xs">
                        <span className="font-semibold text-slate-700">Next Advisory Meeting:</span>
                        <p className="text-slate-900 font-bold mt-0.5">{mentorData.next_meeting.date_time}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">Agenda: {mentorData.next_meeting.agenda}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {mentorData.next_meeting?.link && (
                      <a
                        href={mentorData.next_meeting.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition"
                      >
                        Join Advisory (Teams)
                      </a>
                    )}
                    <Link
                      href="/student/mentorship"
                      className="py-2 px-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition"
                    >
                      Request Meeting
                    </Link>
                  </div>
                </div>
              </DashboardWidget>
            );
          }

          // 6. Courses Widget
          if (widget.type === "courses") {
            const { in_progress_lesson } = widget.data;
            return (
              <DashboardWidget
                key={widget.id}
                title="Video Curriculum"
                subtitle="On-Demand Medical Masterclasses"
                badge="In Progress"
                icon={(
                  <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                actionText="My Courses"
                actionHref="/student/courses"
              >
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">Resume Lesson</span>
                    <p className="font-bold text-slate-900 text-sm">{in_progress_lesson}</p>
                  </div>
                  <Link
                    href="/student/courses"
                    className="block text-center w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition"
                  >
                    Continue Video Lesson →
                  </Link>
                </div>
              </DashboardWidget>
            );
          }

          return null;
        })}
      </div>

      {/* SECTION I: Actionable Tasks / Due Dates */}
      {pending_tasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Actionable Tasks &amp; Milestones
            </h3>
            <span className="text-xs font-medium text-slate-500">{pending_tasks.length} pending item{pending_tasks.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="space-y-2">
            {pending_tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100/70 transition"
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">📌</span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Due: {task.due_date}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                    {task.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION I: Discovery & Upsell Surface */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div>
          <h4 className="font-bold text-base sm:text-lg text-white">
            Expand Your Medical Education &amp; Clinical Credentials
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Explore US in-person hospital observerships, neonatal tele-rotations, and clinical research tracks.
          </p>
        </div>
        <Link
          href="/student/explore"
          className="px-6 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition shadow-sm shrink-0"
        >
          Explore All Programs →
        </Link>
      </div>
    </div>
  );
}
