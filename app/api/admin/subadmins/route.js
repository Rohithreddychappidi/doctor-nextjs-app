import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    await requireRole(["super_admin", "admin"]);
    const subadmins = await db.getSubadmins();
    return NextResponse.json({ success: true, subadmins });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function POST(request) {
  try {
    const user = await requireRole(["super_admin", "admin"]);
    const data = await request.json();
    const { name, email, title, permissions } = data;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Sub-administrator name and email are mandatory (*)" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists" },
        { status: 400 }
      );
    }

    const newSub = await db.createSubadmin({
      name: name.trim(),
      email: cleanEmail,
      title: title?.trim() || "Clinical Sub-Administrator",
      permissions: Array.isArray(permissions) ? permissions : [],
    });

    await db.logAudit(
      "SUBADMIN_CREATED",
      user.id,
      user.email,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { createdSubadminId: newSub.id, subadminEmail: newSub.email, permissions: newSub.permissions }
    );

    return NextResponse.json({ success: true, subadmin: newSub });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
