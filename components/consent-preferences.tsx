"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, type ConsentValue } from "@/lib/consent";
import type { SiteContent } from "@/lib/site-content";

export function ConsentPreferences({ content }: { content: SiteContent["consent"] }) {
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
        {content.choicePrefix}{" "}
        <strong>{value === "granted" ? content.choiceAllowed : value === "denied" ? content.choiceDeclined : content.choicePending}</strong>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update("granted")}
          className="min-h-11 rounded bg-ink-900 px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-700"
        >
          {content.allowPreferencesLabel}
        </button>
        <button
          type="button"
          onClick={() => update("denied")}
          className="min-h-11 rounded border border-ink-900/20 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-900/5"
        >
          {content.declinePreferencesLabel}
        </button>
      </div>
    </div>
  );
}
