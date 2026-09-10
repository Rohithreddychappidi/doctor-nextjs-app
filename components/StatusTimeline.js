"use client";

/**
 * StatusTimeline
 * Reusable visual pipeline tracker for multi-stage workflows (Clinical Rotations, Research Projects).
 *
 * Props:
 * - steps: Array of step strings (e.g. ["Submitted", "Under Review", ...])
 * - currentStep: The active step name (string) or index (number)
 * - orientation: "horizontal" (default) or "vertical"
 */
export default function StatusTimeline({
  steps = [],
  currentStep,
  orientation = "horizontal",
}) {
  if (!steps || steps.length === 0) return null;

  // Resolve current index
  let currentIndex = 0;
  if (typeof currentStep === "number") {
    currentIndex = Math.max(0, Math.min(currentStep, steps.length - 1));
  } else if (typeof currentStep === "string") {
    const idx = steps.findIndex((s) => s.toLowerCase() === currentStep.toLowerCase());
    if (idx !== -1) currentIndex = idx;
  }

  if (orientation === "vertical") {
    return (
      <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={step} className="relative flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition z-10 ${
                  isDone
                    ? "bg-teal-600 text-white shadow-sm"
                    : isCurrent
                    ? "bg-amber-500 text-white ring-4 ring-amber-100 shadow"
                    : "bg-slate-100 text-slate-400 border border-slate-300"
                }`}
              >
                {isDone ? (
                  <svg width="14" height="14" style={{ width: 14, height: 14 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <div className="pt-0.5">
                <p className={`text-sm font-medium ${isCurrent ? "text-amber-900 font-semibold" : isDone ? "text-slate-800" : "text-slate-400"}`}>
                  {step}
                </p>
                {isCurrent && (
                  <span className="inline-block mt-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Current Stage
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal orientation
  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="min-w-[680px] flex items-center justify-between relative">
        {/* Continuous background bar */}
        <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-teal-600 transition-all duration-300"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center text-center group">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition duration-200 ${
                  isDone
                    ? "bg-teal-600 text-white shadow-sm"
                    : isCurrent
                    ? "bg-amber-500 text-white ring-4 ring-amber-100 shadow-md scale-110"
                    : "bg-white text-slate-400 border-2 border-slate-200"
                }`}
              >
                {isDone ? (
                  <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`mt-2 text-[11px] font-medium max-w-[80px] leading-tight transition ${
                  isCurrent
                    ? "text-amber-800 font-bold"
                    : isDone
                    ? "text-slate-800 font-semibold"
                    : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
