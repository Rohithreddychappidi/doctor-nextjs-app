"use client";

import Link from "next/link";

/**
 * DashboardWidget
 * Reusable container shell for dynamic student dashboard modules.
 */
export default function DashboardWidget({
  title,
  subtitle,
  icon,
  badge,
  actionText,
  actionHref,
  onAction,
  className = "",
  children,
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-base truncate">{title}</h3>
              {badge && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
          </div>
        </div>

        {actionText && (
          <div>
            {actionHref ? (
              <Link
                href={actionHref}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline inline-flex items-center gap-1 shrink-0"
              >
                {actionText}
                <svg width="14" height="14" style={{ width: 14, height: 14 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : onAction ? (
              <button
                type="button"
                onClick={onAction}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline inline-flex items-center gap-1 shrink-0"
              >
                {actionText}
                <svg width="14" height="14" style={{ width: 14, height: 14 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : null}
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1">{children}</div>
    </div>
  );
}
