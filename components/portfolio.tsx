import { SectionHeading } from "@/components/section-heading";
import { PortfolioCard } from "@/components/portfolio-card";
import { getPublicPortfolio } from "@/lib/public-data";
import type { SiteContent } from "@/lib/site-content";

export async function Portfolio({ content }: { content: SiteContent }) {
  const portfolioItems = await getPublicPortfolio();
  const section = content.home.portfolio;
  if (!section.enabled) return null;

  return (
    <section className="section-pad border-b border-ink-900/10">
      <div className="container-page">
        <SectionHeading
          title={section.title}
          supporting={section.supporting}
        />

        <p className="mt-4 max-w-2xl text-[14px] text-ink-400">
          {section.note}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {portfolioItems.map((item) => (
            <PortfolioCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
