import "server-only";
import { isDatabaseConfigured, mutate, safeQuery } from "@/lib/db";
import { siteConfig, socialLinks } from "@/lib/config";

export type SiteSettings = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  socialLinks: { label: string; href: string }[];
};

const defaults: SiteSettings = {
  name: siteConfig.name,
  tagline: siteConfig.tagline,
  description: siteConfig.description,
  url: siteConfig.url,
  email: siteConfig.email,
  whatsappNumber: siteConfig.whatsappNumber,
  whatsappDisplay: siteConfig.whatsappDisplay,
  socialLinks,
};

export async function getSiteSettings(): Promise<{ settings: SiteSettings; usingDemoData: boolean }> {
  if (!isDatabaseConfigured()) return { settings: defaults, usingDemoData: true };

  const rows = await safeQuery<{ value: Partial<SiteSettings> }>(
    `select value from site_settings where key = 'public' limit 1`
  );
  const value = rows[0]?.value;
  if (!value) return { settings: defaults, usingDemoData: false };

  return {
    usingDemoData: false,
    settings: {
      ...defaults,
      ...value,
      socialLinks: Array.isArray(value.socialLinks) ? value.socialLinks : defaults.socialLinks,
    },
  };
}

export async function saveSiteSettings(
  settings: SiteSettings
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await mutate(
    `insert into site_settings (key, value, updated_at)
     values ('public', $1::jsonb, now())
     on conflict (key) do update set value = excluded.value, updated_at = now()`,
    [JSON.stringify(settings)]
  );
  return result.ok ? { ok: true } : result;
}