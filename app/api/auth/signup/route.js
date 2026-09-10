import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createToken } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email, password, full_name, specialty } = await request.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: "Full name, email, and password are mandatory fields." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    const newUser = await db.createUser({
      id: userId,
      email: cleanEmail,
      password_hash: passwordHash,
      full_name: full_name.trim(),
      role: "student",
      specialty: specialty?.trim() || "Medical Student / Trainee",
      created_at: new Date().toISOString(),
    });

    // Send welcome email via Resend
    sendWelcomeEmail({ to: cleanEmail, name: full_name.trim() }).catch((e) =>
      console.error("Welcome email error:", e)
    );

    // Audit log
    await db.logAudit(
      "STUDENT_REGISTERED",
      userId,
      cleanEmail,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { name: full_name }
    );

    const token = await createToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.full_name,
      role: newUser.role,
      specialty: newUser.specialty,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.full_name,
        role: newUser.role,
        specialty: newUser.specialty,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
