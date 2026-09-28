"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DATE_RANGE_PRESETS } from "@/lib/date-range";

export function DateRangeSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("range") ?? "last30";
  const [showCustom, setShowCustom] = useState(current === "custom");
  const [from, setFrom] = useState(searchParams.get("from") ?? "");
  const [to, setTo] = useState(searchParams.get("to") ?? "");

  function applyPreset(value: string) {
    if (value === "custom") {
      setShowCustom(true);
      return;
    }
    setShowCustom(false);
    router.push(`/admin/dashboard?range=${value}`);
  }

  function applyCustom() {
    if (!from || !to) return;
    router.push(`/admin/dashboard?range=custom&from=${from}&to=${to}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={current}
        onChange={(e) => applyPreset(e.target.value)}
        className="rounded border border-ink-900/15 bg-paper-white px-3 py-2 text-sm font-medium text-ink-800 outline-none transition-colors focus:border-signal-500"
      >
        {DATE_RANGE_PRESETS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {showCustom ? (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded border border-ink-900/15 bg-paper-white px-2.5 py-2 text-sm text-ink-800 outline-none focus:border-signal-500"
          />
          <span className="text-xs text-ink-400">to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded border border-ink-900/15 bg-paper-white px-2.5 py-2 text-sm text-ink-800 outline-none focus:border-signal-500"
          />
          <button
            type="button"
            onClick={applyCustom}
            disabled={!from || !to}
            className="rounded bg-ink-900 px-3 py-2 text-xs font-medium text-paper transition-colors hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      ) : null}
    </div>
  );
}
