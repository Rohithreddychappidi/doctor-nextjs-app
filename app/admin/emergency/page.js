"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import ExportButton from "@/components/ExportButton";

export default function EmergencyProtocolPage() {
  const [offline, setOffline] = useState(false);
  const [message, setMessage] = useState("This website is temporarily unavailable while maintenance is being performed.");
  const [adminKey, setAdminKey] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [logs, setLogs] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  const loadStatus = async () => {
    try {
      const res = await fetch("/api/emergency");
      if (res.ok) {
        const d = await res.json();
        setOffline(Boolean(d.is_emergency_offline));
        if (d.maintenance_message) setMessage(d.maintenance_message);
      }

      // Load audit logs
      const auditRes = await fetch("/api/export?type=audit");
      // Or fetch from database
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleToggleShutdown = async (targetState) => {
    const actionLabel = targetState ? "ENGAGE EMERGENCY SHUTDOWN" : "RESTORE PUBLIC WEBSITE";
    const confirmPrompt = targetState
      ? "EMERGENCY PROTOCOL: This will immediately take the public website offline and display the emergency maintenance screen. Continue?"
      : "Confirm that security investigation has completed and the vulnerability is resolved before restoring public access. Proceed?";

    if (!confirm(confirmPrompt)) return;

    setToggling(true);
    setStatusMsg("");
    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_emergency_offline: targetState,
          maintenance_message: message,
          admin_key: adminKey || undefined,
          reason: reason || (targetState ? "Manual emergency shutdown triggered by owner" : "System restored after security review"),
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to update emergency state");

      setOffline(d.is_emergency_offline);
      setStatusMsg(
        d.is_emergency_offline
          ? "CRITICAL: Public website has been taken offline. Maintenance notice is now active for all public visitors."
          : "System restored. Public website is now active and operational."
      );
    } catch (e) {
      alert("Emergency toggle failed: " + e.message);
    } finally {
      setToggling(false);
    }
  };

  return (
    <AdminShell>
      <div className="dash-head">
        <div>
          <div className="eyebrow">Cybersecurity Protocol</div>
          <h1>Website Cybersecurity &amp; Emergency Shutdown Console</h1>
          <p className="sub">
            Dr. Janardhan Mydam / JVA Medical Services Emergency Protocol — Instant public shutdown killswitch with immutable audit preservation.
          </p>
        </div>
        <div>
          <ExportButton type="audit" label="Export Forensic Audit Logs (CSV)" />
        </div>
      </div>

      {statusMsg && (
        <div
          className="form-note"
          style={{
            backgroundColor: offline ? "#FFEBEE" : "#E8F5E9",
            color: offline ? "#8A2A34" : "#2E7D3A",
            border: `1px solid ${offline ? "#8A2A34" : "#2E7D3A"}`,
            padding: 16,
            marginBottom: 24,
            fontWeight: 600,
          }}
        >
          {statusMsg}
        </div>
      )}

      {/* Emergency Status Banner */}
      <div
        className="dash-card"
        style={{
          backgroundColor: offline ? "#8A2A34" : "#12203B",
          color: "#FFFFFF",
          marginBottom: 30,
          padding: 28,
          border: "2px solid rgba(255,255,255,0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#E9C989" }}>
              CURRENT PUBLIC SYSTEM STATUS
            </div>
            <h2 style={{ color: "#FFFFFF", fontSize: "1.8rem", margin: "6px 0 4px" }}>
              {offline ? "OFFLINE — EMERGENCY MAINTENANCE MODE ACTIVE" : "ONLINE — NORMAL PUBLIC OPERATIONS"}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
              {offline
                ? "Public visitors receive only: 'This website is temporarily unavailable while maintenance is being performed.' All database records and logs are safely preserved."
                : "All public pages, classes, and question banks are accessible to registered students and visitors."}
            </p>
          </div>

          <div>
            {offline ? (
              <button
                onClick={() => handleToggleShutdown(false)}
                className="btn btn-gold"
                disabled={toggling}
                style={{ padding: "12px 24px", fontWeight: "bold" }}
              >
                {toggling ? "Restoring..." : "Restore Public Access"}
              </button>
            ) : (
              <button
                onClick={() => handleToggleShutdown(true)}
                className="btn btn-primary"
                disabled={toggling}
                style={{
                  backgroundColor: "#D32F2F",
                  borderColor: "#D32F2F",
                  padding: "12px 24px",
                  fontWeight: "bold",
                }}
              >
                {toggling ? "Shutting down..." : "ENGAGE EMERGENCY SHUTDOWN"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Control Settings */}
      <div className="dash-card" style={{ marginBottom: 30 }}>
        <h3 style={{ marginBottom: 16 }}>Emergency Settings &amp; Override Key</h3>
        <div className="form-row single">
          <div className="field">
            <label>Public Maintenance Notice (Mandated Standard)</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="This website is temporarily unavailable while maintenance is being performed."
            />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>Incident Log Reason / Notes</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Precautionary review / server maintenance / credential rotation"
            />
          </div>
          <div className="field">
            <label>Independent Owner Override Key (Optional if logged in)</label>
            <input
              type="password"
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Owner master key"
            />
          </div>
        </div>
      </div>

      {/* Owner Protocol Checklist */}
      <div className="dash-card">
        <h3 style={{ marginBottom: 14 }}>Dr. Janardhan Mydam Cybersecurity Protocol Checklist</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
          <div style={{ padding: 10, backgroundColor: "#F7F4EE", borderRadius: 6 }}>
            <strong>1. Owner Control &amp; Access:</strong> The website owner maintains independent access to shutdown without depending on developers.
          </div>
          <div style={{ padding: 10, backgroundColor: "#F7F4EE", borderRadius: 6 }}>
            <strong>2. Emergency Shutdown (Highest Priority):</strong> Target shutdown time is under 1 minute from incident detection.
          </div>
          <div style={{ padding: 10, backgroundColor: "#F7F4EE", borderRadius: 6 }}>
            <strong>3. Preserve Evidence:</strong> Do not delete databases or server logs; capture screenshots, download forensic audit logs, and export user records.
          </div>
          <div style={{ padding: 10, backgroundColor: "#F7F4EE", borderRadius: 6 }}>
            <strong>4. Secure Accounts:</strong> Rotate database credentials, Resend API keys, and administrator secrets.
          </div>
          <div style={{ padding: 10, backgroundColor: "#F7F4EE", borderRadius: 6 }}>
            <strong>5. Pre-Launch Verification:</strong> Developer confirms the owner can independently toggle emergency maintenance from this screen or master key.
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
