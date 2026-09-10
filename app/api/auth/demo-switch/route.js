import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { persona } = await request.json();

    let email = "student.a@example.com";
    if (persona === "student_a" || persona === "A") email = "student.a@example.com";
    else if (persona === "student_b" || persona === "B") email = "student.b@example.com";
    else if (persona === "student_c" || persona === "C") email = "student.c@example.com";
    else if (persona === "student_d" || persona === "D") email = "student.d@example.com";
    else if (persona === "student_f" || persona === "F") email = "student.f@example.com";
    else if (persona === "admin") email = "admin@jva-medical.com";

    const user = await db.findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "Persona user not found" }, { status: 404 });
    }

    const profile = await db.getStudentProfile(user.id);
    const roles = await db.getUserRoles(user.id);

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : user.email,
      roles,
    };

    const token = await createToken(tokenPayload);

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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
