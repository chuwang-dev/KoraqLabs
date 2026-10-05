import type { MetadataRoute } from "next";
import { getPublicPortfolio } from "@/lib/public-data";
import { getSiteSettings } from "@/lib/site-settings";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ settings }, portfolioItems] = await Promise.all([
    getSiteSettings(),
    getPublicPortfolio(),
  ]);
  const now = new Date();

  const staticRoutes = ["", "/services", "/work", "/about", "/faq", "/contact", "/privacy"].map(
    (route) => ({
      url: `${settings.url}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })
  );

  const projectRoutes = portfolioItems.map((p) => ({
    url: `${settings.url}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p.isPlaceholder ? 0.4 : 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
