import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminEmail } from "@/lib/auth";
import { logout } from "@/app/admin/actions";
import { AdminNavLinks } from "@/components/admin/sidebar";
import { MobileAdminNav } from "@/components/admin/mobile-admin-nav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already enforces this for every /admin/* request. This is a
  // second, server-component-level check — belt and suspenders, since
  // authorization for a private dashboard shouldn't rely on a single layer.
  const email = await getAdminEmail();
  if (!email) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper-soft font-sans">
      <header className="relative border-b border-ink-900/10 bg-paper-white">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <MobileAdminNav />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400">
                Koraq Labs
              </p>
              <p className="font-display text-lg italic leading-none text-ink-900">Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-500 sm:inline">{email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="rounded border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-900/5"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 border-r border-ink-900/10 bg-paper-white p-4 md:block">
          <AdminNavLinks />
        </aside>
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
