import { SectionHeading } from "@/components/section-heading";
import { PortfolioCard } from "@/components/portfolio-card";
import { getPublicPortfolio } from "@/lib/public-data";

export async function Portfolio() {
  const portfolioItems = await getPublicPortfolio();

  return (
    <section className="section-pad border-b border-ink-900/10">
      <div className="container-page">
        <SectionHeading
          title="Our Work"
          supporting="Real websites. Real businesses. Built to solve real problems."
        />

        <p className="mt-4 max-w-2xl text-[14px] text-ink-400">
          We&apos;re just getting started — the projects below are labeled demo
          concepts until we can showcase real client work.
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
