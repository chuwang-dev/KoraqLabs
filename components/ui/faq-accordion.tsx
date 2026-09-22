"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/data";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <div className="divide-y divide-ink-900/[0.09] border-y hairline">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;

        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="text-[18px] leading-snug text-ink-900 [font-family:var(--font-display)]">
                {item.question}
              </span>
              <span
                className={cn(
                  "relative h-4 w-4 shrink-0 transition-transform duration-300 ease-smooth",
                  isOpen && "rotate-45"
                )}
                aria-hidden="true"
              >
                <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-ink-400" />
                <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-ink-400" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={reduced ? undefined : { height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-ink-500">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
