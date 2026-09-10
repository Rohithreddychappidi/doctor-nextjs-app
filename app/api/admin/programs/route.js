import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const programs = await db.getAllPrograms();
    return NextResponse.json({ success: true, programs });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await requireRole(["admin", "super_admin"]);
    const { id, updates } = await request.json();

    const idx = memoryStore.programs.findIndex((p) => p.id === id);
    if (idx === -1) {
      return NextResponse.json({ error: "Program not found" }, { status: 404 });
    }

    memoryStore.programs[idx] = { ...memoryStore.programs[idx], ...updates };

    return NextResponse.json({
      success: true,
      program: memoryStore.programs[idx],
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 403 });
  }
}
