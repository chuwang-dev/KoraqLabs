"use client";

import { useTransition } from "react";

export function ToggleSwitch({
  id,
  checked,
  label,
  action,
}: {
  id: string;
  checked: boolean;
  label: string;
  /** Server action bound to this row's id: (id, next) => Promise<void> */
  action: (id: string, next: boolean) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-ink-600">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={isPending}
        onClick={() => startTransition(() => action(id, !checked))}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-60 ${
          checked ? "bg-signal-500" : "bg-ink-900/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
      {label}
    </label>
  );
}
