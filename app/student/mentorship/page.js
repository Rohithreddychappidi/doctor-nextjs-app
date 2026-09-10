"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EnrollmentGate from "@/components/EnrollmentGate";

export default function StudentMentorshipPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestedTime, setRequestedTime] = useState("");
  const [requestAgenda, setRequestAgenda] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    async function loadMentorship() {
      try {
        const res = await fetch("/api/student/mentorship");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Mentorship error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMentorship();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-500">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading mentorship advisory...</p>
      </div>
    );
  }

  const isEnrolled = !!data?.is_enrolled;
  const mentor = data?.mentor;
  const tasks = data?.tasks || [];

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setRequestSent(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSent(false);
      setRequestAgenda("");
      setRequestedTime("");
    }, 1800);
  };

  return (
    <EnrollmentGate
      isEnrolled={isEnrolled}
      programKey="mentorship"
      programTitle="1-on-1 Faculty Mentorship &amp; Residency Advisory"
      programDescription="Direct personalized guidance from Dr. Janardhan Mydam on your USMLE preparation strategy, ERAS personal statement editing, specialty matching, and mock residency interviews."
      icon="academic"
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-1.5">
              <span>👨‍⚕️</span> Executive Clinical Advisory
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Faculty Mentorship Workspace
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Supervising Mentor: <strong>Dr. Janardhan Mydam, MD, FAAP</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowRequestModal(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 shadow-sm transition inline-flex items-center gap-1.5"
            >
              <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Request 1:1 Meeting
            </button>
          </div>
        </div>

        {/* Mentor Profile & Active Match */}
        {mentor && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-900 text-amber-300 font-bold text-xl flex items-center justify-center shadow">
                  JM
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    Lead Attending Mentor
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">{mentor.mentor_name}</h2>
                  <p className="text-xs text-slate-500">{mentor.mentor_title}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 uppercase text-[10px] font-semibold block">Focus Track</span>
                <span className="font-bold text-slate-800">{mentor.track || "USMLE Prep & ERAS Residency Matching"}</span>
              </div>
            </div>

            {/* Scheduled 1:1 Consultation Box */}
            {mentor.next_meeting && (
              <div className="p-5 bg-indigo-50/70 rounded-xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.5 5h-15C3.12 5 2 6.12 2 7.5v9C2 17.88 3.12 19 4.5 19h15c1.38 0 2.5-1.12 2.5-2.5v-9C22 6.12 20.88 5 19.5 5zm-3.5 9h-8v-1.5h8V14zm0-3h-8V9.5h8V11z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                      Next Confirmed Advisory Session
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">{mentor.next_meeting.date_time}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <strong>Agenda:</strong> {mentor.next_meeting.agenda}
                    </p>
                  </div>
                </div>

                <a
                  href={mentor.next_meeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm transition inline-flex items-center justify-center gap-1.5 shrink-0"
                >
                  Join Teams Meeting
                </a>
              </div>
            )}

            {/* Faculty Feedback Notes & Strategic Recommendations */}
            {mentor.feedback_notes?.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-slate-500">
                  Faculty Recommendations &amp; Direct Feedback
                </h3>
                <div className="space-y-3">
                  {mentor.feedback_notes.map((fb, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-bold text-slate-800">{fb.author}</span>
                        <span>{fb.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{fb.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION I: Mentor-Assigned Tasks (Cross-Module Links) */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Mentor-Assigned Action Items &amp; Next Steps
              </h3>
              <span className="text-xs text-slate-500 font-medium">{tasks.length} tasks</span>
            </div>

            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 gap-3"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Due: {task.due_date}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentorship Curated Resources */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-base text-white">ERAS Residency Matching Toolkit</h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Access Dr. Janardhan Mydam&apos;s personal statement blueprint, pediatric program ranking templates, and interview prep questions.
            </p>
          </div>
          <Link
            href="/student/documents"
            className="px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition shrink-0"
          >
            Open Document Vault →
          </Link>
        </div>
      </div>

      {/* Request Meeting Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Request 1:1 Consultation with Dr. Mydam</h3>
            {requestSent ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs text-center font-semibold">
                ✓ Consultation request submitted! Dr. Mydam&apos;s office will confirm your Microsoft Teams calendar invite.
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time Window</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next Tuesday at 18:00 CST"
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Discussion Agenda</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. USMLE Step 2 CK study timeline review &amp; ERAS pediatric program list."
                    value={requestAgenda}
                    onChange={(e) => setRequestAgenda(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 transition"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </EnrollmentGate>
  );
}
