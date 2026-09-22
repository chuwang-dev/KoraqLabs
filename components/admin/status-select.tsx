"use client";

import { useTransition } from "react";

function formatLabel(status: string) {
  return status
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export function StatusSelect({
  id,
  status,
  options,
  action,
}: {
  id: string;
  status: string;
  options: readonly string[];
  /** Server action bound to this row's id: (id, status) => Promise<void> */
  action: (id: string, status: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => {
          action(id, next);
        });
      }}
      className="rounded border border-ink-900/15 bg-paper-white px-2.5 py-1.5 text-xs font-medium text-ink-800 outline-none transition-colors focus:border-signal-500 disabled:opacity-60"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {formatLabel(opt)}
        </option>
      ))}
    </select>
  );
}
