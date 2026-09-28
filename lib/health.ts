import "server-only";
import { isDatabaseConfigured, safeQuery } from "@/lib/db";
import { siteConfig } from "@/lib/config";

export type HealthCheck = {
  id: number;
  checked_at: string;
  operational: boolean;
  status_code: number | null;
  response_time_ms: number | null;
  ssl_valid: boolean | null;
  performance_score: number | null;
  accessibility_score: number | null;
  seo_score: number | null;
  best_practices_score: number | null;
  scores_source: string | null;
  deployment_env: string | null;
  deployment_commit: string | null;
  checked_url: string | null;
  error: string | null;
};

export function getDeploymentInfo(): { env: string | null; commit: string | null; available: boolean } {
  // Vercel's system environment variables. On other hosts these are simply
  // unset, and the UI says so plainly rather than guessing.
  const env = process.env.VERCEL_ENV ?? null;
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null;
  return { env, commit, available: Boolean(env || commit) };
}

/**
 * Runs a real, on-demand check: fetches the live site to measure
 * reachability, response time, and (implicitly, via fetch success over
 * HTTPS) TLS validity — then, if a PageSpeed Insights request succeeds,
 * attaches real Lighthouse scores. No score is ever fabricated: if
 * PageSpeed fails or times out, performance/accessibility/seo/best-practice
 * scores are simply left null and the UI says why.
 */
export async function runHealthCheck(): Promise<HealthCheck> {
  const deployment = getDeploymentInfo();
  const vercelHost = deployment.env === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : process.env.VERCEL_URL;
  const checkedUrl = vercelHost
    ? `https://${vercelHost}`
    : siteConfig.url;
  let operational = false;
  let statusCode: number | null = null;
  let responseTimeMs: number | null = null;
  let sslValid: boolean | null = null;
  let error: string | null = null;

  const start = Date.now();
  try {
    const response = await fetch(checkedUrl, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    responseTimeMs = Date.now() - start;
    statusCode = response.status;
    operational = response.status >= 200 && response.status < 400;
    // A successful fetch over https:// with no thrown error means Node
    // accepted the certificate chain — the closest honest signal of SSL
    // validity we can get without a dedicated TLS-inspection library.
    sslValid = checkedUrl.startsWith("https://");
  } catch (err) {
    responseTimeMs = Date.now() - start;
    operational = false;
    sslValid = false;
    const cause = err instanceof Error ? (err.cause as { code?: string; message?: string } | undefined) : undefined;
    error = cause?.code
      ? `Request failed (${cause.code})${cause.message ? `: ${cause.message}` : ""}`
      : err instanceof Error
        ? err.message
        : "Request failed";
  }

  let performanceScore: number | null = null;
  let accessibilityScore: number | null = null;
  let seoScore: number | null = null;
  let bestPracticesScore: number | null = null;
  let scoresSource: string | null = null;

  try {
    const apiKey = process.env.PAGESPEED_API_KEY;
    const params = new URLSearchParams({ url: checkedUrl, strategy: "mobile" });
    ["performance", "accessibility", "seo", "best-practices"].forEach((c) => params.append("category", c));
    if (apiKey) params.set("key", apiKey);

    const psiResponse = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
      { signal: AbortSignal.timeout(25_000), cache: "no-store" }
    );

    if (psiResponse.ok) {
      const data = await psiResponse.json();
      const categories = data?.lighthouseResult?.categories;
      if (categories) {
        performanceScore = scoreFrom(categories.performance);
        accessibilityScore = scoreFrom(categories.accessibility);
        seoScore = scoreFrom(categories.seo);
        bestPracticesScore = scoreFrom(categories["best-practices"]);
        scoresSource = "Google PageSpeed Insights";
      }
    }
  } catch {
    // PageSpeed is best-effort — reachability/uptime above is the part that
    // must not fail silently, so we don't let a PSI timeout affect it.
  }

  const result: Omit<HealthCheck, "id" | "checked_at"> = {
    operational,
    status_code: statusCode,
    response_time_ms: responseTimeMs,
    ssl_valid: sslValid,
    performance_score: performanceScore,
    accessibility_score: accessibilityScore,
    seo_score: seoScore,
    best_practices_score: bestPracticesScore,
    scores_source: scoresSource,
    deployment_env: deployment.env,
    deployment_commit: deployment.commit,
    checked_url: checkedUrl,
    error,
  };

  if (isDatabaseConfigured()) {
    const rows = await safeQuery<HealthCheck>(
      `insert into health_checks
        (operational, status_code, response_time_ms, ssl_valid, performance_score, accessibility_score,
         seo_score, best_practices_score, scores_source, deployment_env, deployment_commit, checked_url, error)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       returning *`,
      [
        result.operational, result.status_code, result.response_time_ms, result.ssl_valid,
        result.performance_score, result.accessibility_score, result.seo_score, result.best_practices_score,
        result.scores_source, result.deployment_env, result.deployment_commit, result.checked_url, result.error,
      ]
    );
    if (rows[0]) return rows[0];
  }

  // No DB configured (or the insert failed): return an in-memory result so
  // the check still shows something for this one request, just unsaved.
  return { id: 0, checked_at: new Date().toISOString(), ...result };
}

export async function getLatestHealthCheck(): Promise<HealthCheck | null> {
  if (!isDatabaseConfigured()) return null;
  const rows = await safeQuery<HealthCheck>(`select * from health_checks order by checked_at desc limit 1`);
  return rows[0] ?? null;
}

export async function getHealthCheckHistory(limit = 10): Promise<HealthCheck[]> {
  if (!isDatabaseConfigured()) return [];
  return safeQuery<HealthCheck>(`select * from health_checks order by checked_at desc limit $1`, [limit]);
}

function scoreFrom(category: { score?: number } | undefined): number | null {
  if (!category || typeof category.score !== "number") return null;
  return Math.round(category.score * 100);
}
