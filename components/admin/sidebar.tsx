"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "FAQs", href: "/admin/faqs" },
  { label: "Activity", href: "/admin/activity" },
  { label: "Settings", href: "/admin/settings" },
];

export function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-ink-900 text-paper"
                : "text-ink-600 hover:bg-ink-900/5 hover:text-ink-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
