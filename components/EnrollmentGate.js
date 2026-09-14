"use client";

import Link from "next/link";

/**
 * EnrollmentGate
 * Unified component wrapper verifying active enrollment for a given program.
 * Renders children if enrolled; otherwise renders a professional locked/explore upsell card.
 */
export default function EnrollmentGate({
  isEnrolled,
  programKey,
  programTitle = "Program Module",
  programDescription = "This learning module requires an active enrollment in Dr. Janardhan Mydam's clinical or educational curriculum.",
  icon = "lock",
  children,
}) {
  if (isEnrolled) {
    return <>{children}</>;
  }

  const icons = {
    lock: (
      <svg width="44" height="44" style={{ width: 44, height: 44 }} className="w-12 h-12 text-amber-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    stethoscope: (
      <svg width="44" height="44" style={{ width: 44, height: 44 }} className="w-12 h-12 text-teal-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    academic: (
      <svg width="44" height="44" style={{ width: 44, height: 44 }} className="w-12 h-12 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
  };

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
      {icons[icon] || icons.lock}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-3">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        Enrollment Required
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{programTitle}</h2>
      <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base mb-6 leading-relaxed">
        {programDescription}
      </p>

      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-6 text-left text-sm text-slate-700">
        <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
          <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          What you get upon enrollment:
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
          <li>Full access to curated curriculum, question stems, and interactive modules</li>
          <li>Direct faculty feedback from Dr. Janardhan Mydam and clinical preceptors</li>
          <li>Live interactive rounds & webinars conducted on Microsoft Teams</li>
          <li>Accredited verifiable Certificate of Completion upon finishing</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={`/student/explore?focus=${encodeURIComponent(programKey || "")}`}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 text-white font-medium hover:bg-teal-700 shadow-sm transition text-sm"
        >
          Explore Program & Enroll
        </Link>
        <Link
          href="/student/support"
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition text-sm"
        >
          Contact Faculty Support
        </Link>
      </div>
    </div>
  );
}
