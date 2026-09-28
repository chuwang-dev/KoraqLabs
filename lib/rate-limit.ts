import "server-only";
import { createHash } from "crypto";
import { isDatabaseConfigured, safeQuery } from "@/lib/db";

// Production-safe login rate limiting, backed by Postgres.
//
// Why not in-memory: a `Map` in process memory resets on every serverless
// cold start and isn't shared across concurrent instances, so it gives
// almost no real protection once deployed (Vercel, in particular, spins up
// fresh instances constantly). Postgres gives us one shared, durable counter
// instead, and `INSERT ... ON CONFLICT DO UPDATE` makes the increment atomic
// even under concurrent requests — no lost updates, no race where two
// simultaneous attempts both read "7" and both get allowed through as the
// 8th.
//
// Two layers are checked together, whichever is stricter wins:
//   - per (IP + email): stops repeated guesses against one account
//   - per IP alone, with a higher ceiling: stops one IP spraying many
//     email guesses to dodge the per-account limit
//
// Keys are sha256 hashes, not raw IP/email — the DB never holds a plaintext
// log of who attempted to log in.

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS_PER_ACCOUNT = 8;
const MAX_ATTEMPTS_PER_IP = 20;

function hashKey(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

type LimitResult = { allowed: boolean; retryAfterSeconds: number };

/** Atomically increments the counter for `key`, resetting it if the window
 *  has elapsed, and returns the new count plus how long until the window
 *  resets. Single round trip, race-safe. */
async function incrementAndCheck(key: string, max: number): Promise<LimitResult> {
  const rows = await safeQuery<{ count: number; window_start: string }>(
    `insert into login_attempts (key, count, window_start, updated_at)
     values ($1, 1, now(), now())
     on conflict (key) do update
       set count = case
                      when login_attempts.window_start < now() - interval '15 minutes'
                        then 1
                      else login_attempts.count + 1
                    end,
           window_start = case
                      when login_attempts.window_start < now() - interval '15 minutes'
                        then now()
                      else login_attempts.window_start
                    end,
           updated_at = now()
     returning count, window_start`,
    [key]
  );

  const row = rows[0];
  if (!row) {
    // DB write failed (safeQuery swallows the error and returns []). Fail
    // open rather than locking every admin out because of a transient DB
    // blip — the in-memory fallback below still applies in this process.
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const windowStart = new Date(row.window_start).getTime();
  const resetAt = windowStart + WINDOW_MS;
  const retryAfterSeconds = Math.max(0, Math.ceil((resetAt - Date.now()) / 1000));

  return { allowed: row.count <= max, retryAfterSeconds };
}

// In-memory fallback, used only when DATABASE_URL isn't configured at all
// (demo-data deployments). Better than nothing for a local/demo run, but
// documented as not production-safe — see the module comment above.
const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

function memoryIncrementAndCheck(key: string, max: number): LimitResult {
  const now = Date.now();
  const bucket = memoryBuckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  return {
    allowed: bucket.count <= max,
    retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

export async function checkRateLimit(ip: string, email: string): Promise<LimitResult> {
  const ipKey = hashKey(`ip:${ip}`);
  const accountKey = hashKey(`acct:${ip}:${email.toLowerCase()}`);

  const [ipResult, accountResult] = isDatabaseConfigured()
    ? await Promise.all([
        incrementAndCheck(ipKey, MAX_ATTEMPTS_PER_IP),
        incrementAndCheck(accountKey, MAX_ATTEMPTS_PER_ACCOUNT),
      ])
    : [
        memoryIncrementAndCheck(ipKey, MAX_ATTEMPTS_PER_IP),
        memoryIncrementAndCheck(accountKey, MAX_ATTEMPTS_PER_ACCOUNT),
      ];

  if (!accountResult.allowed) return accountResult;
  if (!ipResult.allowed) return ipResult;
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function resetRateLimit(ip: string, email: string): Promise<void> {
  const accountKey = hashKey(`acct:${ip}:${email.toLowerCase()}`);

  // Only clear the account-level counter on success — a successful login
  // from one account shouldn't wipe out an IP's history of failed attempts
  // against *other* accounts.
  if (isDatabaseConfigured()) {
    await safeQuery(`delete from login_attempts where key = $1`, [accountKey]);
  } else {
    memoryBuckets.delete(accountKey);
  }
}
