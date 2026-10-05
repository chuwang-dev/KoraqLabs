"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkTwoFactorCode,
  claimTotpCounter,
  clearPendingTwoFactor,
  createSession,
  getPendingTwoFactorEmail,
  isAdminLoginConfigured,
  isTwoFactorEnabled,
  setPendingTwoFactor,
  verifyAdminCredentials,
} from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { logActivity } from "@/lib/admin-data";

export type LoginState = {
  status: "idle" | "error" | "needs_code" | "expired";
  message?: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Only ever redirect to a path inside /admin — never to a URL supplied by the form. */
function safeRedirect(value: string): string {
  return value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin/dashboard";
}

async function clientIp() {
  const headerList = await headers();
  return headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function tooManyAttempts(retryAfterSeconds: number): LoginState {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return {
    status: "error",
    message: `Too many attempts. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
  };
}

/** Step 1: email + password. Continues to step 2 if two-factor is enabled. */
export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  if (!(await isAdminLoginConfigured())) {
    return {
      status: "error",
      message:
        "Admin sign-in is not configured here yet. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH, and a 16-character-or-longer AUTH_SECRET, then restart the server.",
    };
  }

  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const redirectTo = safeRedirect(getString(formData, "redirectTo"));
  const ip = await clientIp();

  const { allowed, retryAfterSeconds } = await checkRateLimit(ip, email);
  if (!allowed) return tooManyAttempts(retryAfterSeconds);

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const valid = await verifyAdminCredentials(email, password);
  if (!valid) {
    await logActivity(email || "unknown", "login_failed", `From IP ${ip}`);
    return { status: "error", message: "Invalid email or password." };
  }

  if (isTwoFactorEnabled()) {
    await setPendingTwoFactor(email);
    return { status: "needs_code" };
  }

  await resetRateLimit(ip, email);
  await createSession(email);
  await logActivity(email, "login");
  redirect(redirectTo);
}

/** Step 2: the 6-digit authenticator code. */
export async function verifyTwoFactor(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const code = getString(formData, "code").replace(/\s+/g, "");
  const redirectTo = safeRedirect(getString(formData, "redirectTo"));
  const ip = await clientIp();

  const email = await getPendingTwoFactorEmail();
  if (!email) {
    return { status: "expired", message: "Your sign-in timed out. Enter your password again." };
  }

  const { allowed, retryAfterSeconds } = await checkRateLimit(ip, email);
  if (!allowed) return tooManyAttempts(retryAfterSeconds);

  const counter = checkTwoFactorCode(code);
  if (counter === null) {
    await logActivity(email, "login_failed", `Invalid 2FA code from IP ${ip}`);
    return { status: "error", message: "That code isn't right. Check your authenticator app and try again." };
  }

  if (!(await claimTotpCounter(email, counter))) {
    return { status: "error", message: "That code was already used. Wait for the next one and try again." };
  }

  await clearPendingTwoFactor();
  await resetRateLimit(ip, email);
  await createSession(email);
  await logActivity(email, "login", "With two-factor code");
  redirect(redirectTo);
}
