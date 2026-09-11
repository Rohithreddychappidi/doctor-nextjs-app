import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const specializations = await db.getSpecializations();
    return NextResponse.json({ success: true, specializations });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
