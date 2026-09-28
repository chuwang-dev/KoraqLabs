"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { logActivity } from "@/lib/admin-data";
import { saveSiteSettings, type SiteSettings } from "@/lib/site-settings";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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