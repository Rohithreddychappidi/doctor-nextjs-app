import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const user = await requireRole(["super_admin", "admin"]);
    const { id } = await params;
    const data = await request.json();

    const updated = await db.updateSubadmin(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Sub-administrator not found" }, { status: 404 });
    }

    await db.logAudit(
      "SUBADMIN_PERMISSIONS_UPDATED",
      user.id,
      user.email,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { subadminId: id, updatedFields: Object.keys(data), permissions: updated.permissions }
    );

    return NextResponse.json({ success: true, subadmin: updated });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await requireRole(["super_admin", "admin"]);
    const { id } = await params;

    await db.deleteSubadmin(id);

    await db.logAudit(
      "SUBADMIN_REVOKED",
      user.id,
      user.email,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { revokedSubadminId: id }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
