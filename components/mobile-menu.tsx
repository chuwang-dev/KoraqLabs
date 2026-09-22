"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconMenu, IconClose, IconWhatsapp } from "@/components/ui/icons";
import { primaryNav, siteConfig, whatsappLink } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded text-ink-900"
      >
        {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-[68px] z-40 bg-paper"
          >
            <nav className="container-page flex h-full flex-col justify-between py-10">
              <ul className="flex flex-col">
                {primaryNav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={reduced ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.04 * i }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b hairline py-5 text-[28px] text-ink-900 [font-family:var(--font-display)]"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col gap-3">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded bg-ink-900 px-5 py-3.5 text-[15px] font-medium text-paper"
                >
                  Start a Project
                </Link>
                <a
                  href={whatsappLink("Hi Koraq Labs, I'd like to talk about a project.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_click")}
                  className="inline-flex items-center justify-center gap-2 rounded border border-ink-900/15 px-5 py-3.5 text-[15px] font-medium text-ink-900"
                >
                  <IconWhatsapp className="h-4 w-4 text-signal-500" />
                  WhatsApp {siteConfig.whatsappDisplay}
                </a>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
