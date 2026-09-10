"use client";

import { useEffect, useState } from "react";

export default function StudentDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Curriculum Vitae");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const res = await fetch("/api/student/documents");
      if (res.ok) {
        const json = await res.json();
        setDocuments(json.documents || []);
      }
    } catch (e) {
      console.error("Docs error:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      // 1. Upload to storage
      const formData = new FormData();
      formData.append("file", file);
      const storageRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const storageData = await storageRes.json();
      if (!storageRes.ok) throw new Error(storageData.error || "File upload failed");

      // 2. Save document record
      const docRes = await fetch("/api/student/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title: file.name,
          file_url: storageData.file.url,
        }),
      });
      const docData = await docRes.json();
      if (!docRes.ok) throw new Error(docData.error || "Failed to save document record");

      setUploadSuccess("Document uploaded successfully! It is now pending staff review.");
      setFile(null);
      loadDocuments();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Approved") {
      return <span style={{ backgroundColor: "#E8F5E9", color: "#2E7D3A", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px" }}>✓ Approved</span>;
    }
    if (status === "Revision Required") {
      return <span style={{ backgroundColor: "#FFEBEE", color: "#C62828", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px" }}>⚠️ Revision Required</span>;
    }
    return <span style={{ backgroundColor: "#FFF8E1", color: "#B4832A", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px" }}>⏳ Under Review</span>;
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading document vault...</div>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
          Private Document Vault
        </h2>
        <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
          Upload required academic credentials, medical school transcripts, immunizations, and clinical rotation compliance records.
        </p>
      </div>

      {/* Upload Box */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E6E2D8", padding: "24px", marginBottom: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#12203B", margin: "0 0 16px" }}>
          Upload New Document
        </h3>

        {uploadSuccess && (
          <div style={{ padding: "12px", backgroundColor: "#E8F5E9", color: "#2E7D3A", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>
            {uploadSuccess}
          </div>
        )}
        {uploadError && (
          <div style={{ padding: "12px", backgroundColor: "#FFEBEE", color: "#C62828", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>
            {uploadError}
          </div>
        )}

        <form onSubmit={handleUpload} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "16px", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>
              Document Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px", backgroundColor: "#FFFFFF" }}
            >
              <option value="Curriculum Vitae">Curriculum Vitae (CV)</option>
              <option value="USMLE Score Report">USMLE Score Report</option>
              <option value="Dean's Letter (MSPE)">Dean's Letter (MSPE)</option>
              <option value="Medical School Transcript">Medical School Transcript</option>
              <option value="Immunization Record">Immunization Record (2-Step TB, MMR, HepB)</option>
              <option value="HIPAA Certification">HIPAA / OSHA Compliance Certification</option>
              <option value="Personal Statement Draft">Personal Statement Draft</option>
              <option value="Other Credential">Other Credential</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>
              Select File (PDF, DOCX, JPG, PNG)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
              style={{ width: "100%", fontSize: "13px" }}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            style={{
              backgroundColor: "#8A2A34",
              color: "#FFFFFF",
              border: "none",
              padding: "10px 24px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 700,
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>

      {/* Documents List */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E6E2D8", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#12203B", margin: "0 0 16px" }}>
          Uploaded Credentials &amp; Verification Status
        </h3>

        {documents.length === 0 ? (
          <p style={{ color: "#767C87", fontSize: "13px" }}>No documents uploaded yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {documents.map((doc) => (
              <div key={doc.id} style={{ padding: "16px", backgroundColor: "#F9F8F5", borderRadius: "8px", border: "1px solid #E6E2D8" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "8px" }}>
                  <div>
                    <span style={{ fontSize: "11px", backgroundColor: "rgba(18,32,59,0.08)", color: "#12203B", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                      {doc.category}
                    </span>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#12203B", margin: "4px 0 2px" }}>
                      {doc.title}
                    </h4>
                    <div style={{ fontSize: "11px", color: "#767C87" }}>
                      Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {getStatusBadge(doc.status)}
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "12px", color: "#8A2A34", fontWeight: 600, textDecoration: "none" }}
                    >
                      View / Download ↗
                    </a>
                  </div>
                </div>

                {doc.reviewer_feedback && (
                  <div style={{ backgroundColor: "#FFFFFF", padding: "10px 14px", borderRadius: "4px", border: "1px solid #E6E2D8", fontSize: "12px", color: "#4B505C", marginTop: "10px" }}>
                    <strong>Reviewer Feedback:</strong> {doc.reviewer_feedback}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
