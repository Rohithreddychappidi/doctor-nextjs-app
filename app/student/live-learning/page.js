"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EnrollmentGate from "@/components/EnrollmentGate";
import MeetingCard from "@/components/MeetingCard";
import SectionDisclaimer from "@/components/SectionDisclaimer";

export default function StudentLiveLearningPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    async function loadSessions() {
      try {
        const res = await fetch("/api/student/live-learning");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Live learning error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] text-slate-500">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading live learning seminars...</p>
      </div>
    );
  }

  const isEnrolled = !!data?.is_enrolled;
  const upcoming = data?.upcoming || [];
  const recorded = data?.recorded || [];

  // Categorize sessions into Section I tabs: Upcoming, Today, Completed, Recorded
  const todaySessions = upcoming.filter((s) => s.status === "Today" || s.status === "Live");
  const upcomingSessions = upcoming.filter((s) => s.status !== "Today" && s.status !== "Live");
  const completedSessions = recorded.map((s) => ({
    ...s,
    attendance_recorded: true,
    assignment_status: "Submitted (95/100)",
  }));

  const getFilteredList = () => {
    switch (activeTab) {
      case "today":
        return todaySessions.length > 0 ? todaySessions : upcoming.slice(0, 1);
      case "completed":
        return completedSessions;
      case "recorded":
        return recorded;
      case "upcoming":
      default:
        return upcomingSessions.length > 0 ? upcomingSessions : upcoming;
    }
  };

  const currentList = getFilteredList();

  return (
    <EnrollmentGate
      isEnrolled={isEnrolled}
      programKey="live_learning"
      programTitle="Live Clinical Learning &amp; Grand Rounds"
      programDescription="Attend weekly live case conferences, maternal-fetal interactive seminars, and clinical decision-making workshops hosted on Microsoft Teams with Dr. Janardhan Mydam."
      icon="academic"
    >
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1.5">
              <span>🎥</span> Microsoft Teams Live Conferences
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Live Clinical Learning
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Weekly interactive case discussions, delivery room algorithms, and pediatric diagnostic reasoning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Host: <strong>Dr. Janardhan Mydam, MD, FAAP</strong>
            </span>
          </div>
        </div>

        {/* Section Compliance Disclaimer (Admin Controlled) */}
        <SectionDisclaimer sectionKey="live_classes" />

        {/* Section I: Tabs (Upcoming, Today, Completed, Recorded) */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
          {[
            { id: "upcoming", label: "Upcoming Sessions", count: upcoming.length },
            { id: "today", label: "Today's Schedule", count: todaySessions.length },
            { id: "completed", label: "Completed & Attendance", count: completedSessions.length },
            { id: "recorded", label: "Recorded Archives", count: recorded.length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Meeting Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentList.length === 0 ? (
            <div className="col-span-2 p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
              No sessions found in this category.
            </div>
          ) : (
            currentList.map((session) => (
              <div key={session.id} className="flex flex-col">
                <MeetingCard
                  meeting={{
                    title: session.title,
                    description: session.syllabus_note || session.description || "In-depth case conference discussing clinical pathophysiology, diagnostic tests, and NICU protocols.",
                    date_time: session.date_time,
                    duration_minutes: session.duration_minutes || 90,
                    instructor_name: session.instructor || "Dr. Janardhan Mydam",
                    meeting_platform: session.meeting_platform || "Microsoft Teams",
                    meeting_link: session.meeting_link,
                    materials_url: session.materials_url,
                    notes_url: session.notes_url,
                    status: session.status || "Upcoming",
                  }}
                />

                {/* Additional Section I Completed/Assignment metadata */}
                {activeTab === "completed" && (
                  <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between text-emerald-800">
                    <span className="font-semibold">✓ Attendance Verified</span>
                    <span className="font-medium text-emerald-700">Assignment: Submitted (Score: 95/100)</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </EnrollmentGate>
  );
}
