"use server";

import { redirect } from "next/navigation";
import { destroySession, getAdminEmail } from "@/lib/auth";
import { logActivity } from "@/lib/admin-data";

export async function logout() {
  const email = await getAdminEmail();
  if (email) {
    await logActivity(email, "logout");
  }
  await destroySession();
  redirect("/admin/login");
}
