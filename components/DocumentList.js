"use client";

/**
 * DocumentList
 * Reusable table displaying documents, verification statuses, and download/view actions.
 * Shared between Student Documents, Rotation Required Documents, and Research Files.
 */
export default function DocumentList({
  documents = [],
  onUploadClick,
  onViewFeedback,
  readOnly = false,
  emptyMessage = "No documents found in this section.",
}) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <svg width="12" height="12" style={{ width: 12, height: 12 }} className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Approved
          </span>
        );
      case "Under Review":
      case "Pending Review":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Under Review
          </span>
        );
      case "Revision Required":
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <svg width="12" height="12" style={{ width: 12, height: 12 }} className="w-3 h-3 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Revision Required
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {status || "Uploaded"}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5">Document Title / File</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Upload Date</th>
              <th className="px-5 py-3.5">Verification Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-400 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                        <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{doc.title || doc.file_name}</p>
                        <p className="text-xs text-slate-400 truncate">{doc.file_name} • {(doc.file_size_kb ? `${doc.file_size_kb} KB` : "PDF/DOC")}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-600">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {doc.category || "General"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    {getStatusBadge(doc.status)}
                    {doc.feedback && (
                      <p className="text-[11px] text-rose-600 mt-1 max-w-[200px] truncate" title={doc.feedback}>
                        Note: {doc.feedback}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap text-xs font-semibold">
                    <div className="flex items-center justify-end gap-2">
                      {doc.file_url && (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition inline-flex items-center gap-1"
                        >
                          <svg width="14" height="14" style={{ width: 14, height: 14 }} className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </a>
                      )}
                      {doc.feedback && onViewFeedback && (
                        <button
                          type="button"
                          onClick={() => onViewFeedback(doc)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition"
                        >
                          Feedback
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!readOnly && onUploadClick && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">Supported formats: PDF, DOCX, PNG, JPG (up to 25 MB per file).</p>
          <button
            type="button"
            onClick={onUploadClick}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition inline-flex items-center gap-1.5"
          >
            <svg width="16" height="16" style={{ width: 16, height: 16 }} className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </button>
        </div>
      )}
    </div>
  );
}
