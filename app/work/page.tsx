import type { Metadata } from "next";
import { PortfolioCard } from "@/components/portfolio-card";
import { getPublicPortfolio } from "@/lib/public-data";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
  return {
    title: content.pages.work.seoTitle,
    description: content.pages.work.seoDescription,
  };
}

export default async function WorkPage() {
  const { content } = await getSiteContent();
  const portfolioItems = await getPublicPortfolio();

  return (
    <>
      <section className="border-b border-ink-900/10 section-pad !pb-14">
        <div className="container-page">
          <h1 className="max-w-2xl font-display text-4xl leading-[1.15] text-ink-900 md:text-5xl">
            {content.pages.work.title}
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-500">
            {content.pages.work.description}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-page grid gap-6 md:grid-cols-3">
          {portfolioItems.map((item) => (
            <PortfolioCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </>
  );
}
