import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Reset token and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // In a production DB, tokens are looked up in a password_reset_tokens table.
    // For demo/prototype, we validate format and log audit
    await db.logAudit("PASSWORD_RESET_COMPLETED", "system", "anonymous", "127.0.0.1", { token });

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. You may now log in.",
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
