import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Admin Login — Koraq Labs",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.from && params.from.startsWith("/admin") ? params.from : "/admin/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-6 py-12">
      <div className="grid-bg-dark absolute inset-0 opacity-40" aria-hidden />
      <div className="relative w-full max-w-sm rounded-lg border border-white/10 bg-paper p-8 shadow-2xl">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">
            Koraq Labs
          </p>
          <h1 className="mt-1.5 font-display text-2xl italic text-ink-900">Admin</h1>
          <p className="mt-2 text-sm text-ink-500">
            Sign in to view traffic, leads, and site activity.
          </p>
        </div>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
