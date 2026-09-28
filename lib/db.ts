import "server-only";
import { Pool, type QueryResultRow } from "pg";

// Lazily-created singleton pool, reused across server actions/route handlers
// in the same process (and across hot-reloads in dev via globalThis).
declare global {
  var __koraqPgPool: Pool | undefined;
}

/**
 * Returns a Postgres pool, or `null` if DATABASE_URL isn't configured.
 *
 * Every caller in lib/admin-data.ts checks for `null` and falls back to
 * clearly-labeled demo data — the dashboard should be viewable and useful
 * the moment you deploy it, before you've wired up a database, rather than
 * erroring out.
 */
export function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  if (!global.__koraqPgPool) {
    global.__koraqPgPool = new Pool({
      connectionString,
      max: 5,
      ssl: connectionString.includes("sslmode=require")
        ? { rejectUnauthorized: false }
        : undefined,
    });
  }
  return global.__koraqPgPool;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Thin query wrapper: returns [] on connection failure rather than throwing,
 *  so a flaky DB degrades the admin UI instead of crashing it. Errors are
 *  still logged server-side for visibility. Use this for reads (dashboard
 *  metrics, lists) where "show nothing" is an acceptable failure mode. */
export async function safeQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const pool = getPool();
  if (!pool) return [];
  try {
    const result = await pool.query<T>(text, params);
    return result.rows;
  } catch (error) {
    console.error("Database query failed:", error);
    return [];
  }
}

export type MutateResult<T> = { ok: true; rows: T[] } | { ok: false; error: string };

/**
 * Query wrapper for writes where the caller needs to know *whether it
 * worked*, not just get an empty array back — a create/edit form that
 * silently no-ops on a constraint violation (a duplicate slug, say) looks
 * broken to the person using it. Common Postgres error codes are mapped to
 * a message worth showing directly; anything else gets a generic one
 * (raw driver errors can leak schema details).
 */
export async function mutate<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<MutateResult<T>> {
  const pool = getPool();
  if (!pool) return { ok: false, error: "Database is not configured." };
  try {
    const result = await pool.query<T>(text, params);
    return { ok: true, rows: result.rows };
  } catch (error) {
    console.error("Database mutation failed:", error);
    const code = (error as { code?: string } | null)?.code;
    if (code === "23505") return { ok: false, error: "That value is already in use (must be unique)." };
    if (code === "23502") return { ok: false, error: "A required field is missing." };
    if (code === "22P02") return { ok: false, error: "One of the values wasn't in the expected format." };
    return { ok: false, error: "Something went wrong saving that. Please try again." };
  }
}
