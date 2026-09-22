"use client";

import { motion, useReducedMotion } from "framer-motion";

// An abstract composition of product surfaces — a dashboard panel, a mobile
// enquiry view, and a deploy log. Built entirely from markup rather than
// stock imagery so it stays sharp at any size and costs nothing to load.

const ease = [0.16, 1, 0.3, 1] as const;

function Bar({ w, dark }: { w: string; dark?: boolean }) {
  return (
    <div
      className={`h-1.5 rounded-full ${dark ? "bg-white/15" : "bg-ink-900/[0.09]"}`}
      style={{ width: w }}
    />
  );
}

export function InterfaceComposition() {
  const reduced = useReducedMotion();

  const float = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        };

  return (
    <div className="relative select-none" aria-hidden="true">
      {/* Main dashboard surface */}
      <motion.div
        {...float(0.05)}
        className="overflow-hidden rounded-lg border border-ink-900/10 bg-white shadow-[0_24px_60px_-28px_rgba(12,13,15,0.28)]"
      >
        <div className="flex items-center gap-2 border-b border-ink-900/[0.07] px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-ink-900/12" />
          <span className="h-2 w-2 rounded-full bg-ink-900/12" />
          <span className="h-2 w-2 rounded-full bg-ink-900/12" />
          <div className="ml-3 h-5 flex-1 rounded border border-ink-900/[0.07] bg-paper-soft" />
        </div>

        <div className="grid grid-cols-[92px_1fr]">
          <div className="space-y-2.5 border-r border-ink-900/[0.07] p-4">
            <div className="h-1.5 w-10 rounded-full bg-brand-wing" />
            <Bar w="70%" />
            <Bar w="55%" />
            <Bar w="62%" />
            <Bar w="45%" />
          </div>

          <div className="space-y-4 p-5">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <Bar w="80px" />
                <div className="font-display text-2xl text-ink-900">₦1.2m</div>
              </div>
              <div className="rounded-full bg-signal-50 px-2.5 py-1 font-mono text-[10px] text-signal-600">
                LIVE
              </div>
            </div>

            {/* Sparkline-style chart */}
            <div className="flex h-16 items-end gap-1.5">
              {[38, 52, 44, 66, 58, 78, 70, 92, 84, 100].map((h, i) => (
                <motion.div
                  key={i}
                  className={`flex-1 rounded-sm ${i > 6 ? "bg-brand-wing" : "bg-ink-900/[0.1]"}`}
                  initial={reduced ? undefined : { height: 0 }}
                  animate={reduced ? undefined : { height: `${h}%` }}
                  transition={{ duration: 0.6, delay: 0.35 + i * 0.045, ease }}
                  style={reduced ? { height: `${h}%` } : undefined}
                />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-1.5 rounded border border-ink-900/[0.07] p-2.5">
                  <Bar w="60%" />
                  <Bar w="85%" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile enquiry surface */}
      <motion.div
        {...float(0.22)}
        className="absolute -bottom-10 -left-8 w-[142px] overflow-hidden rounded-md border border-ink-900/10 bg-white shadow-[0_18px_44px_-20px_rgba(12,13,15,0.35)]"
      >
        <div className="border-b border-ink-900/[0.07] px-3 py-2">
          <div className="mx-auto h-1 w-8 rounded-full bg-ink-900/15" />
        </div>
        <div className="space-y-2.5 p-3">
          <Bar w="55%" />
          <div className="h-6 rounded border border-ink-900/[0.07] bg-paper-soft" />
          <div className="h-6 rounded border border-ink-900/[0.07] bg-paper-soft" />
          <div className="flex h-7 items-center justify-center rounded bg-brand-wing">
            <div className="h-1.5 w-14 rounded-full bg-white/70" />
          </div>
        </div>
      </motion.div>

      {/* Deploy log surface */}
      <motion.div
        {...float(0.36)}
        className="absolute -right-6 -top-8 w-[186px] overflow-hidden rounded-md border border-white/10 bg-ink-900 p-3.5 shadow-[0_18px_44px_-20px_rgba(12,13,15,0.5)]"
      >
        <div className="mb-2.5 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-400" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/45">
            deploy
          </span>
        </div>
        <div className="space-y-2">
          <Bar w="88%" dark />
          <Bar w="64%" dark />
          <Bar w="76%" dark />
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="font-mono text-[9px] text-signal-400">✓ ready</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
