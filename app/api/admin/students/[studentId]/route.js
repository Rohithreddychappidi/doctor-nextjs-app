import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    await requireRole(["admin", "super_admin", "mentor"]);
    const { studentId } = await params;

    const record = await db.getStudentFullRecord(studentId);
    if (!record) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      record,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}

export async function PUT(request, { params }) {
  try {
    await requireRole(["admin", "super_admin"]);
    const { studentId } = await params;
    const body = await request.json();

    const updated = await db.updateStudentProfile(studentId, body);

    return NextResponse.json({
      success: true,
      profile: updated,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
