"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminDocumentsQueuePage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [processing, setProcessing] = useState({});

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    try {
      const res = await fetch("/api/admin/documents");
      if (res.ok) {
        const json = await res.json();
        setDocuments(json.documents || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async (docId, status) => {
    setProcessing((prev) => ({ ...prev, [docId]: true }));
    try {
      const feedback = feedbackMap[docId] || (status === "Approved" ? "Verified and approved by staff." : "Please re-upload.");
      const res = await fetch("/api/admin/documents", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: docId, status, feedback }),
      });
      if (res.ok) {
        loadDocs();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing((prev) => ({ ...prev, [docId]: false }));
    }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: "1100px" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
            Student Document Review Queue
          </h1>
          <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
            Inspect uploaded credentials (CV, Dean's Letter, USMLE Score Report, Immunizations) and approve or request revisions.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {documents.map((doc) => (
            <div key={doc.id} style={{ backgroundColor: "#FFFFFF", padding: "20px", borderRadius: "8px", border: "1px solid #E6E2D8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "11px", backgroundColor: "#F7F4EE", color: "#12203B", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                    {doc.category}
                  </span>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#12203B", margin: "4px 0 2px" }}>
                    {doc.title}
                  </h3>
                  <div style={{ fontSize: "12px", color: "#4B505C" }}>
                    Student: <strong>{doc.student_name}</strong> ({doc.student_email}) · Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: doc.status === "Approved" ? "#2E7D3A" : doc.status === "Revision Required" ? "#C62828" : "#B4832A" }}>
                    {doc.status}
                  </span>
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#12203B", color: "#FFFFFF", padding: "6px 14px", borderRadius: "4px", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
                    Open Document ↗
                  </a>
                </div>
              </div>

              {/* Feedback and review buttons */}
              <div style={{ marginTop: "14px", borderTop: "1px solid #F0ECE1", paddingTop: "12px", display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  placeholder="Reviewer feedback note to student..."
                  value={feedbackMap[doc.id] !== undefined ? feedbackMap[doc.id] : (doc.reviewer_feedback || "")}
                  onChange={(e) => setFeedbackMap({ ...feedbackMap, [doc.id]: e.target.value })}
                  style={{ flex: 1, minWidth: "260px", padding: "8px 12px", border: "1px solid #CBD2E1", borderRadius: "4px", fontSize: "12px" }}
                />

                <button
                  onClick={() => handleUpdate(doc.id, "Approved")}
                  disabled={processing[doc.id]}
                  style={{ backgroundColor: "#2E7D3A", color: "#FFFFFF", border: "none", padding: "8px 16px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                >
                  ✓ Approve
                </button>

                <button
                  onClick={() => handleUpdate(doc.id, "Revision Required")}
                  disabled={processing[doc.id]}
                  style={{ backgroundColor: "#C62828", color: "#FFFFFF", border: "none", padding: "8px 16px", borderRadius: "4px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                >
                  ⚠️ Request Revision
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
