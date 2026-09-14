import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await db.getSystemSettings();
    return NextResponse.json({
      is_emergency_offline: Boolean(settings.is_emergency_offline),
      maintenance_message: settings.maintenance_message || "This website is temporarily unavailable while maintenance is being performed.",
      owner_name: settings.owner_name,
    });
  } catch (err) {
    return NextResponse.json({ is_emergency_offline: false }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionUser();
    const data = await request.json();
    const { is_emergency_offline, maintenance_message, admin_key, reason } = data;

    // Verify admin access via session or secret key
    const isAuthorized =
      user?.role === "admin" ||
      user?.role === "super_admin" ||
      (Array.isArray(user?.roles) && (user.roles.includes("admin") || user.roles.includes("super_admin"))) ||
      admin_key === (process.env.ADMIN_SECRET_KEY || "admin-super-key-mydam-2026");

    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized access to Emergency Protocol" }, { status: 403 });
    }

    const nextState = Boolean(is_emergency_offline);
    const updated = await db.setEmergencyShutdown(nextState, maintenance_message);

    // Mandated Cybersecurity Protocol: Log immediate immutable audit trail
    await db.logAudit(
      nextState ? "EMERGENCY_SHUTDOWN_ACTIVATED" : "EMERGENCY_SHUTDOWN_DEACTIVATED",
      user?.id || "super_admin",
      user?.email || "owner@jva-medical.com",
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      {
        reason: reason || (nextState ? "Emergency protocol engaged by owner" : "System restored after investigation"),
        timestamp: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      success: true,
      is_emergency_offline: updated.is_emergency_offline,
      maintenance_message: updated.maintenance_message,
    });
  } catch (err) {
    console.error("Emergency route error:", err);
    return NextResponse.json({ error: "Failed to execute emergency shutdown command" }, { status: 500 });
  }
}
