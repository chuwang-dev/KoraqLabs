"use server";

import { getAdminEmail } from "@/lib/auth";
import { logActivity } from "@/lib/admin-data";
import { isValidTotpSecret, verifyTotp } from "@/lib/totp";
import type { SaveFormState } from "@/lib/admin-form-state";

/**
 * Confirms the person scanned the secret correctly by checking a live code
 * against it — before they put it in ADMIN_TOTP_SECRET. Enabling 2FA with a
 * mistyped secret would lock you out at the next login, so this is the
 * safety check. Nothing is stored server-side; the secret only takes effect
 * once you set the environment variable yourself.
 */
export async function verifyTwoFactorSetup(_prev: SaveFormState, formData: FormData): Promise<SaveFormState> {
  const email = await getAdminEmail();
  if (!email) return { status: "error", message: "Your session has expired — please log in again." };

  const secret = String(formData.get("secret") ?? "");
  const code = String(formData.get("code") ?? "").replace(/\s+/g, "");

  if (!isValidTotpSecret(secret)) {
    return { status: "error", message: "That secret isn't valid. Reload the page to generate a new one." };
  }
  if (verifyTotp(secret, code) === null) {
    return { status: "error", message: "That code doesn't match. Check the time on your phone and try again." };
  }

  await logActivity(email, "two_factor_setup_verified");
  return {
    status: "success",
    message: "Code verified. Now set ADMIN_TOTP_SECRET to the secret shown above in your environment and redeploy.",
  };
}
