"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { label: "Today", value: 1 },
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
];

export function DateRangeSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = Number(searchParams.get("days") ?? 30);

  return (
    <select
      value={current}
      onChange={(e) => router.push(`/admin/dashboard?days=${e.target.value}`)}
      className="rounded border border-ink-900/15 bg-paper-white px-3 py-2 text-sm font-medium text-ink-800 outline-none transition-colors focus:border-signal-500"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
