import "server-only";
import { Pool, type QueryResultRow } from "pg";

// Lazily-created singleton pool, reused across server actions/route handlers
// in the same process (and across hot-reloads in dev via globalThis).
declare global {
  // eslint-disable-next-line no-var
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
 *  still logged server-side for visibility. */
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
