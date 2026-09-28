import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { getAdminEmail, isTwoFactorEnabled } from "@/lib/auth";
import { generateTotpSecret, otpauthUri } from "@/lib/totp";
import { TwoFactorSetupForm } from "@/components/admin/two-factor-setup-form";

export const metadata: Metadata = { title: "Two-factor authentication — Koraq Labs Admin" };
// A fresh secret per load — must never be cached or pre-rendered.
export const dynamic = "force-dynamic";

export default async function TwoFactorPage() {
  const email = (await getAdminEmail()) ?? "admin";
  const secret = generateTotpSecret();
  const qr = await QRCode.toDataURL(otpauthUri(email, secret), { margin: 1, width: 220 });
  const enabled = isTwoFactorEnabled();

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/admin/settings" className="text-sm text-ink-500 hover:text-ink-900">
        ← Back to settings
      </Link>
      <div>
        <h1 className="font-display text-2xl italic text-ink-900">Two-factor authentication</h1>
        <p className="mt-1 text-sm text-ink-500">
          Status: <strong>{enabled ? "Enabled" : "Not enabled"}</strong>. When enabled, signing in needs your
          password <em>and</em> a 6-digit code from an authenticator app.
        </p>
      </div>

      <ol className="space-y-6">
        <li className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
          <p className="text-sm font-semibold text-ink-800">1. Scan this with your authenticator app</p>
          <div className="mt-3 flex flex-wrap items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Two-factor QR code" width={220} height={220} className="rounded border border-ink-900/10" />
            <div className="min-w-0">
              <p className="text-xs text-ink-500">Can&rsquo;t scan? Enter this key manually:</p>
              <p className="mt-1 break-all rounded bg-ink-900/5 px-3 py-2 font-mono text-sm text-ink-900">{secret}</p>
              <p className="mt-2 text-xs text-ink-400">
                This key is shown once and generated fresh on every visit. Reloading gives you a new one.
              </p>
            </div>
          </div>
        </li>

        <li className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
          <p className="text-sm font-semibold text-ink-800">2. Confirm it works</p>
          <p className="mt-1 text-xs text-ink-500">Enter the current code so we know you set it up correctly.</p>
          <TwoFactorSetupForm secret={secret} />
        </li>

        <li className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
          <p className="text-sm font-semibold text-ink-800">3. Turn it on</p>
          <p className="mt-1 text-sm text-ink-600">
            Add this to your deployment&rsquo;s environment variables (never commit it), then redeploy:
          </p>
          <p className="mt-2 break-all rounded bg-ink-900/5 px-3 py-2 font-mono text-xs text-ink-900">
            ADMIN_TOTP_SECRET={secret}
          </p>
          <p className="mt-3 rounded border border-amber-500/25 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-800">
            <strong>Lost your phone?</strong> Remove <code className="font-mono">ADMIN_TOTP_SECRET</code> from
            the environment and redeploy — login falls back to password-only, so you can set 2FA up again. Keep
            access to your hosting dashboard.
          </p>
        </li>
      </ol>
    </div>
  );
}
