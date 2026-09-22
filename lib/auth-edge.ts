// Edge-safe session helpers.
//
// `next/headers` cookies() and Node-only crypto (bcrypt) cannot run inside
// middleware (the Edge runtime). This module only uses `jose`, which works
// in both the Edge runtime and Node, so it's the single source of truth for
// "is this request authenticated" — imported by both middleware.ts and the
// Node-side lib/auth.ts.

import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "koraq_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionPayload = {
  sub: string; // admin email
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

export async function createSessionToken(email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ sub: email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_DURATION_SECONDS)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (typeof payload.sub !== "string") return null;
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
