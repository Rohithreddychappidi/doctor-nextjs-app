import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { credential, demoEmail, role = "student" } = body;

    let email = role === "guest" ? "guest@jvmmedicalservices.com" : "student@jvmmedicalservices.com";
    let fullName = role === "guest" ? "Guest User" : "Medical Student";
    let avatarUrl = null;

    // Decode Google JWT payload if provided
    if (credential) {
      try {
        const parts = credential.split(".");
        if (parts.length === 3) {
          const payloadStr = Buffer.from(parts[1], "base64").toString("utf-8");
          const payload = JSON.parse(payloadStr);
          if (payload.email) {
            email = payload.email.toLowerCase().trim();
            fullName = payload.name || `${payload.given_name || ""} ${payload.family_name || ""}`.trim() || email;
            avatarUrl = payload.picture || null;
          }
        }
      } catch (decodeErr) {
        console.warn("Could not decode Google credential JWT, using default profile:", decodeErr);
      }
    } else if (demoEmail) {
      email = demoEmail.toLowerCase().trim();
    }

    const assignedRole = role === "guest" ? "guest" : "student";

    // Look up or auto-provision profile
    let user = await db.findUserByEmail(email);
    if (!user) {
      user = await db.createUser({
        id: `usr_google_${Date.now().toString(36)}`,
        email,
        full_name: fullName,
        role: assignedRole,
        password_hash: "google_oauth_managed",
        specialty: assignedRole === "guest" ? "Community Visitor" : "Medical Student",
        description: "Authenticated via Google Single Sign-On."
      });
    }

    const profile = await db.getStudentProfile(user.id);
    const roles = await db.getUserRoles(user.id);
    const primaryRole = roles.includes("admin")
      ? "admin"
      : roles.includes("guest")
      ? "guest"
      : "student";

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : fullName,
      role: primaryRole,
      roles,
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
