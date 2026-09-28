import type { Metadata } from "next";
import Link from "next/link";
import { getAdminEmail, isTwoFactorEnabled } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-settings";
import { revokeAllSessions } from "@/app/admin/actions";
import { updateSiteSettings } from "./actions";

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
  const { settings, usingDemoData } = await getSiteSettings();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">
          Edit the public website details and social links here. Authentication secrets remain in
          deployment environment variables and are never stored in the database.
        </p>
      </div>

      <section className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
        <h2 className="mb-1 text-sm font-semibold text-ink-800">Account</h2>
        <div className="divide-y divide-ink-900/5">
          <Row label="Signed in as" value={email ?? "—"} />
          <Row label="Session length" value="8 hours" />
          <Row label="Two-factor authentication" value={isTwoFactorEnabled() ? "Enabled" : "Not enabled"} />
        </div>
        <div className="mt-4 rounded border border-amber-500/25 bg-amber-500/5 p-4 text-xs leading-relaxed text-amber-800">
          To change the admin password: generate a new bcrypt hash locally (
          <code className="font-mono">node scripts/hash-password.js &quot;new-password&quot;</code>), then
          update <code className="font-mono">ADMIN_PASSWORD_HASH</code> in your deployment&rsquo;s
          environment variables and redeploy. This keeps the password out of the database and the UI
          entirely.
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded border border-ink-900/10 p-4">
          <div>
            <p className="text-sm font-medium text-ink-800">Two-factor authentication</p>
            <p className="mt-0.5 text-xs text-ink-500">Require an authenticator code at sign-in.</p>
          </div>
          <Link href="/admin/settings/two-factor" className="rounded border border-ink-900/15 px-3 py-2 text-xs font-medium text-ink-700 hover:bg-ink-900/5">
            {isTwoFactorEnabled() ? "Manage" : "Set up"}
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded border border-ink-900/10 p-4">
          <div>
            <p className="text-sm font-medium text-ink-800">Log out everywhere</p>
            <p className="mt-0.5 text-xs text-ink-500">
              {isDatabaseConfigured() ? "Revoke every active admin session." : "Requires DATABASE_URL."}
            </p>
          </div>
          {isDatabaseConfigured() ? (
            <form action={revokeAllSessions}>
              <button type="submit" className="rounded border border-red-500/30 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-500/5">
                Revoke all sessions
              </button>
            </form>
          ) : null}
        </div>
      </section>

      {!isDatabaseConfigured() ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 bg-paper-white p-5 text-sm text-ink-500">
          Connect <code className="font-mono text-xs">DATABASE_URL</code> and apply <code className="font-mono text-xs">db/schema.sql</code> to edit public website content here.
        </div>
      ) : null}

      <form action={updateSiteSettings} className="space-y-6">
        <details className="rounded-lg border border-ink-900/10 bg-paper-white p-5" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink-800">
            <span>Website</span>
            <span className="rounded border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700">Edit</span>
          </summary>
          <p className="mt-1 text-sm text-ink-500">Edit the details used across the public site.</p>
          {usingDemoData ? <span className="mt-3 inline-block rounded border border-amber-500/25 px-2 py-1 text-xs text-amber-700">Preview only</span> : null}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-ink-600">Site name<input name="name" defaultValue={settings.name} required className="admin-input mt-1" /></label>
            <label className="text-sm text-ink-600">Website URL<input name="url" type="url" defaultValue={settings.url} required className="admin-input mt-1" /></label>
            <label className="text-sm text-ink-600">Contact email<input name="email" type="email" defaultValue={settings.email} required className="admin-input mt-1" /></label>
            <label className="text-sm text-ink-600">WhatsApp number<input name="whatsappNumber" defaultValue={settings.whatsappNumber} required className="admin-input mt-1" /></label>
            <label className="text-sm text-ink-600">WhatsApp display number<input name="whatsappDisplay" defaultValue={settings.whatsappDisplay} className="admin-input mt-1" /></label>
            <label className="text-sm text-ink-600">Tagline<input name="tagline" defaultValue={settings.tagline} className="admin-input mt-1" /></label>
            <label className="text-sm text-ink-600 sm:col-span-2">Description<textarea name="description" defaultValue={settings.description} rows={3} className="admin-input mt-1" /></label>
          </div>
        </details>

        <details className="rounded-lg border border-ink-900/10 bg-paper-white p-5" open>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink-800">
            <span>Social Pages</span>
            <span className="rounded border border-ink-900/15 px-3 py-1.5 text-xs font-medium text-ink-700">Edit</span>
          </summary>
          <p className="mt-1 text-sm text-ink-500">These links are shown in the public site footer.</p>
          <div className="mt-4 space-y-3">
            {settings.socialLinks.map((social) => (
              <div key={social.label} className="grid gap-3 sm:grid-cols-[minmax(120px,0.35fr)_1fr]">
                <input name="socialLabel" defaultValue={social.label} aria-label={`${social.label} label`} className="admin-input" />
                <input name="socialHref" type="url" defaultValue={social.href} aria-label={`${social.label} URL`} className="admin-input" />
              </div>
            ))}
          </div>
        </details>

        <button type="submit" disabled={usingDemoData} className="w-full rounded bg-ink-900 px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">
          Save website and social changes
        </button>
      </form>

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
