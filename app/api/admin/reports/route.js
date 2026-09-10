import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["admin", "super_admin"]);
    const stats = await db.getAdminPortalStats();
    return NextResponse.json({ success: true, stats });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
