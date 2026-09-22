import type { Metadata } from "next";
import Link from "next/link";
import { getLeads, LEAD_STATUSES } from "@/lib/admin-data";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { StatusSelect } from "@/components/admin/status-select";
import { changeLeadStatus } from "./actions";

export const metadata: Metadata = { title: "Leads — Koraq Labs Admin" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function LeadsPage() {
  const { leads, usingDemoData } = await getLeads();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl italic text-ink-900">Leads</h1>
          <p className="mt-1 text-sm text-ink-500">
            {leads.length} inquir{leads.length === 1 ? "y" : "ies"}
          </p>
        </div>
        {usingDemoData ? <DemoDataBadge /> : null}
      </div>

      {leads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-400">
          No leads yet. They&rsquo;ll show up here as soon as someone submits the contact form.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ink-900/10 bg-paper-white">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Budget</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-ink-900/5 last:border-0 hover:bg-ink-900/[0.02]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-medium text-ink-900 hover:text-signal-600 hover:underline"
                    >
                      {lead.business_name}
                    </Link>
                    <p className="text-xs text-ink-400">{lead.name}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-600">
                    <p>{lead.email}</p>
                    <p className="text-xs text-ink-400">{lead.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{lead.need ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-600">{lead.budget ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-500">{formatDate(lead.created_at)}</td>
                  <td className="px-4 py-3">
                    <StatusSelect
                      id={lead.id}
                      status={lead.status}
                      options={LEAD_STATUSES}
                      action={changeLeadStatus}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
