import "@tanstack/react-start/server-only";

import { getCookies, setCookie } from "@tanstack/react-start/server";
import { sql } from "@/lib/db.server";

export type AdminSession = {
  userId: string;
  email: string | null;
  name: string | null;
  role: string | null;
};

const betterAuthCookieNames = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.session-token",
  "__Secure-better-auth.session-token",
];

export const SESSION_COOKIE_NAME = betterAuthCookieNames[0] ?? "better-auth.session_token";
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export async function requireAdminSession(): Promise<AdminSession> {
  const token = getBetterAuthSessionToken();

  if (!token) {
    throwUnauthorized();
  }

  try {
    const rows = await sql`
      select
        s.user_id as "userId",
        to_jsonb(u)->>'email' as email,
        to_jsonb(u)->>'name' as name,
        to_jsonb(u)->>'role' as role
      from "session" s
      join "user" u on u.id = s.user_id
      where s.token = ${token}
        and s.expires_at > now()
      limit 1
    `;

    const session = (rows as AdminSession[])[0];
    if (!session) throwUnauthorized();

    const adminEmails = getAdminEmailAllowlist();
    if (!session.email || !adminEmails.includes(session.email.toLowerCase())) {
      throwForbidden();
    }

    if (session.role && !["admin", "super_admin", "owner"].includes(session.role)) {
      throwForbidden();
    }

    return session;
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Admin session validation failed", error);
    throwUnauthorized();
  }
}

export async function createAdminSession(userId: string) {
  const token = randomToken() + randomToken();
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

  await sql`
    insert into "session" (id, user_id, token, expires_at)
    values (${id}, ${userId}, ${token}, ${expiresAt})
  `;

  setCookie(SESSION_COOKIE_NAME, `${token}.${randomToken()}`, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    expires: expiresAt,
  });
}

export async function revokeCurrentAdminSession() {
  const token = getBetterAuthSessionToken();
  if (token) {
    await sql`delete from "session" where token = ${token}`;
  }
  setCookie(SESSION_COOKIE_NAME, "", {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getOptionalAdminSession(): Promise<AdminSession | null> {
  try {
    return await requireAdminSession();
  } catch {
    return null;
  }
}

function getBetterAuthSessionToken() {
  const cookies = getCookies();
  for (const name of betterAuthCookieNames) {
    const value = cookies[name];
    if (value) return decodeURIComponent(value).split(".")[0] || value;
  }

  for (const [name, value] of Object.entries(cookies)) {
    if (name.includes("better-auth") && name.includes("session") && value) {
      return decodeURIComponent(value).split(".")[0] || value;
    }
  }

  return null;
}

function getAdminEmailAllowlist() {
  return (process.env["ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmailAllowed(email: string) {
  return getAdminEmailAllowlist().includes(email.trim().toLowerCase());
}

function randomToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isSecureCookie(): boolean {
  return process.env["NODE_ENV"] === "production";
}

function throwUnauthorized(): never {
  throw new Response("Unauthorized", { status: 401 });
}

function throwForbidden(): never {
  throw new Response("Forbidden", { status: 403 });
}
