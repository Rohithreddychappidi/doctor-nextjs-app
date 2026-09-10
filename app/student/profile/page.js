"use client";

import { useEffect, useState } from "react";

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [medicalSchool, setMedicalSchool] = useState("");
  const [country, setCountry] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [usmleStage, setUsmleStage] = useState("");
  const [specialtyInterest, setSpecialtyInterest] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/student/profile");
        if (res.ok) {
          const json = await res.json();
          const p = json.profile;
          setProfile(p);
          setFirstName(p.first_name || "");
          setLastName(p.last_name || "");
          setMedicalSchool(p.medical_school || "");
          setCountry(p.country || "");
          setGraduationYear(p.graduation_year || "");
          setUsmleStage(p.usmle_stage || "");
          setSpecialtyInterest(p.specialty_interest || "");
          setPhone(p.phone || "");
          setBio(p.bio || "");
        }
      } catch (e) {
        console.error("Profile load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          medical_school: medicalSchool,
          country,
          graduation_year: Number(graduationYear) || 2026,
          usmle_stage: usmleStage,
          specialty_interest: specialtyInterest,
          phone,
          bio,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading academic profile...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#12203B", margin: "0 0 4px" }}>
          Academic Profile &amp; Residency Credentials
        </h2>
        <p style={{ fontSize: "13px", color: "#767C87", margin: 0 }}>
          Manage your medical school affiliation, USMLE exam stage, and contact details used across rotations and mentorship.
        </p>
      </div>

      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", border: "1px solid #E6E2D8", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        {success && <div style={{ padding: "10px 14px", backgroundColor: "#E8F5E9", color: "#2E7D3A", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>{success}</div>}
        {error && <div style={{ padding: "10px 14px", backgroundColor: "#FFEBEE", color: "#C62828", borderRadius: "6px", fontSize: "13px", marginBottom: "16px" }}>{error}</div>}

        <form onSubmit={handleSave}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }} />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>Medical School / Institution</label>
            <input type="text" value={medicalSchool} onChange={(e) => setMedicalSchool(e.target.value)} required style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>Graduation Year</label>
              <input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>USMLE Exam Stage</label>
              <select value={usmleStage} onChange={(e) => setUsmleStage(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px", backgroundColor: "#FFFFFF" }}>
                <option value="Pre-USMLE">Pre-USMLE / Basic Sciences</option>
                <option value="Step 1">USMLE Step 1</option>
                <option value="Step 2 CK">USMLE Step 2 CK</option>
                <option value="Step 3 / Match">USMLE Step 3 / ERAS Match</option>
                <option value="Pediatric Resident">Pediatric Resident / Fellow</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>Specialty Interest</label>
              <input type="text" value={specialtyInterest} onChange={(e) => setSpecialtyInterest(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }} />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>Contact Phone (WhatsApp)</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px" }} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#12203B", marginBottom: "6px" }}>Academic Bio / Background</label>
            <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: "1px solid #CBD2E1", borderRadius: "6px", fontSize: "13px", fontFamily: "inherit" }} />
          </div>

          <button type="submit" disabled={saving} style={{ backgroundColor: "#8A2A34", color: "#FFFFFF", border: "none", padding: "10px 24px", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
