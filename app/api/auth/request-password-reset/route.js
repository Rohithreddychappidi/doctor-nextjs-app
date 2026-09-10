import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const user = await db.findUserByEmail(email);
    // Standard security: don't disclose whether email exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with that email, a password reset link has been dispatched.",
      });
    }

    const resetToken = `rst_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/student-login?reset_token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Reset your Dr. Janardhan Mydam Education Portal password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset for your student account.</p>
          <p><a href="${resetUrl}" style="background-color: #0f766e; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none; display: inline-block;">Reset Password</a></p>
          <p style="color: #64748b; font-size: 12px;">This link will expire in 60 minutes.</p>
        </div>
      `,
      text: `Reset your password at: ${resetUrl}`,
    });

    await db.logAudit("PASSWORD_RESET_REQUESTED", user.id, user.email, "127.0.0.1", { token: resetToken });

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, a password reset link has been dispatched.",
      token: resetToken, // Exposed in demo environment for convenience
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
