"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import MandatoryStar from "@/components/MandatoryStar";

const AVAILABLE_SECTIONS = [
  { id: "rotations", label: "Tele-Rotation Pipeline & Meetings", icon: "🩺", desc: "View and review applications, schedule Zoom/Teams rounds" },
  { id: "tests", label: "Question Bank CMS & Bulk Import", icon: "📝", desc: "Manage 28 modules, upload bulk CSVs, edit questions" },
  { id: "classes", label: "Live Classes & Seminars", icon: "🎥", desc: "Schedule seminars, update meeting links, manage recordings" },
  { id: "submissions", label: "Student Submissions & Grading", icon: "📥", desc: "Review student clinical assignments and issue faculty feedback" },
  { id: "students", label: "Students Directory & Profiles", icon: "👥", desc: "Browse enrolled students, review academic profiles" },
  { id: "enrollments", label: "Enrollments Manager", icon: "📋", desc: "Manage active program seats, status, and dates" },
  { id: "documents", label: "Document Review Queue", icon: "📁", desc: "Verify HIPAA certifications, titers, and dean's letters" },
  { id: "programs", label: "Programs & Live Pricing", icon: "🧭", desc: "Update program duration, pricing types, and descriptions" },
  { id: "disclaimers", label: "Section Disclaimers & Regulatory Terms", icon: "⚖️", desc: "Edit HIPAA and educational compliance documentation" },
  { id: "content", label: "Site Content CMS", icon: "🌐", desc: "Edit hero banner, headings, and homepage cards" },
  { id: "about", label: "About Dr. Mydam CMS", icon: "👨‍⚕️", desc: "Update credentials, publications, and hospital appointments" },
  { id: "marketing", label: "Marketing & Broadcast Promotions", icon: "📢", desc: "Manage promo banners and broadcast announcements" },
  { id: "reports", label: "Platform Analytics & Reports", icon: "📈", desc: "Export enrollment and student progress analytics" },
];

export default function SubadminsPage() {
  const [subadmins, setSubadmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([
    "rotations",
    "classes",
    "submissions",
  ]);

  const loadSubadmins = async () => {
    try {
      const res = await fetch("/api/admin/subadmins");
      if (res.ok) {
        const d = await res.json();
        setSubadmins(d.subadmins || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubadmins();
  }, []);

  const openNewModal = () => {
    setEditingSub(null);
    setFormName("");
    setFormEmail("");
    setFormTitle("Clinical Preceptor");
    setSelectedPermissions(["rotations", "classes", "submissions"]);
    setError("");
    setMsg("");
    setModalOpen(true);
  };

  const openEditModal = (sub) => {
    setEditingSub(sub);
    setFormName(sub.name || "");
    setFormEmail(sub.email || "");
    setFormTitle(sub.title || "");
    setSelectedPermissions(sub.permissions || []);
    setError("");
    setMsg("");
    setModalOpen(true);
  };

  const togglePermission = (secId) => {
    setSelectedPermissions((prev) =>
      prev.includes(secId) ? prev.filter((p) => p !== secId) : [...prev, secId]
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMsg("");

    try {
      if (!formName.trim() || !formEmail.trim()) {
        throw new Error("Full name and email address are required (*)");
      }

      if (editingSub) {
        const res = await fetch(`/api/admin/subadmins/${editingSub.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            title: formTitle,
            permissions: selectedPermissions,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update sub-admin");
        setMsg("Sub-admin permissions updated successfully!");
      } else {
        const res = await fetch("/api/admin/subadmins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            title: formTitle,
            permissions: selectedPermissions,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create sub-admin");
        setMsg("New sub-administrator registered with 2FA protection!");
      }

      setModalOpen(false);
      loadSubadmins();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to revoke access for ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/subadmins/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMsg("Sub-admin privileges revoked.");
        loadSubadmins();
      }
    } catch (e) {
      alert("Error deleting sub-admin");
    }
  };

  return (
    <AdminShell>
      <div style={{ maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 700, color: "#B4832A", letterSpacing: 1, marginBottom: 4 }}>
              DOCTOR &amp; SUPER ADMIN GOVERNANCE
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
              Sub-Administrators &amp; Section Permissions
            </h1>
            <p style={{ fontSize: 13, color: "#767C87", margin: 0 }}>
              Delegate specific admin panels to attending preceptors, course coordinators, and staff. Every login is fortified by 2-Factor Authentication (2FA).
            </p>
          </div>

          <button
            onClick={openNewModal}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <span>+</span> Register New Sub-Admin
          </button>
        </div>

        {/* 2FA & Security Architecture Banner */}
        <div style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 18 }}>🛡️</span>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
              Mandatory Two-Factor Authentication (2FA) &amp; Least-Privilege Access
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: "#475569", lineHeight: 1.6 }}>
            Sub-admins only see and modify the specific tabs checked below. When logging in, the portal prompts for a 6-digit verification code from their mobile <strong>Google Authenticator</strong> or <strong>Microsoft Authenticator</strong> app. <em>Emergency Shutdown</em> and <em>Sub-Admin Management</em> are permanently restricted to Dr. Janardhan Mydam.
          </p>
        </div>

        {/* Feedback Messages */}
        {msg && (
          <div style={{ padding: "12px 16px", backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            ✓ {msg}
          </div>
        )}

        {/* Demo Fast-Switch Tip */}
        <div style={{ backgroundColor: "#FEFCE8", border: "1px solid #FEF08A", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 12.5, color: "#854D0E" }}>
          <strong>💡 Fast Local Demo Accounts:</strong>
          <ul style={{ margin: "6px 0 0", paddingLeft: 20 }}>
            <li><strong>Clinical Preceptor:</strong> <code>preceptor@jvmmedicalservices.com</code> (Pass: <code>Pass@2026</code> · Access: Rotations, Classes, Submissions, Students)</li>
            <li><strong>QBank &amp; Content Editor:</strong> <code>content.editor@jvmmedicalservices.com</code> (Pass: <code>Pass@2026</code> · Access: Tests CMS, Content, About, Disclaimers)</li>
          </ul>
        </div>

        {/* Sub-Admins Cards / Table */}
        {loading ? (
          <p style={{ color: "#64748B", fontSize: 13 }}>Loading sub-administrators list...</p>
        ) : subadmins.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10 }}>
            <p style={{ color: "#64748B", margin: 0 }}>No sub-administrators currently registered.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {subadmins.map((sub) => (
              <div
                key={sub.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10,
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                        {sub.name}
                      </h3>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 12, backgroundColor: "#E0F2FE", color: "#0369A1" }}>
                        {sub.title || "Sub-Admin"}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 12, backgroundColor: "#DCFCE7", color: "#15803D" }}>
                        2FA Active
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
                      {sub.email} · Created {new Date(sub.created_at || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => openEditModal(sub)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 12, padding: "4px 10px" }}
                    >
                      Edit Permissions
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id, sub.name)}
                      className="btn btn-sm"
                      style={{ fontSize: 12, padding: "4px 10px", color: "#DC2626", borderColor: "#FCA5A5" }}
                    >
                      Revoke
                    </button>
                  </div>
                </div>

                {/* Enabled Sections Badges */}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748B", letterSpacing: 0.5, marginBottom: 8 }}>
                    Doctor-Assigned Operational Sections ({sub.permissions?.length || 0}):
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {sub.permissions && sub.permissions.length > 0 ? (
                      sub.permissions.map((pId) => {
                        const sec = AVAILABLE_SECTIONS.find((s) => s.id === pId);
                        return (
                          <span
                            key={pId}
                            style={{
                              fontSize: 11.5,
                              padding: "4px 10px",
                              backgroundColor: "#F8FAFC",
                              border: "1px solid #CBD5E1",
                              borderRadius: 6,
                              color: "#334155",
                              fontWeight: 600,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <span>{sec?.icon || "📌"}</span> {sec?.label || pId}
                          </span>
                        );
                      })
                    ) : (
                      <span style={{ fontSize: 12, color: "#94A3B8" }}>No sections currently enabled.</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Create / Edit */}
        {modalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: 20,
            }}
          >
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 12,
                maxWidth: 700,
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "28px",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0F172A" }}>
                  {editingSub ? `Configure Permissions: ${editingSub.name}` : "Register New Sub-Administrator"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748B" }}
                >
                  ✕
                </button>
              </div>

              {error && (
                <div style={{ padding: "10px 14px", backgroundColor: "#FEF2F2", border: "1px solid #F87171", color: "#991B1B", borderRadius: 6, fontSize: 12.5, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSave}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                      Full Name <MandatoryStar />
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Dr. Marcus Vance"
                      required
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: 13 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                      Title / Functional Role
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Clinical Preceptor"
                      style={{ width: "100%", padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: 13 }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                    Official Email Address <MandatoryStar />
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="preceptor@jvmmedicalservices.com"
                    disabled={!!editingSub}
                    required
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 6, fontSize: 13, backgroundColor: editingSub ? "#F1F5F9" : "#FFFFFF" }}
                  />
                  {editingSub && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#64748B" }}>Email cannot be changed after registration.</p>}
                </div>

                {/* Permissions Grid */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>
                      Select Enabled Sections for this Sub-Admin:
                    </label>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => setSelectedPermissions(AVAILABLE_SECTIONS.map((s) => s.id))}
                        style={{ background: "none", border: "none", fontSize: 11.5, color: "#0284C7", cursor: "pointer", fontWeight: 600 }}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPermissions([])}
                        style={{ background: "none", border: "none", fontSize: 11.5, color: "#64748B", cursor: "pointer", fontWeight: 600 }}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxHeight: 300, overflowY: "auto", padding: "10px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8 }}>
                    {AVAILABLE_SECTIONS.map((sec) => {
                      const checked = selectedPermissions.includes(sec.id);
                      return (
                        <label
                          key={sec.id}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "8px 10px",
                            borderRadius: 6,
                            backgroundColor: checked ? "#EFF6FF" : "#FFFFFF",
                            border: checked ? "1px solid #93C5FD" : "1px solid #E2E8F0",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(sec.id)}
                            style={{ marginTop: 3 }}
                          />
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>
                              {sec.icon} {sec.label}
                            </div>
                            <div style={{ fontSize: 11, color: "#64748B", lineHeight: 1.3 }}>
                              {sec.desc}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 14, borderTop: "1px solid #E2E8F0" }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary btn-sm"
                    style={{ fontWeight: 600 }}
                  >
                    {saving ? "Saving Changes..." : editingSub ? "Update Permissions" : "Register Sub-Admin with 2FA"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
