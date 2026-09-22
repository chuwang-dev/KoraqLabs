"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconMenu, IconClose } from "@/components/icons";
import { primaryNav, siteConfig, whatsappLink } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

export function MobileMenu() {
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
        className="flex h-10 w-10 items-center justify-center rounded text-ink-900"
      >
        {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-[68px] bottom-0 z-40 overflow-y-auto bg-paper">
          <nav className="container-page flex min-h-full flex-col justify-between gap-8 py-6 sm:py-8">
            <ul className="flex flex-col gap-1">
              {primaryNav.map((item) => (
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
                href="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded bg-ink-900 px-5 py-3 text-[15px] font-medium text-paper"
              >
                Start a Project
              </Link>
              <a
                href={whatsappLink("Hi Koraq Labs, I'd like to talk about a website.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click")}
                className="inline-flex items-center justify-center rounded border border-ink-900/15 px-5 py-3 text-[15px] font-medium text-ink-900"
              >
                WhatsApp {siteConfig.whatsappDisplay}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
