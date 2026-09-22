import type { Metadata } from "next";
import { getAdminEmail } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = { title: "Settings — Koraq Labs Admin" };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="max-w-[60%] truncate text-right text-sm font-medium text-ink-900">{value}</p>
    </div>
  );
}

export default async function SettingsPage() {
  const email = await getAdminEmail();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">
          Configuration is environment-driven — nothing here is editable from the UI, by design, so
          no secret ever touches the database or the browser.
        </p>
      </div>

      <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink-800">Account</h2>
        <div className="divide-y divide-ink-900/5">
          <Row label="Signed in as" value={email ?? "—"} />
          <Row label="Session length" value="8 hours" />
        </div>
        <div className="mt-4 rounded border border-amber-500/25 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-800">
          To change the admin password: generate a new bcrypt hash locally (
          <code className="font-mono">node scripts/hash-password.js &quot;new-password&quot;</code>), then
          update <code className="font-mono">ADMIN_PASSWORD_HASH</code> in your deployment&rsquo;s
          environment variables and redeploy. This keeps the password out of the database and the UI
          entirely.
        </div>
      </section>

      <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink-800">Website</h2>
        <div className="divide-y divide-ink-900/5">
          <Row label="Site name" value={siteConfig.name} />
          <Row label="Website URL" value={siteConfig.url} />
          <Row label="WhatsApp number" value={siteConfig.whatsappDisplay} />
          <Row label="Contact email" value={siteConfig.email} />
        </div>
      </section>

      <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink-800">Analytics</h2>
        <div className="divide-y divide-ink-900/5">
          <Row label="Database-backed events" value={isDatabaseConfigured() ? "Connected" : "Not configured"} />
          <Row label="Google Analytics 4" value={gaId ? "Connected" : "Not configured"} />
        </div>
      </section>

      <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink-800">Notifications</h2>
        <p className="mt-2 text-sm text-ink-500">
          Email notifications for new leads use the same <code className="font-mono text-xs">EMAIL_API_KEY</code>{" "}
          configuration as the contact form. There&rsquo;s no separate toggle yet — every successful
          submission sends one.
        </p>
      </section>
    </div>
  );
}
