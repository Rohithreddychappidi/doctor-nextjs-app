import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { verifyTOTP } from "@/lib/totp";

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and 6-digit verification code are required (*)" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = await db.findUserByEmail(cleanEmail);

    const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const assistantEmails = [
      process.env.ASSISTANT_EMAIL_1,
      process.env.ASSISTANT_EMAIL_2,
      ...(process.env.ASSISTANT_EMAILS ? process.env.ASSISTANT_EMAILS.split(",") : []),
    ]
      .filter(Boolean)
      .map((e) => e.toLowerCase().trim());

    const isSuperAdmin = Boolean(configuredAdminEmail && cleanEmail === configuredAdminEmail);
    const isAssistantAdmin = assistantEmails.includes(cleanEmail);

    if (!user && (isSuperAdmin || isAssistantAdmin)) {
      user = {
        id: isSuperAdmin ? "usr_admin_jvm" : `usr_asst_${Date.now().toString(36)}`,
        email: cleanEmail,
        role: isSuperAdmin ? "super_admin" : "sub_admin",
        two_factor_secret: process.env.ADMIN_2FA_SECRET || "JVM2FASECUREMYDAM2026",
      };
    }

    if (!user) {
      return NextResponse.json({ error: "User account not found" }, { status: 404 });
    }

    const secret = user.two_factor_secret || process.env.ADMIN_2FA_SECRET || "JVM2FASECUREMYDAM2026";
    const isValid = verifyTOTP(code, secret);

    if (!isValid) {
      await db.logAudit(
        "2FA_VERIFICATION_FAILED",
        user.id,
        user.email,
        request.headers.get("x-forwarded-for") || "127.0.0.1",
        { reason: "Invalid 6-digit authenticator code" }
      );
      return NextResponse.json(
        { error: "Invalid verification code. Please check your Authenticator app and try again." },
        { status: 401 }
      );
    }

    const profile = await db.getStudentProfile(user.id);
    const roles = await db.getUserRoles(user.id);
    const primaryRole = isSuperAdmin
      ? "super_admin"
      : isAssistantAdmin
      ? "sub_admin"
      : (user.role || (roles.includes("super_admin")
      ? "super_admin"
      : roles.includes("admin")
      ? "admin"
      : roles.includes("sub_admin")
      ? "sub_admin"
      : roles.includes("physician")
      ? "physician"
      : roles[0] || "student"));
    const effectiveRoles = isSuperAdmin
      ? Array.from(new Set([...roles, "super_admin", "admin", "physician"]))
      : isAssistantAdmin
      ? Array.from(new Set([...roles, "sub_admin", "admin"]))
      : roles;
    const fullName = profile
      ? `${profile.first_name} ${profile.last_name}`.trim()
      : isSuperAdmin
      ? "Dr. Janardhan Mydam, MD, FAAP"
      : isAssistantAdmin
      ? "Assistant Administrator"
      : user.email;

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: fullName,
      role: primaryRole,
      roles,
      permissions: user.permissions || [],
      specialty: profile?.specialty_interest || "General Medicine",
      two_factor_verified: true,
    };

    const token = await createToken(tokenPayload);

    await db.logAudit(
      "2FA_VERIFICATION_SUCCESS",
      user.id,
      user.email,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { role: primaryRole, permissions: user.permissions || [] }
    );

    const response = NextResponse.json({
      success: true,
      user: tokenPayload,
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("2FA verification error:", err);
    return NextResponse.json({ error: "2FA verification failed" }, { status: 500 });
  }
}
