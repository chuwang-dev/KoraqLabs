import "server-only";

import { cookies } from "next/headers";
import { compare, hash } from "bcryptjs";
import { createHash } from "crypto";
import {
  PENDING_COOKIE,
  PENDING_DURATION_SECONDS,
  SESSION_COOKIE,
  createPendingToken,
  createSessionToken,
  sessionCookieOptions,
  verifyPendingToken,
  verifySessionToken,
} from "@/lib/auth-edge";
import { isDatabaseConfigured, mutate, safeQuery } from "@/lib/db";
import { verifyTotp } from "@/lib/totp";

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
  const { token, jti, expiresAt } = await createSessionToken(email);

  // Persisting the jti is what makes revocation real. If no DB is
  // configured, the session still works (stateless JWT), it just can't be
  // individually revoked later — only by rotating AUTH_SECRET.
  if (isDatabaseConfigured()) {
    await safeQuery(
      `insert into admin_sessions (id, admin_email, expires_at) values ($1,$2,$3)`,
      [jti, email, expiresAt.toISOString()]
    );
  }

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
  const token = store.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (session && isDatabaseConfigured()) {
    await safeQuery(`delete from admin_sessions where id = $1`, [session.jti]);
  }

  store.delete(SESSION_COOKIE);
}

/** Revokes every active session — "log out everywhere". Includes the
 *  current one, so the caller is logged out too on their next request. */
export async function destroyAllSessions(adminEmail: string): Promise<number> {
  if (!isDatabaseConfigured()) return 0;
  const rows = await safeQuery<{ id: string }>(
    `delete from admin_sessions where admin_email = $1 returning id`,
    [adminEmail]
  );
  return rows.length;
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);
  if (!session) return null;

  // Authoritative revocation check. Skipped only when there's no DB to
  // check against — see the module comment in lib/auth-edge.ts for why
  // this can't happen in middleware itself.
  if (isDatabaseConfigured()) {
    const rows = await safeQuery<{ id: string }>(
      `select id from admin_sessions where id = $1 and expires_at > now()`,
      [session.jti]
    );
    if (rows.length === 0) return null;
  }

  return session;
}

/** Throws-free guard for use in server components/actions: returns the session or null. */
export async function getAdminEmail(): Promise<string | null> {
  const session = await getSession();
  return session?.sub ?? null;
}

// ── Two-factor authentication (TOTP) ───────────────────────────────────────
// The TOTP secret lives in ADMIN_TOTP_SECRET, alongside the other admin
// credentials — never in the database or the browser. If it's unset, login
// is password-only. Recovery if you lose your authenticator: remove the env
// var and redeploy (you'll still need the password).

export function isTwoFactorEnabled(): boolean {
  return Boolean(process.env.ADMIN_TOTP_SECRET);
}

/** Returns the matched time-step counter for a valid code, else null. */
export function checkTwoFactorCode(code: string): number | null {
  const secret = process.env.ADMIN_TOTP_SECRET;
  if (!secret) return null;
  return verifyTotp(secret, code);
}

const usedTotpCounters = new Set<string>();

/**
 * A TOTP code is valid for ~90s, so without this an eavesdropped code could
 * be replayed. Records each accepted (email, time-step) once; a second use
 * is rejected. Uses the shared DB when available, in-memory otherwise.
 * Fails open if the DB write itself errors, so a DB blip can't lock the
 * admin out.
 */
export async function claimTotpCounter(email: string, counter: number): Promise<boolean> {
  const key = createHash("sha256").update(`totp-used:${email.toLowerCase()}:${counter}`).digest("hex");

  if (!isDatabaseConfigured()) {
    if (usedTotpCounters.has(key)) return false;
    usedTotpCounters.add(key);
    return true;
  }

  const result = await mutate<{ key: string }>(
    `insert into login_attempts (key, count) values ($1, 1) on conflict (key) do nothing returning key`,
    [key]
  );
  if (!result.ok) return true;
  return result.rows.length > 0;
}

export async function setPendingTwoFactor(email: string) {
  const token = await createPendingToken(email);
  const store = await cookies();
  store.set(PENDING_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PENDING_DURATION_SECONDS,
  });
}

export async function getPendingTwoFactorEmail(): Promise<string | null> {
  const store = await cookies();
  return verifyPendingToken(store.get(PENDING_COOKIE)?.value);
}

export async function clearPendingTwoFactor() {
  const store = await cookies();
  store.delete(PENDING_COOKIE);
}
