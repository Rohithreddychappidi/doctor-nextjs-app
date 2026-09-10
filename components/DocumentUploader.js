"use client";

import { useState } from "react";

/**
 * DocumentUploader
 * Modal uploader component for student documents, rotation compliance, or research files.
 */
export default function DocumentUploader({
  isOpen,
  onClose,
  onSuccess,
  defaultCategory = "General",
  categories = [
    "Medical School Transcript",
    "USMLE Score Report",
    "Dean's Letter (MSPE)",
    "Immunization Record",
    "HIPAA Compliance Certificate",
    "CV / Resume",
    "IRB Training / Ethics",
    "Manuscript Draft",
    "Other"
  ]
}) {
  const [category, setCategory] = useState(defaultCategory);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file && !title) {
      setError("Please provide a title and select a file.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      // Create FormData to submit to /api/student/documents/upload
      const formData = new FormData();
      formData.append("title", title || file?.name || "Uploaded Document");
      formData.append("category", category);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/student/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (onSuccess) onSuccess(data.document);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Compliance / Academic File
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <svg width="20" height="20" style={{ width: 20, height: 20 }} className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Document Label / Title</label>
            <input
              type="text"
              placeholder="e.g. Official USMLE Step 1 Score Report (PDF)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select File</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center hover:border-teal-500 transition cursor-pointer bg-slate-50/50">
              <input
                type="file"
                id="doc-file-upload"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
              />
              <label htmlFor="doc-file-upload" className="cursor-pointer block">
                <svg width="32" height="32" style={{ width: 32, height: 32 }} className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {file ? (
                  <p className="text-sm font-semibold text-teal-700 truncate">{file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-700">Click to browse or drop file here</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">PDF, DOCX, PNG, JPG up to 25 MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
            <span className="font-bold">Security Note:</span> Documents are stored in encrypted private cloud storage (Backblaze B2) and accessible only to you, Dr. Janardhan Mydam, and authorized clinical reviewers.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 shadow-sm transition disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {isUploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
