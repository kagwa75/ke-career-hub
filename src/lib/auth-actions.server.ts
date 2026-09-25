import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  createAdminSession,
  getOptionalAdminSession,
  isAdminEmailAllowed,
  revokeCurrentAdminSession,
} from "@/lib/auth.server";
import { sql } from "@/lib/db.server";
import { hashPassword, verifyPassword } from "@/lib/password.server";

const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3)
    .max(254)
    .refine((value) => /^[^\s@]+@[^\s@]+$/.test(value), "Invalid email"),
  password: z.string().min(8).max(200),
});

type AuthUserRow = {
  id: string;
  password_hash: string;
  role: string | null;
};

export const getAdminAuthStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getOptionalAdminSession();
  return { authenticated: Boolean(session) };
});

export const loginAdmin = createServerFn({ method: "POST" })
  .validator(credentialsSchema)
  .handler(async ({ data }) => {
    const email = data.email.trim().toLowerCase();

    if (!isAdminEmailAllowed(email)) {
      return { ok: false as const, error: "Invalid email or password." };
    }

    const user = await findUserByEmail(email);
    let userId: string;

    if (user) {
      if (
        (user.role && !["admin", "super_admin", "owner"].includes(user.role)) ||
        !user.password_hash ||
        !(await verifyPassword(data.password, user.password_hash))
      ) {
        return { ok: false as const, error: "Invalid email or password." };
      }
      userId = user.id;
    } else {
      const bootstrap = await tryBootstrapAdminUser(email, data.password);
      if (!bootstrap) return { ok: false as const, error: "Invalid email or password." };
      userId = bootstrap;
    }

    await createAdminSession(userId);
    return { ok: true as const };
  });

export const logoutAdmin = createServerFn({ method: "POST" }).handler(async () => {
  await revokeCurrentAdminSession();
  return { ok: true };
});

async function findUserByEmail(email: string): Promise<AuthUserRow | null> {
  const rows = await sql`
    select id, password_hash, role
    from "user"
    where lower(email) = ${email}
    limit 1
  `;
  return (rows as AuthUserRow[])[0] ?? null;
}

// Bootstraps the first admin from env when the user row does not exist yet.
// Only emails on the ADMIN_EMAILS allowlist can bootstrap, and only with the
// ADMIN_PASSWORD value. The first successful login persists the password hash.
async function tryBootstrapAdminUser(
  email: string,
  providedPassword: string,
): Promise<string | null> {
  const allowlist = (process.env["ADMIN_EMAILS"] ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  const adminPassword = process.env["ADMIN_PASSWORD"];

  if (!allowlist.includes(email) || !adminPassword || providedPassword !== adminPassword) {
    return null;
  }

  const rows = await sql`
    insert into "user" (id, email, name, role, password_hash)
    values (${crypto.randomUUID()}, ${email}, ${email.split("@")[0]}, 'admin', ${await hashPassword(providedPassword)})
    returning id
  `;
  return (rows as { id: string }[])[0]?.id ?? null;
}
