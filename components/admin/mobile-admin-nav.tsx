"use client";

import { useState } from "react";
import { AdminNavLinks } from "@/components/admin/sidebar";

export function MobileAdminNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Toggle admin menu"
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded border border-ink-900/15"
      >
        <span className={`h-[1.5px] w-[18px] bg-ink-900 transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
        <span className={`h-[1.5px] w-[18px] bg-ink-900 transition-opacity ${open ? "opacity-0" : ""}`} />
        <span className={`h-[1.5px] w-[18px] bg-ink-900 transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
      </button>
      {open ? (
        <div className="absolute inset-x-0 top-full z-40 border-b border-ink-900/10 bg-paper-white px-6 py-4 shadow-lg">
          <AdminNavLinks onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
