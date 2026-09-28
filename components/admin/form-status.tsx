"use client";

import { useFormStatus } from "react-dom";
import type { SaveFormState } from "@/lib/admin-form-state";

export function SaveButton({ label, savingLabel }: { label: string; savingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-fit items-center gap-2 rounded bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-paper/30 border-t-paper" />
          {savingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

export function FormStatusBanner({ state }: { state: SaveFormState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p
      role={state.status === "error" ? "alert" : "status"}
      className={`rounded px-3 py-2 text-xs sm:col-span-2 ${
        state.status === "error"
          ? "border border-red-500/25 bg-red-500/5 text-red-700"
          : "border border-emerald-500/25 bg-emerald-500/5 text-emerald-700"
      }`}
    >
      {state.message}
    </p>
  );
}
