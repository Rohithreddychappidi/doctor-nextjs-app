"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EnrollmentGate from "@/components/EnrollmentGate";

export default function StudentQBankPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQBank() {
      try {
        const res = await fetch("/api/student/qbank");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("QBank load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadQBank();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-500">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading Question Bank...</p>
      </div>
    );
  }

  const isEnrolled = !!data?.is_enrolled;
  const questions = data?.questions || [];
  const recent_attempts = data?.recent_attempts || [];
  const bookmarks = data?.bookmarks || [];

  const lastAttempt = recent_attempts[0];

  return (
    <EnrollmentGate
      isEnrolled={isEnrolled}
      programKey="qbank"
      programTitle="Board-Style Clinical Question Bank"
      programDescription="Comprehensive clinical question bank covering USMLE Step 1, Step 2 CK, and Pediatric Shelf exams with dual-level rationales authored by Dr. Janardhan Mydam."
      icon="academic"
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 mb-1.5">
              <span>📝</span> Board Exam Preparation
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Clinical Question Bank Hub
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Master clinical decision-making with USMLE-formatted clinical vignettes and detailed explanations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/student/qbank/create"
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-700 shadow-sm transition inline-flex items-center gap-1.5"
            >
              + Create Practice Block
            </Link>
          </div>
        </div>

        {/* SECTION I: QBank Home Hero Row (Continue Previous Test / Performance) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Continue / Resume Block */}
          <div className="md:col-span-2 p-6 bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                Active Test Session
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {lastAttempt ? lastAttempt.title : "High-Yield Pediatric Shelf Block"}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                {lastAttempt
                  ? `Completed ${lastAttempt.total_questions} questions in ${lastAttempt.mode} mode • Score: ${lastAttempt.score_percent}%`
                  : "Ready to launch your next timed clinical reasoning practice session."}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-6">
              {lastAttempt ? (
                <Link
                  href={`/student/qbank/results/${lastAttempt.id}`}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition shadow-sm inline-flex items-center gap-1.5"
                >
                  Review Test Results →
                </Link>
              ) : null}
              <Link
                href="/student/qbank/create"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20"
              >
                Launch New Block
              </Link>
            </div>
          </div>

          {/* Performance Overview Tile */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall QBank Metrics</span>
              <div className="mt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Total Questions in Bank</span>
                  <span className="text-sm font-bold text-slate-900">{questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Completed Blocks</span>
                  <span className="text-sm font-bold text-slate-900">{recent_attempts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">Saved Bookmarks</span>
                  <span className="text-sm font-bold text-amber-600">{bookmarks.length}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">Identified Weak Areas:</span>
              <span className="inline-block text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Neonatal Sepsis Screening (55% Accuracy)
              </span>
            </div>
          </div>
        </div>

        {/* SECTION I: Recent Tests List & Detailed Rationales */}
        {recent_attempts.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Recent Practice Test Blocks</h3>
              <span className="text-xs text-slate-500">{recent_attempts.length} blocks completed</span>
            </div>

            <div className="divide-y divide-slate-100">
              {recent_attempts.map((att) => (
                <div key={att.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{att.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mode: <span className="font-medium text-slate-700">{att.mode}</span> • Total Questions: {att.total_questions}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-lg font-extrabold ${att.score_percent >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                        {att.score_percent}%
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Score</span>
                    </div>

                    <Link
                      href={`/student/qbank/results/${att.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                    >
                      Review Rationales →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Bank Explorer & Bookmarks */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Featured Clinical Question Vignettes</h3>
              <p className="text-xs text-slate-500">Practice questions with in-depth explanations for why correct choices are right and distractors are wrong.</p>
            </div>
            <Link
              href="/student/qbank/create"
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Test Mode →
            </Link>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold text-[10px]">
                      {q.subject}
                    </span>
                    <span className="text-slate-500 font-medium">System: {q.system}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{q.exam}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                  <strong>Question {idx + 1}:</strong> {q.stem}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </EnrollmentGate>
  );
}
