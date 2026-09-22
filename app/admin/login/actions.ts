"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, verifyAdminCredentials } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { logActivity } from "@/lib/admin-data";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const redirectTo = getString(formData, "redirectTo") || "/admin/dashboard";

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rateLimitKey = `${ip}:${email.toLowerCase()}`;

  const { allowed, retryAfterSeconds } = checkRateLimit(rateLimitKey);
  if (!allowed) {
    const minutes = Math.ceil(retryAfterSeconds / 60);
    return {
      status: "error",
      message: `Too many attempts. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  if (!email || !password) {
    return { status: "error", message: "Enter your email and password." };
  }

  const valid = await verifyAdminCredentials(email, password);
  if (!valid) {
    return { status: "error", message: "Invalid email or password." };
  }

  resetRateLimit(rateLimitKey);
  await createSession(email);
  await logActivity(email, "login");

  redirect(redirectTo);
}
