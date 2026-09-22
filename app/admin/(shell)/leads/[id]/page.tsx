import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLeadById, LEAD_STATUSES } from "@/lib/admin-data";
import { StatusSelect } from "@/components/admin/status-select";
import { changeLeadStatus } from "../actions";

export const metadata: Metadata = { title: "Lead — Koraq Labs Admin" };

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-1 text-sm text-ink-800">{value}</p>
    </div>
  );
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLeadById(id);
  if (!lead) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/leads" className="text-sm text-ink-500 hover:text-ink-900">
        ← Back to leads
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl italic text-ink-900">{lead.business_name}</h1>
          <p className="mt-1 text-sm text-ink-500">{lead.name}</p>
        </div>
        <StatusSelect id={lead.id} status={lead.status} options={LEAD_STATUSES} action={changeLeadStatus} />
      </div>

      <div className="grid grid-cols-1 gap-5 rounded-lg border border-ink-900/10 bg-paper-white p-6 sm:grid-cols-2">
        <Field label="Email" value={lead.email} />
        <Field label="Phone" value={lead.phone} />
        <Field label="Business Type" value={lead.business_type ?? "—"} />
        <Field label="Service Requested" value={lead.need ?? "—"} />
        <Field label="Current Website" value={lead.current_website ?? "None"} />
        <Field label="Budget" value={lead.budget ?? "—"} />
        <Field label="Date Submitted" value={formatDateTime(lead.created_at)} />
        <Field label="Source" value={lead.source ?? "Direct"} />
        <Field label="Landing Page" value={lead.landing_page ?? "—"} />
        <Field label="Device" value={lead.device ?? "—"} />
      </div>

      <div className="rounded-lg border border-ink-900/10 bg-paper-white p-6">
        <p className="eyebrow mb-2">Project Description</p>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
          {lead.description || "No additional details provided."}
        </p>
      </div>
    </div>
  );
}
