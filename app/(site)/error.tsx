"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section-pad">
      <div className="container-page max-w-xl">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-5 text-display-md [font-family:var(--font-display)]">
          We hit an unexpected error.
        </h1>
        <p className="mt-5 text-[16px] leading-relaxed text-ink-500">
          Try again — if it keeps happening, message us on WhatsApp and
          we&apos;ll sort it out.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-9 inline-flex items-center rounded bg-ink-900 px-5 py-3 text-[15px] font-medium text-paper hover:bg-ink-700"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
