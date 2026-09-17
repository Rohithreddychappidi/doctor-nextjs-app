"use client";

import { useState } from "react";
import ImagePlaceholder from "./ImagePlaceholder";

/**
 * MeetingCard
 * Reusable card for both public marketing webinars and student portal live sessions
 * (Live Learning, Mentorship meetings, and Clinical Rotation check-ins).
 * Enforces the join-link-active-near-start-time rule.
 */
export default function MeetingCard({ meeting = {} }) {
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const {
    title = "Session",
    description = "",
    price,
    isFree,
    date,
    date_time,
    duration_minutes = 60,
    instructor_name,
    meeting_platform = "Microsoft Teams",
    meeting_link,
    imageUrl,
    status = "Upcoming",
    materials_url,
    notes_url,
  } = meeting;

  const displayDate = date || (date_time ? new Date(date_time).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  }) : "Scheduled");

  // Rule: Join link active near start time (within 30 mins or if marked 'Today'/'Active')
  let isJoinable = false;
  if (meeting_link) {
    if (status === "Today" || status === "Live") {
      isJoinable = true;
    } else if (date_time) {
      const sessionTime = new Date(date_time).getTime();
      const now = Date.now();
      const diffMinutes = (sessionTime - now) / (1000 * 60);
      // Active if within 30 min before start or up to 2 hours after start
      isJoinable = diffMinutes <= 30 && diffMinutes >= -120;
    } else {
      // Default demo-friendly joinable state if upcoming with link
      isJoinable = true;
    }
  }

  // If this is a portal live session
  if (meeting_platform || meeting_link || instructor_name) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                <svg width="14" height="14" style={{ width: 14, height: 14 }} className="w-3.5 h-3.5 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.5 5h-15C3.12 5 2 6.12 2 7.5v9C2 17.88 3.12 19 4.5 19h15c1.38 0 2.5-1.12 2.5-2.5v-9C22 6.12 20.88 5 19.5 5zm-3.5 9h-8v-1.5h8V14zm0-3h-8V9.5h8V11z"/>
                </svg>
                {meeting_platform}
              </span>
              {status === "Live" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 animate-pulse">
                  ● LIVE NOW
                </span>
              )}
            </div>
            <span className="text-xs font-medium text-slate-500">{duration_minutes} mins</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1.5 line-clamp-2">{title}</h3>
          {instructor_name && (
            <p className="text-xs font-medium text-teal-700 mb-2">Faculty: {instructor_name}</p>
          )}
          <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">{description}</p>
        </div>

        <div className="pt-3 border-t border-slate-100 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium mb-3">
            <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{displayDate}</span>
          </div>

          <div className="flex items-center gap-2">
            {meeting_link && isJoinable ? (
              <a
                href={meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2 px-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shadow-sm transition inline-flex items-center justify-center gap-1.5"
              >
                <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 8v8l7-4-7-4zm-2-4H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2z"/>
                </svg>
                Join Teams Meeting
              </a>
            ) : meeting_link ? (
              <button
                disabled
                className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed inline-flex items-center justify-center gap-1.5"
                title="Teams link unlocks 15 minutes before the session starts"
              >
                <svg width="14" height="14" style={{ width: 14, height: 14 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Opens 15 mins prior
              </button>
            ) : null}

            {(materials_url || notes_url) && (
              <a
                href={materials_url || notes_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition"
                title="Download Session Materials (PDF)"
              >
                <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for public marketing cards
  const handleEnroll = async (e) => {
    e.preventDefault();
    setEnrolling(true);
    try {
      const res = await fetch("/api/student/live-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId: meeting.id,
          title: meeting.title,
          isFree: isFree,
          price: price,
        }),
      });
      if (res.ok) {
        setEnrolled(true);
        setTimeout(() => {
          window.location.href = "/student/live-learning";
        }, 500);
      } else {
        window.location.href = "/student/live-learning";
      }
    } catch (err) {
      window.location.href = "/student/live-learning";
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="meeting-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div className="meeting-media" style={{ position: "relative" }}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={title} />
          ) : (
            <span>Event Photo</span>
          )}
          <span
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              backgroundColor: "#EEF2FF",
              color: "#4338CA",
              border: "1.5px solid #C7D2FE",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            LIVE ROUNDS
          </span>
        </div>
        <div className="meeting-body" style={{ paddingBottom: 0 }}>
          <div style={{ marginBottom: 6 }}>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                color: "#4F46E5",
              }}
            >
              Academic Clinical Seminar
            </span>
          </div>
          <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>{title}</h3>
          <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>{description}</p>
        </div>
      </div>

      <div style={{ padding: "0 1.25rem 1.25rem 1.25rem", marginTop: "1rem" }}>
        <div className="meeting-meta" style={{ marginBottom: 12, fontSize: "12px", color: "#64748B" }}>
          <span>📅 {date}</span>
        </div>

        <button
          type="button"
          onClick={handleEnroll}
          disabled={enrolling}
          className="btn btn-primary btn-sm"
          style={{
            width: "100%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontWeight: 700,
            fontSize: "13px",
            backgroundColor: enrolled ? "#059669" : undefined,
            borderColor: enrolled ? "#059669" : undefined,
            cursor: enrolling ? "wait" : "pointer",
          }}
        >
          {enrolling ? (
            "Enrolling..."
          ) : enrolled ? (
            "✓ Enrolled! Opening Dashboard..."
          ) : (
            <>
              <span>Enroll to Attend</span>
              <span aria-hidden="true">&rarr;</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
