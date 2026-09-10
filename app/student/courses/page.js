"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EnrollmentGate from "@/components/EnrollmentGate";

export default function StudentCoursesPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/student/courses");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Courses load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-500">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading curriculum masterclasses...</p>
      </div>
    );
  }

  const isEnrolled = !!data?.is_enrolled;
  const courses = data?.courses || [];

  return (
    <EnrollmentGate
      isEnrolled={isEnrolled}
      programKey="courses"
      programTitle="Recorded Clinical Masterclasses &amp; Video Modules"
      programDescription="Full on-demand access to Dr. Janardhan Mydam's 24-lesson clinical curriculum with chest radiograph interpretations, delivery room algorithms, and high-yield board pearls."
      icon="academic"
    >
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1.5">
              <span>📺</span> On-Demand Video Curriculum
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Clinical Video Masterclasses
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              High-yield video modules with clinical pearls, chest radiograph breakdowns, and physiological rationales.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Faculty: <strong>Dr. Janardhan Mydam, MD, FAAP</strong>
            </span>
          </div>
        </div>

        {/* Video Player Preview if a lesson is selected */}
        {activeLesson && (
          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Playing Module Lesson
              </span>
              <button
                type="button"
                onClick={() => setActiveLesson(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                ✕ Close Player
              </button>
            </div>
            <h3 className="text-lg font-bold text-white">{activeLesson.title}</h3>

            {/* Simulated Player */}
            <div className="aspect-video w-full bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg cursor-pointer transition transform hover:scale-105">
                <svg width="28" height="28" style={{ width: 28, height: 28 }} className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-xs text-slate-400 mt-4">
                Streaming high-definition video from secure CDN ({activeLesson.duration})
              </p>
            </div>
          </div>
        )}

        {/* Courses & Syllabus */}
        <div className="space-y-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {course.category}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{course.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.total_modules} Modules • {course.total_duration} Total Content Duration
                  </p>
                </div>

                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Enrolled • 100% Lifetime Access
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {course.description}
              </p>

              {/* Modules Syllabus List */}
              <div className="space-y-4">
                {course.modules?.map((mod) => (
                  <div key={mod.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm">{mod.title}</h3>
                    <div className="space-y-2">
                      {mod.lessons?.map((lsn) => (
                        <div
                          key={lsn.id}
                          className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-teal-500 transition cursor-pointer"
                          onClick={() => setActiveLesson(lsn)}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              lsn.completed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                            }`}>
                              {lsn.completed ? "✓" : "▶"}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-teal-700">
                              {lsn.title}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400 font-medium">{lsn.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </EnrollmentGate>
  );
}
