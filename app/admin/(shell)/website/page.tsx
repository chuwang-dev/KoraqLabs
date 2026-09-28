import type { Metadata } from "next";
import { getDeploymentInfo, getHealthCheckHistory, getLatestHealthCheck } from "@/lib/health";
import { isDatabaseConfigured } from "@/lib/db";
import { checkNow } from "./actions";

export const metadata: Metadata = { title: "Website Health — Koraq Labs Admin" };

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ScoreCard({ label, score }: { label: string; score: number | null }) {
  const color =
    score === null
      ? "text-ink-400"
      : score >= 90
        ? "text-emerald-600"
        : score >= 50
          ? "text-amber-600"
          : "text-red-600";
  return (
    <div className="rounded-lg border border-ink-900/10 bg-paper-white p-4 text-center">
      <p className={`font-display text-3xl italic ${color}`}>{score === null ? "—" : score}</p>
      <p className="mt-1 text-xs text-ink-500">{label}</p>
    </div>
  );
}

export default async function WebsiteHealthPage() {
  const [check, deployment, history] = await Promise.all([
    getLatestHealthCheck(),
    getDeploymentInfo(),
    getHealthCheckHistory(10),
  ]);

  return (
    <div className="max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl italic text-ink-900">Website Health</h1>
          <p className="mt-1 text-sm text-ink-500">
            Real, on-demand checks — nothing here refreshes automatically or fabricates a score.
          </p>
        </div>
        <form action={checkNow}>
          <button
            type="submit"
            className="rounded bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-700"
          >
            Run check now
          </button>
        </form>
      </div>

      {!isDatabaseConfigured() ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 bg-paper-white p-5 text-sm text-ink-500">
          Connect <code className="font-mono text-xs">DATABASE_URL</code> to keep a history of checks.
          Without it, &ldquo;Run check now&rdquo; still performs a real check against the live site, but the
          result isn&rsquo;t saved between page loads.
        </div>
      ) : null}

      {!check ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-400">
          No checks run yet. Click &ldquo;Run check now&rdquo; above.
        </div>
      ) : (
        <>
          <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${check.operational ? "bg-emerald-500" : "bg-red-500"}`}
                />
                <p className="text-sm font-semibold text-ink-900">
                  {check.operational ? "Operational" : "Attention Required"}
                </p>
              </div>
              <p className="text-xs text-ink-400">Checked {formatDateTime(check.checked_at)}</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="eyebrow">Status code</p>
                <p className="mt-1 text-sm text-ink-800">{check.status_code ?? "—"}</p>
              </div>
              <div>
                <p className="eyebrow">Response time</p>
                <p className="mt-1 text-sm text-ink-800">
                  {check.response_time_ms !== null ? `${check.response_time_ms} ms` : "—"}
                </p>
              </div>
              <div>
                <p className="eyebrow">SSL</p>
                <p className="mt-1 text-sm text-ink-800">
                  {check.ssl_valid === null ? "—" : check.ssl_valid ? "Valid" : "Invalid / unreachable"}
                </p>
              </div>
              <div>
                <p className="eyebrow">Deployment</p>
                <p className="mt-1 text-sm text-ink-800">
                  {deployment.available
                    ? `${deployment.env ?? "—"}${deployment.commit ? ` · ${deployment.commit}` : ""}`
                    : "Not available outside Vercel"}
                </p>
              </div>
            </div>

            {check.error ? (
              <p className="mt-4 rounded border border-red-500/25 bg-red-500/5 px-3 py-2 text-xs text-red-700">
                {check.error}
              </p>
            ) : null}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink-800">Performance Scores</h2>
              <p className="text-xs text-ink-400">
                {check.scores_source ?? "Unavailable for this check"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ScoreCard label="Performance" score={check.performance_score} />
              <ScoreCard label="Accessibility" score={check.accessibility_score} />
              <ScoreCard label="SEO" score={check.seo_score} />
              <ScoreCard label="Best Practices" score={check.best_practices_score} />
            </div>
          </section>

          {history.length > 1 ? (
            <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-ink-800">Recent Checks</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wide text-ink-400">
                      <th className="py-2 pr-4 font-medium">Time</th>
                      <th className="py-2 pr-4 font-medium">Status</th>
                      <th className="py-2 pr-4 font-medium">Response</th>
                      <th className="py-2 pr-4 font-medium">Perf</th>
                      <th className="py-2 font-medium">SEO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} className="border-b border-ink-900/5 last:border-0">
                        <td className="py-2 pr-4 text-ink-500">{formatDateTime(h.checked_at)}</td>
                        <td className="py-2 pr-4">
                          <span className={h.operational ? "text-emerald-600" : "text-red-600"}>
                            {h.operational ? "Operational" : "Attention"}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-ink-700">
                          {h.response_time_ms !== null ? `${h.response_time_ms} ms` : "—"}
                        </td>
                        <td className="py-2 pr-4 text-ink-700">{h.performance_score ?? "—"}</td>
                        <td className="py-2 text-ink-700">{h.seo_score ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
