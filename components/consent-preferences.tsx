"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, type ConsentValue } from "@/lib/consent";

export function ConsentPreferences() {
  const [value, setValue] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setValue(getConsent());
  }, []);

  function update(next: ConsentValue) {
    setConsent(next);
    setValue(next);
  }

  return (
    <div className="mt-4 rounded-lg border border-ink-900/10 bg-paper-white p-5">
      <p className="text-sm text-ink-700">
        Current choice:{" "}
        <strong>{value === "granted" ? "Analytics allowed" : value === "denied" ? "Analytics declined" : "Not chosen yet"}</strong>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update("granted")}
          className="rounded bg-ink-900 px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-700"
        >
          Allow analytics
        </button>
        <button
          type="button"
          onClick={() => update("denied")}
          className="rounded border border-ink-900/20 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-900/5"
        >
          Decline analytics
        </button>
      </div>
    </div>
  );
}
