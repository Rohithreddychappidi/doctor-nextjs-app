import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { credential, role = "student" } = body;

    if (!credential) {
      return NextResponse.json({ error: "Google sign-in token was not provided." }, { status: 400 });
    }

    let email = null;
    let fullName = "Medical Trainee";
    let firstName = "Student";
    let lastName = "";
    let avatarUrl = null;

    // Decode Google JWT payload safely
    try {
      const parts = credential.split(".");
      if (parts.length === 3) {
        const payloadStr = Buffer.from(parts[1], "base64").toString("utf-8");
        const payload = JSON.parse(payloadStr);
        if (payload.email) {
          email = payload.email.toLowerCase().trim();
          fullName = payload.name || `${payload.given_name || ""} ${payload.family_name || ""}`.trim() || email.split("@")[0];
          firstName = payload.given_name || fullName.split(" ")[0] || "Student";
          lastName = payload.family_name || fullName.split(" ").slice(1).join(" ") || "";
          avatarUrl = payload.picture || null;
        }
      }
    } catch (decodeErr) {
      console.error("Failed to decode Google credential token:", decodeErr);
      return NextResponse.json({ error: "Invalid Google credential format." }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Could not retrieve email from Google credential." }, { status: 400 });
    }

    const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const assistantEmails = [
      process.env.ASSISTANT_EMAIL_1,
      process.env.ASSISTANT_EMAIL_2,
      ...(process.env.ASSISTANT_EMAILS ? process.env.ASSISTANT_EMAILS.split(",") : []),
    ]
      .filter(Boolean)
      .map((e) => e.toLowerCase().trim());

    const isSuperAdmin = Boolean(configuredAdminEmail && email === configuredAdminEmail);
    const isAssistantAdmin = assistantEmails.includes(email);
    const isStaffAdmin = isSuperAdmin || isAssistantAdmin;

    const assignedRole = isSuperAdmin
      ? "super_admin"
      : isAssistantAdmin
      ? "sub_admin"
      : role === "guest"
      ? "guest"
      : "student";

    // Look up or auto-provision genuine profile
    let user = await db.findUserByEmail(email);
    if (!user) {
      user = await db.createUser({
        id: isSuperAdmin ? "usr_admin_jvm" : `usr_google_${Date.now().toString(36)}`,
        email,
        full_name: fullName,
        first_name: firstName,
        last_name: lastName,
        role: assignedRole,
        avatar_url: avatarUrl,
        password_hash: "google_oauth_managed",
        specialty: isSuperAdmin
          ? "Pediatrics & Neonatal-Perinatal Medicine"
          : isAssistantAdmin
          ? "Clinical Assistant / Sub-Administrator"
          : assignedRole === "guest"
          ? "Community Visitor"
          : "Medical Student",
        description: isSuperAdmin
          ? "Super-Administrator & Supervising Attending"
          : isAssistantAdmin
          ? "Assistant Administrator & Clinical Coordinator"
          : "Authenticated via Google Single Sign-On.",
      });
    }

    const profile = await db.getStudentProfile(user.id);
    const roles = await db.getUserRoles(user.id);
    const primaryRole = isSuperAdmin
      ? "super_admin"
      : isAssistantAdmin
      ? "sub_admin"
      : roles.includes("admin")
      ? "admin"
      : roles.includes("guest")
      ? "guest"
      : "student";

    const effectiveRoles = isSuperAdmin
      ? Array.from(new Set([...roles, "super_admin", "admin", "physician"]))
      : isAssistantAdmin
      ? Array.from(new Set([...roles, "sub_admin", "admin"]))
      : roles;

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : fullName,
      role: primaryRole,
      roles: effectiveRoles,
      auth_provider: "google",
      specialty: profile?.specialty_interest || (primaryRole === "guest" ? "Community Visitor" : "General Medicine"),
    };

    const token = await createToken(tokenPayload);

    await db.logAudit(
      "GOOGLE_LOGIN_SUCCESS",
      user.id,
      user.email,
      request.headers.get("x-forwarded-for") || "127.0.0.1",
      { provider: "google", email: user.email, role: primaryRole }
    );

    const response = NextResponse.json({
      success: true,
      user: tokenPayload,
      profile,
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
    console.error("Google auth route error:", err);
    return NextResponse.json({ error: "Google sign-in processing failed." }, { status: 500 });
  }
}
