import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { projects } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/services", "/work", "/about", "/faq", "/contact"].map(
    (route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })
  );

  const projectRoutes = projects.map((p) => ({
    url: `${siteConfig.url}/work/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p.status === "live" ? 0.6 : 0.4,
  }));

  return [...staticRoutes, ...projectRoutes];
}
