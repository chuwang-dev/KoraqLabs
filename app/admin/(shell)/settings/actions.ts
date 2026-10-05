"use server";

import { revalidatePath } from "next/cache";
import {
  changeAdminPassword as changePassword,
  destroyOtherSessions,
  getAdminEmail,
  getSession,
} from "@/lib/auth";
import { logActivity } from "@/lib/admin-data";
import { saveSiteSettings, type SiteSettings } from "@/lib/site-settings";
import type { SaveFormState } from "@/lib/admin-form-state";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getRawString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function updateSiteSettings(formData: FormData): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;

  const socialLabels = formData.getAll("socialLabel");
  const socialHrefs = formData.getAll("socialHref");
  const links = socialLabels
    .map((label, index) => ({
      label: typeof label === "string" ? label.trim() : "",
      href: typeof socialHrefs[index] === "string" ? socialHrefs[index].trim() : "",
    }))
    .filter((link) => link.label && link.href && isHttpUrl(link.href));

  const settings: SiteSettings = {
    name: getString(formData, "name"),
    tagline: getString(formData, "tagline"),
    description: getString(formData, "description"),
    url: getString(formData, "url"),
    email: getString(formData, "email"),
    whatsappNumber: getString(formData, "whatsappNumber").replace(/\D/g, ""),
    whatsappDisplay: getString(formData, "whatsappDisplay"),
    socialLinks: links,
  };

  if (
    !settings.name ||
    !settings.tagline ||
    !settings.description ||
    !isHttpUrl(settings.url) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email) ||
    !/^\d{7,15}$/.test(settings.whatsappNumber)
  ) {
    return;
  }

  const saved = await saveSiteSettings(settings);
  if (!saved.ok) {
    console.error("Could not save website settings:", saved.error);
    return;
  }

  await logActivity(email, "site_settings_updated", "Website details and social links updated");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  revalidatePath("/robots.txt");
  revalidatePath("/sitemap.xml");
}

export async function changeAdminPassword(
  _previousState: SaveFormState,
  formData: FormData
): Promise<SaveFormState> {
  const email = await getAdminEmail();
  if (!email) {
    return { status: "error", message: "Your session has expired — please log in again." };
  }

  const currentPassword = getRawString(formData, "currentPassword");
  const newPassword = getRawString(formData, "newPassword");
  const confirmPassword = getRawString(formData, "confirmPassword");

  const newPasswordBytes = Buffer.byteLength(newPassword, "utf8");
  if (newPassword.length < 12 || newPasswordBytes > 72) {
    return { status: "error", message: "Choose a password between 12 and 72 characters." };
  }
  if (newPassword !== confirmPassword) {
    return { status: "error", message: "The new passwords do not match." };
  }
  if (currentPassword === newPassword) {
    return { status: "error", message: "Choose a password different from your current one." };
  }

  const result = await changePassword(email, currentPassword, newPassword);
  if (!result.ok) return { status: "error", message: result.error };

  const session = await getSession();
  const revokedSessions = session ? await destroyOtherSessions(email, session.jti) : 0;
  await logActivity(email, "admin_password_changed", "Admin password changed");
  revalidatePath("/admin/settings");
  return {
    status: "success",
    message: `Password changed. ${revokedSessions} other session${revokedSessions === 1 ? " was" : "s were"} signed out.`,
  };
}