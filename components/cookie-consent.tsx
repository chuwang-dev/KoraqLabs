"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";
import { trackEvent } from "@/lib/analytics";
import type { SiteContent } from "@/lib/site-content";

export function CookieConsent({ content }: { content: SiteContent["consent"] }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only shown when no choice has been recorded yet.
    setVisible(getConsent() === null);
  }, []);

  if (!visible || pathname.startsWith("/admin")) return null;

  function choose(value: "granted" | "denied") {
    setConsent(value);
    setVisible(false);
    // The initial page_view was skipped (no consent yet) — record it now.
    if (value === "granted") trackEvent("page_view");
  }

  return (
    <div
      role="dialog"
      aria-label={content.dialogLabel}
      className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-xl rounded-lg border border-ink-900/15 bg-paper-white p-4 shadow-xl sm:p-5"
    >
      <p className="text-sm leading-relaxed text-ink-700">
        {content.message}{" "}
        <Link href="/privacy" className="font-medium text-signal-600 underline underline-offset-2">
          {content.privacyLinkLabel}
        </Link>
        .
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="min-h-11 rounded bg-ink-900 px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-700"
        >
          {content.acceptLabel}
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="min-h-11 rounded border border-ink-900/20 px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-900/5"
        >
          {content.declineLabel}
        </button>
      </div>
    </div>
  );
}
