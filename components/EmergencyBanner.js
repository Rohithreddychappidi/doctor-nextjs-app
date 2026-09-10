"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function EmergencyBanner() {
  const [offline, setOffline] = useState(false);
  const [message, setMessage] = useState("This website is temporarily unavailable while maintenance is being performed.");
  const pathname = usePathname();

  useEffect(() => {
    async function checkEmergency() {
      try {
        const res = await fetch("/api/emergency");
        if (res.ok) {
          const data = await res.json();
          if (data.is_emergency_offline) {
            setOffline(true);
            if (data.maintenance_message) setMessage(data.maintenance_message);
          } else {
            setOffline(false);
          }
        }
      } catch (e) {
        // network failure or offline
      }
    }
    checkEmergency();
    const interval = setInterval(checkEmergency, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Allow administrators to access /admin routes during emergency maintenance
  if (offline && !pathname.startsWith("/admin")) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#12203B",
          color: "#FFFFFF",
          zIndex: 999999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          fontFamily: "'Public Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(180, 131, 42, 0.2)",
              color: "#E9C989",
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            System Maintenance
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              marginBottom: 18,
              color: "#FFFFFF",
              lineHeight: 1.25,
            }}
          >
            {message}
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 16, marginBottom: 32 }}>
            Our engineering team is conducting scheduled system updates and security verification. Public access will resume shortly.
          </p>
          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.15)", paddingTop: 20 }}>
            <Link
              href="/admin/emergency"
              style={{
                color: "#E9C989",
                fontSize: 13,
                textDecoration: "underline",
                letterSpacing: 0.5,
              }}
            >
              Owner / Administrator Access &rarr;
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
