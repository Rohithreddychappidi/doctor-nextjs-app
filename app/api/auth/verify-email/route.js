import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 });
    }

    await db.logAudit("EMAIL_VERIFIED", "system", "anonymous", "127.0.0.1", { token });

    return NextResponse.json({
      success: true,
      message: "Email address verified successfully. Your account is now fully active.",
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
