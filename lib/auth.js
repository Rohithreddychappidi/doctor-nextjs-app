// Authentication and session management helper using bcryptjs and jose
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "janardhan-mydam-secure-jwt-token-key-2026-secret"
);

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hash) {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

export async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth_token");
    if (!tokenCookie || !tokenCookie.value) {
      return null;
    }
    const payload = await verifyToken(tokenCookie.value);
    if (!payload) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  const configuredAdminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const assistantEmails = [
    process.env.ASSISTANT_EMAIL_1,
    process.env.ASSISTANT_EMAIL_2,
    ...(process.env.ASSISTANT_EMAILS ? process.env.ASSISTANT_EMAILS.split(",") : []),
  ]
    .filter(Boolean)
    .map((e) => e.toLowerCase().trim());

  const userEmail = (user.email || "").toLowerCase().trim();
  const isSuperAdmin = Boolean(configuredAdminEmail && userEmail === configuredAdminEmail);
  const isAssistant = assistantEmails.includes(userEmail);
  const hasAdminRole =
    user.role === "super_admin" ||
    user.role === "admin" ||
    user.role === "sub_admin" ||
    (Array.isArray(user.roles) &&
      (user.roles.includes("super_admin") ||
        user.roles.includes("admin") ||
        user.roles.includes("sub_admin")));

  if (!isSuperAdmin && !isAssistant && !hasAdminRole) {
    throw new Error("Forbidden: Access restricted to authorized administrator.");
  }
  return user;
}

export async function requireRole(allowedRoles = []) {
  const user = await requireAuth();
  const userRoles = Array.isArray(user.roles)
    ? user.roles
    : (user.role ? [user.role] : ["student"]);
  const hasRole = allowedRoles.some((r) => userRoles.includes(r));
  if (!hasRole) {
    throw new Error("Forbidden: Insufficient privileges");
  }
  return user;
}

export async function requireEnrollment(programKey) {
  const user = await requireAuth();
  const isEnrolled = await db.isEnrolledIn(user.id, programKey);
  if (!isEnrolled) {
    throw new Error(`Enrollment required for program: ${programKey}`);
  }
  return user;
}
