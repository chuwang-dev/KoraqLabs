// Edge-safe session helpers.
//
// `next/headers` cookies() and Node-only crypto (bcrypt, pg) cannot run
// inside middleware (the Edge runtime). This module only uses `jose` and
// Web Crypto, both available at the edge, so it's the fast-path check used
// by middleware.ts. The Node-side lib/auth.ts layers a second, authoritative
// check on top (see getSession there) that also verifies the session's
// `jti` hasn't been revoked in Postgres — something this module can't do,
// since `pg` isn't edge-compatible. That split is deliberate: middleware
// rejects obviously-invalid/expired tokens cheaply on every request, while
// the revocation check (the one that makes "log out everywhere" real)
// happens where a DB connection is available.

import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "koraq_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  sub: string; // admin email
  jti: string; // session id, checked against admin_sessions for revocation
  iat: number;
  exp: number;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is not set (or is too short). Set a strong random value — e.g. `openssl rand -base64 32`."
    );
  }
  return new TextEncoder().encode(secret);
}

function generateSessionId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function createSessionToken(email: string): Promise<{ token: string; jti: string; expiresAt: Date }> {
  const now = Math.floor(Date.now() / 1000);
  const jti = generateSessionId();
  const exp = now + SESSION_DURATION_SECONDS;

  const token = await new SignJWT({ sub: email, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(getSecretKey());

  return { token, jti, expiresAt: new Date(exp * 1000) };
}

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string" || typeof payload.jti !== "string") return null;
    return payload as SessionPayload;
  } catch {
    // Expired, malformed, or signed with a different secret.
    return null;
  }
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  maxAgeSeconds: SESSION_DURATION_SECONDS,
} as const;

// ── Two-factor "password verified, code still needed" token ────────────────
// Short-lived and single-purpose. It has no `jti` and carries
// purpose="2fa", so verifySessionToken() rejects it — it can never be used
// as a session — and verifyPendingToken() rejects real session tokens.
export const PENDING_COOKIE = "koraq_admin_2fa_pending";
export const PENDING_DURATION_SECONDS = 5 * 60;

export async function createPendingToken(email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ sub: email, purpose: "2fa" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + PENDING_DURATION_SECONDS)
    .sign(getSecretKey());
}

export async function verifyPendingToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.purpose !== "2fa" || typeof payload.sub !== "string") return null;
    return payload.sub;
  } catch {
    return null;
  }
}
