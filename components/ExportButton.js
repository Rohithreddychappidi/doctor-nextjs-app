"use client";

import { useState } from "react";

export default function ExportButton({ type = "students", label = "Export to CSV", className = "btn btn-outline btn-sm" }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/export?type=${type}`);
      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `export_${type}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to export data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleExport} disabled={loading} className={className} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span>&#128190;</span>
      <span>{loading ? "Exporting..." : label}</span>
    </button>
  );
}
