import { NextResponse } from "next/server";
import { db, memoryStore } from "@/lib/db";

export async function GET() {
  try {
    const programs = await db.getAllPrograms();
    return NextResponse.json({ success: true, programs: programs || memoryStore.programs });
  } catch (err) {
    return NextResponse.json({ success: true, programs: memoryStore.programs });
  }
}
