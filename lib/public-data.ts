import "server-only";
import { isDatabaseConfigured, safeQuery } from "@/lib/db";
import { faqItems, portfolioItems, type FaqItem, type PortfolioItem } from "@/lib/data";

export type PublicTestimonial = {
  clientName: string;
  businessName: string | null;
  position: string | null;
  quote: string;
  rating: number | null;
};

export async function getPublicFaqs(): Promise<FaqItem[]> {
  if (!isDatabaseConfigured()) return faqItems;

  const rows = await safeQuery<{ question: string; answer: string }>(
    `select question, answer from faqs where published = true order by sort_order asc, created_at asc`
  );
  return rows;
}

export async function getPublicPortfolio(): Promise<PortfolioItem[]> {
  if (!isDatabaseConfigured()) return portfolioItems;

  const rows = await safeQuery<{
    slug: string;
    name: string;
    industry: string | null;
    description: string | null;
    project_type: string | null;
    technologies: string[];
    website_url: string | null;
    thumbnail_url: string | null;
  }>(
    `select slug, name, industry, description, project_type, technologies, website_url, thumbnail_url
     from projects where status = 'live' order by featured desc, created_at desc`
  );

  return rows.map((project) => ({
    slug: project.slug,
    category: project.project_type ?? project.industry ?? "Project",
    name: project.name,
    description: project.description ?? "A Koraq Labs project.",
    technologies: project.technologies ?? [],
    isPlaceholder: false,
    liveUrl: project.website_url ?? undefined,
    image: project.thumbnail_url ?? undefined,
  }));
}

export async function getPublicPortfolioItem(slug: string): Promise<PortfolioItem | undefined> {
  const projects = await getPublicPortfolio();
  return projects.find((project) => project.slug === slug);
}

export async function getPublicTestimonials(): Promise<PublicTestimonial[]> {
  if (!isDatabaseConfigured()) return [];

  return safeQuery<{
    client_name: string;
    business_name: string | null;
    position: string | null;
    quote: string;
    rating: number | null;
  }>(
    `select client_name, business_name, position, quote, rating
     from testimonials where published = true order by featured desc, created_at desc`
  ).then((rows) =>
    rows.map((testimonial) => ({
      clientName: testimonial.client_name,
      businessName: testimonial.business_name,
      position: testimonial.position,
      quote: testimonial.quote,
      rating: testimonial.rating,
    }))
  );
}