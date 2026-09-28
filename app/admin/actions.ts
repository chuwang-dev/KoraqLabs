"use server";

import { redirect } from "next/navigation";
import { destroySession, destroyAllSessions, getAdminEmail } from "@/lib/auth";
import { logActivity } from "@/lib/admin-data";

export async function logout() {
  const email = await getAdminEmail();
  if (email) {
    await logActivity(email, "logout");
  }
  await destroySession();
  redirect("/admin/login");
}

/** Revokes every active session for this admin, including the one used to
 *  call this — the next request (this redirect included) will fail the
 *  revocation check and land back on /admin/login. */
export async function revokeAllSessions() {
  const email = await getAdminEmail();
  if (!email) return;

  const count = await destroyAllSessions(email);
  await logActivity(email, "sessions_revoked_all", `${count} session(s)`);
  redirect("/admin/login");
}
