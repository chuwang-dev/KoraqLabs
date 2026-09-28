"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { logActivity } from "@/lib/admin-data";
import { runHealthCheck, getLatestHealthCheck } from "@/lib/health";
import { sendAdminAlert } from "@/lib/mailer";
import { siteConfig } from "@/lib/config";

const COOLDOWN_MS = 60 * 1000; // 1 minute

export async function checkNow(): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;

  // A stray double-click or someone mashing the button shouldn't burn
  // through the PageSpeed Insights quota — the button has no client-side
  // debounce of its own (it's a plain form action), so the guard lives
  // here instead.
  const latest = await getLatestHealthCheck();
  if (latest && Date.now() - new Date(latest.checked_at).getTime() < COOLDOWN_MS) {
    return;
  }

  const result = await runHealthCheck();
  await logActivity(
    email,
    "website_health_check",
    result.operational ? "Operational" : `Attention required${result.error ? `: ${result.error}` : ""}`
  );

  if (!result.operational) {
    // Best-effort — a failed alert email should never mask the health
    // check result itself.
    sendAdminAlert(
      `⚠️ ${siteConfig.name} may be down`,
      [
        `A website health check just came back "Attention Required".`,
        "",
        `URL: ${result.checked_url}`,
        `Status code: ${result.status_code ?? "no response"}`,
        `Response time: ${result.response_time_ms ?? "—"} ms`,
        result.error ? `Error: ${result.error}` : null,
        "",
        "Check /admin/website for details.",
      ]
        .filter(Boolean)
        .join("\n")
    ).catch(() => {});
  }

  revalidatePath("/admin/website");
  revalidatePath("/admin/dashboard");
}
