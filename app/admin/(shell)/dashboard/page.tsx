import type { Metadata } from "next";
import { Suspense } from "react";
import { getDashboardOverview, getLeads } from "@/lib/admin-data";
import { getAdminEmail } from "@/lib/auth";
import { MetricCard } from "@/components/admin/metric-card";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { DateRangeSelect } from "@/components/admin/date-range-select";
import { TrafficChart } from "@/components/admin/traffic-chart";
import { StatusPill } from "@/components/admin/status-pill";

export const metadata: Metadata = { title: "Dashboard — Koraq Labs Admin" };

function nairaBudget(budget: string | null) {
  return budget ?? "—";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = Number(params.days ?? 30) || 30;

  const [overview, adminEmail, { leads }] = await Promise.all([
    getDashboardOverview(days),
    getAdminEmail(),
    getLeads(),
  ]);

  const recentLeads = leads.slice(0, 5);
  const firstName = adminEmail?.split("@")[0] ?? "Admin";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-ink-500">
            Good to see you, <span className="capitalize">{firstName}</span>
          </p>
          <h1 className="mt-1 font-display text-2xl italic text-ink-900">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          {overview.usingDemoData ? <DemoDataBadge /> : null}
          <Suspense fallback={null}>
            <DateRangeSelect />
          </Suspense>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard label="Visitors" value={overview.visitors.toLocaleString()} />
        <MetricCard label="Page Views" value={overview.pageViews.toLocaleString()} />
        <MetricCard label="Leads" value={overview.leads.toLocaleString()} />
        <MetricCard label="Conversion Rate" value={`${overview.conversionRate}%`} />
        <MetricCard label="WhatsApp Clicks" value={overview.whatsappClicks.toLocaleString()} />
        <MetricCard label="Project Requests" value={overview.projectRequests.toLocaleString()} />
      </div>

      <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink-800">Traffic</h2>
        <TrafficChart series={overview.trafficSeries} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-800">Traffic Sources</h2>
          {overview.trafficSources.length === 0 ? (
            <p className="text-sm text-ink-400">No source data yet.</p>
          ) : (
            <ul className="space-y-3">
              {overview.trafficSources.map((s) => (
                <li key={s.source}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-800">{s.source}</span>
                    <span className="text-ink-500">
                      {s.visitors.toLocaleString()} · {s.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/5">
                    <div
                      className="h-full rounded-full bg-signal-500"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink-800">Top Pages</h2>
          {overview.topPages.length === 0 ? (
            <p className="text-sm text-ink-400">No page data yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="pb-2 font-medium">Page</th>
                  <th className="pb-2 text-right font-medium">Views</th>
                  <th className="pb-2 text-right font-medium">Visitors</th>
                </tr>
              </thead>
              <tbody>
                {overview.topPages.map((p) => (
                  <tr key={p.page} className="border-b border-ink-900/5 last:border-0">
                    <td className="py-2 font-mono text-[13px] text-ink-800">{p.page}</td>
                    <td className="py-2 text-right text-ink-700">{p.views.toLocaleString()}</td>
                    <td className="py-2 text-right text-ink-500">{p.visitors.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-800">Recent Leads</h2>
          <a href="/admin/leads" className="text-xs font-medium text-signal-600 hover:underline">
            View all →
          </a>
        </div>
        {recentLeads.length === 0 ? (
          <p className="text-sm text-ink-400">No leads yet.</p>
        ) : (
          <ul className="divide-y divide-ink-900/5">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-ink-900">{lead.business_name}</p>
                  <p className="text-xs text-ink-400">{nairaBudget(lead.budget)}</p>
                </div>
                <StatusPill status={lead.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
