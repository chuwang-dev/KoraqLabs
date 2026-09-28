import type { Metadata } from "next";
import { getActivity } from "@/lib/admin-data";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { Pagination } from "@/components/admin/pagination";

export const metadata: Metadata = { title: "Activity — Koraq Labs Admin" };

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ACTION_LABELS: Record<string, string> = {
  login: "Logged in",
  login_failed: "Failed login attempt",
  logout: "Logged out",
  sessions_revoked_all: "Revoked all sessions",
  lead_status_change: "Lead status changed",
  project_created: "Project created",
  project_updated: "Project updated",
  project_deleted: "Project deleted",
  testimonial_created: "Testimonial added",
  testimonial_updated: "Testimonial updated",
  testimonial_published: "Testimonial published",
  testimonial_unpublished: "Testimonial unpublished",
  testimonial_deleted: "Testimonial deleted",
  faq_created: "FAQ added",
  faq_updated: "FAQ updated",
  faq_published: "FAQ published",
  faq_unpublished: "FAQ hidden",
  faq_deleted: "FAQ deleted",
  website_health_check: "Website health check run",
  two_factor_setup_verified: "Two-factor setup verified",
  image_uploaded: "Image uploaded",
  leads_exported: "Leads exported to CSV",
  settings_updated: "Settings updated",
};

const SENSITIVE_ACTIONS = new Set(["login_failed"]);

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const { activity, usingDemoData, page, pageCount } = await getActivity({ page: Number(params.page) || 1 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl italic text-ink-900">Activity</h1>
          <p className="mt-1 text-sm text-ink-500">A log of administrator actions.</p>
        </div>
        {usingDemoData ? <DemoDataBadge /> : null}
      </div>

      {activity.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-400">
          No activity recorded yet.
        </div>
      ) : (
        <ul className="divide-y divide-ink-900/5 rounded-lg border border-ink-900/10 bg-paper-white">
          {activity.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-4 px-5 py-3.5 text-sm">
              <div>
                <p className={`font-medium ${SENSITIVE_ACTIONS.has(a.action) ? "text-red-600" : "text-ink-800"}`}>
                  {ACTION_LABELS[a.action] ?? a.action}
                </p>
                {a.detail ? <p className="mt-0.5 text-xs text-ink-500">{a.detail}</p> : null}
              </div>
              <p className="shrink-0 whitespace-nowrap text-xs text-ink-400">{formatDateTime(a.created_at)}</p>
            </li>
          ))}
        </ul>
      )}

      <Pagination basePath="/admin/activity" page={page} pageCount={pageCount} />
    </div>
  );
}
