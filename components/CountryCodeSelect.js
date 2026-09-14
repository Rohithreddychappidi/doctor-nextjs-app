"use client";

import { useState, useRef, useEffect } from "react";

export const COUNTRIES = [
  { code: "US", name: "United States", dial: "+1", flag: "🇺🇸" },
  { code: "IN", name: "India", dial: "+91", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", dial: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dial: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dial: "+61", flag: "🇦🇺" },
  { code: "AE", name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" },
  { code: "PK", name: "Pakistan", dial: "+92", flag: "🇵🇰" },
  { code: "NG", name: "Nigeria", dial: "+234", flag: "🇳🇬" },
  { code: "PH", name: "Philippines", dial: "+63", flag: "🇵🇭" },
  { code: "EG", name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { code: "DE", name: "Germany", dial: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dial: "+33", flag: "🇫🇷" },
  { code: "BR", name: "Brazil", dial: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", dial: "+52", flag: "🇲🇽" },
  { code: "SG", name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", dial: "+60", flag: "🇲🇾" },
  { code: "ZA", name: "South Africa", dial: "+27", flag: "🇿🇦" },
  { code: "KE", name: "Kenya", dial: "+254", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", dial: "+233", flag: "🇬🇭" },
  { code: "IE", name: "Ireland", dial: "+353", flag: "🇮🇪" },
  { code: "NZ", name: "New Zealand", dial: "+64", flag: "🇳🇿" },
  { code: "JP", name: "Japan", dial: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dial: "+82", flag: "🇰🇷" },
  { code: "CN", name: "China", dial: "+86", flag: "🇨🇳" },
  { code: "BD", name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { code: "NP", name: "Nepal", dial: "+977", flag: "🇳🇵" },
  { code: "LK", name: "Sri Lanka", dial: "+94", flag: "🇱🇰" },
  { code: "QA", name: "Qatar", dial: "+974", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", dial: "+965", flag: "🇰🇼" },
  { code: "OM", name: "Oman", dial: "+968", flag: "🇴🇲" },
  { code: "BH", name: "Bahrain", dial: "+973", flag: "🇧🇭" },
  { code: "JO", name: "Jordan", dial: "+962", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", dial: "+961", flag: "🇱🇧" },
  { code: "TR", name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { code: "IT", name: "Italy", dial: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dial: "+34", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", dial: "+31", flag: "🇳🇱" },
  { code: "CH", name: "Switzerland", dial: "+41", flag: "🇨🇭" },
  { code: "SE", name: "Sweden", dial: "+46", flag: "🇸🇪" },
  { code: "PL", name: "Poland", dial: "+48", flag: "🇵🇱" },
  { code: "RO", name: "Romania", dial: "+40", flag: "🇷🇴" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "JM", name: "Jamaica", dial: "+1876", flag: "🇯🇲" },
  { code: "TT", name: "Trinidad & Tobago", dial: "+1868", flag: "🇹🇹" },
  { code: "BB", name: "Barbados", dial: "+1246", flag: "🇧🇧" },
  { code: "GD", name: "Grenada", dial: "+1473", flag: "🇬🇩" },
  { code: "DM", name: "Dominica", dial: "+1767", flag: "🇩🇲" },
  { code: "KN", name: "St. Kitts & Nevis", dial: "+1869", flag: "🇰🇳" },
  { code: "AG", name: "Antigua & Barbuda", dial: "+1268", flag: "🇦🇬" }
];

export default function CountryCodeSelect({ value = "+1", onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedCountry = COUNTRIES.find((c) => c.dial === value) || COUNTRIES[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = search.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.replace("+", "").includes(q.replace("+", "")) ||
      c.code.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          height: "44px",
          padding: "0 12px",
          border: "1px solid #CBD2E1",
          borderRadius: "6px 0 0 6px",
          backgroundColor: "#F8FAFC",
          fontSize: "14px",
          fontWeight: 600,
          color: "#1E293B",
          cursor: "pointer",
          whiteSpace: "nowrap",
          borderRight: "none",
        }}
        title="Select Country Dial Code"
      >
        <span style={{ fontSize: "16px" }}>{selectedCountry.flag}</span>
        <span>{selectedCountry.dial}</span>
        <span style={{ fontSize: "10px", color: "#64748B" }}>▼</span>
      </button>

      {/* Searchable Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 9999,
            width: "290px",
            maxHeight: "320px",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #CBD5E1",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Search Box */}
          <div style={{ padding: "8px", borderBottom: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                fontSize: "13px",
                border: "1px solid #CBD5E1",
                borderRadius: "6px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* List of Countries */}
          <div style={{ overflowY: "auto", flex: 1, maxHeight: "260px" }}>
            {filteredCountries.length === 0 ? (
              <div style={{ padding: "16px", textAlign: "center", fontSize: "13px", color: "#94A3B8" }}>
                No countries found
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isCurrent = c.dial === value;
                return (
                  <div
                    key={`${c.code}-${c.dial}`}
                    onClick={() => {
                      onChange(c.dial);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      cursor: "pointer",
                      fontSize: "13px",
                      backgroundColor: isCurrent ? "#F1F5F9" : "transparent",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8FAFC")}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = isCurrent ? "#F1F5F9" : "transparent")
                    }
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                      <span style={{ fontSize: "16px" }}>{c.flag}</span>
                      <span style={{ color: "#334155", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                        {c.name}
                      </span>
                    </div>
                    <span style={{ fontWeight: 600, color: "#0F172A", marginLeft: "8px" }}>{c.dial}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
