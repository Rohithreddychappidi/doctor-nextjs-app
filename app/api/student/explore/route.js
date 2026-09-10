import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    const programs = session
      ? await db.getExploreProgramsForStudent(session.id)
      : await db.getAllPrograms();

    return NextResponse.json({
      success: true,
      programs,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
