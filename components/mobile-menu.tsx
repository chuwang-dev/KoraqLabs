"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconMenu, IconClose } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";
import type { SiteContent } from "@/lib/site-content";

export function MobileMenu({
  primaryLinks,
  primaryCtaLabel,
  primaryCtaHref,
  whatsappLabel,
  whatsappMessage,
  whatsappNumber,
  whatsappDisplay,
}: {
  primaryLinks: SiteContent["navigation"]["primary"];
  primaryCtaLabel: string;
  primaryCtaHref: string;
  whatsappLabel: string;
  whatsappMessage: string;
  whatsappNumber: string;
  whatsappDisplay: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded text-ink-900"
      >
        {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto bg-paper">
          <nav className="container-page flex min-h-full flex-col justify-between gap-8 py-6 sm:py-8">
            <ul className="flex flex-col gap-1">
              {primaryLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-ink-900/10 py-3.5 font-display text-2xl text-ink-900 sm:py-4"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3">
              <Link
                href={primaryCtaHref}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded bg-ink-900 px-5 py-3 text-[15px] font-medium text-paper"
              >
                {primaryCtaLabel}
              </Link>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click")}
                className="inline-flex items-center justify-center rounded border border-ink-900/15 px-5 py-3 text-[15px] font-medium text-ink-900"
              >
                {whatsappLabel} {whatsappDisplay}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
