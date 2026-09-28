import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// RFC 6238 TOTP (SHA-1, 6 digits, 30s) — the variant every authenticator
// app (Google Authenticator, Authy, 1Password, Microsoft Authenticator)
// supports. Implemented on Node's built-in crypto so there's no extra
// dependency to audit or keep patched.

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const PERIOD_SECONDS = 30;

function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
    value &= (1 << bits) - 1;
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(input: string): Buffer {
  const clean = input.replace(/=+$/, "").replace(/\s+/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const idx = ALPHABET.indexOf(char);
    if (idx === -1) throw new Error("Invalid base32 secret");
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
    value &= (1 << bits) - 1;
  }
  return Buffer.from(bytes);
}

/** 160-bit random secret, base32-encoded (32 characters). */
export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20));
}

export function isValidTotpSecret(secret: string): boolean {
  return /^[A-Z2-7]{16,64}$/.test(secret);
}

function hotp(secret: Buffer, counter: number): string {
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac("sha1", secret).update(message).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(binary % 1_000_000).padStart(6, "0");
}

/**
 * Checks a 6-digit code against the secret, allowing one 30-second step
 * either side for clock drift. Returns the matching time-step counter (used
 * by the caller to reject replays of an already-used code) or null.
 */
export function verifyTotp(secret: string, token: string, nowMs = Date.now()): number | null {
  if (!/^\d{6}$/.test(token)) return null;

  let key: Buffer;
  try {
    key = base32Decode(secret);
  } catch {
    return null;
  }

  const currentCounter = Math.floor(nowMs / 1000 / PERIOD_SECONDS);
  const given = Buffer.from(token);
  let matched: number | null = null;

  for (const drift of [-1, 0, 1]) {
    const counter = currentCounter + drift;
    const expected = Buffer.from(hotp(key, counter));
    // Compare every candidate in constant time; don't short-circuit.
    if (timingSafeEqual(given, expected) && matched === null) matched = counter;
  }
  return matched;
}

export function otpauthUri(email: string, secret: string, issuer = "Koraq Labs Admin"): string {
  const label = `${encodeURIComponent(issuer)}:${encodeURIComponent(email)}`;
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=${PERIOD_SECONDS}`;
}
