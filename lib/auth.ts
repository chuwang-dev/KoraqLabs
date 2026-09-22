import "server-only";

import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/auth-edge";

const BCRYPT_ROUNDS = 12;

/** Hash a plaintext password for storage (used by the seed script, not at runtime). */
export function hashPassword(plain: string): Promise<string> {
  return hash(plain, BCRYPT_ROUNDS);
}

/**
 * Verify admin credentials against environment-configured values.
 *
 * Single-admin, env-based auth by design: ADMIN_EMAIL is a plain env var,
 * ADMIN_PASSWORD_HASH is a bcrypt hash (never the plaintext password) also
 * set via env var. This keeps login working with zero database dependency,
 * which matters because the rest of the dashboard is designed to degrade to
 * demo data when DATABASE_URL isn't set — auth shouldn't be the thing that
 * blocks a first deploy.
 */
export async function verifyAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.error(
      "ADMIN_EMAIL or ADMIN_PASSWORD_HASH is not set. See .env.example / README for setup."
    );
    return false;
  }

  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
    return false;
  }

  return compare(password, adminPasswordHash);
}

export async function createSession(email: string) {
  const token = await createSessionToken(email);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionCookieOptions.maxAgeSeconds,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Throws-free guard for use in server components/actions: returns the session or null. */
export async function getAdminEmail(): Promise<string | null> {
  const session = await getSession();
  return session?.sub ?? null;
}
