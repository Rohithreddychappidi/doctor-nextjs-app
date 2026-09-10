import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const updated = await db.updateClass(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, class: updated });
  } catch (err) {
    console.error("Update class error:", err);
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await db.deleteClass(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete class error:", err);
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
  }
}
