"use client";

import Link from "next/link";
import { BrowserMockup } from "@/components/browser-mockup";
import { IconArrowUpRight } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";
import type { PortfolioItem } from "@/lib/data";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <div className="flex flex-col rounded-md border border-ink-900/10 bg-paper p-6">
      <BrowserMockup label={item.category} image={item.image} />
      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-signal-600">
            {item.category} · {item.isPlaceholder ? "Demo project" : "Live project"}
          </p>
          <h3 className="mt-1.5 font-display text-lg text-ink-900">{item.name}</h3>
        </div>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
        {item.description}
      </p>
      <p className="mt-4 text-[13px] text-ink-400">
        {item.technologies.join(" · ")}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href={`/work/${item.slug}`}
          onClick={() => trackEvent("portfolio_click", { project: item.slug })}
          className="inline-flex items-center gap-1 text-[14px] font-medium text-ink-900 hover:text-signal-600"
        >
          View Project
          <IconArrowUpRight className="h-3.5 w-3.5" />
        </Link>
        {item.liveUrl ? (
          <a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("portfolio_click", { project: item.slug })}
            className="text-[14px] font-medium text-signal-600 hover:text-signal-800"
          >
            Visit Live Site
          </a>
        ) : null}
      </div>
    </div>
  );
}
