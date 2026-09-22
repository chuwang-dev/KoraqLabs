import type { Metadata } from "next";
import { PortfolioCard } from "@/components/portfolio-card";
import { portfolioItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "A look at the websites and landing pages Koraq Labs designs and builds for Nigerian businesses.",
};

export default function WorkPage() {
  return (
    <>
      <section className="border-b border-ink-900/10 section-pad !pb-14">
        <div className="container-page">
          <h1 className="max-w-2xl font-display text-4xl leading-[1.15] text-ink-900 md:text-5xl">
            Our Work
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-500">
            Real websites. Real businesses. Built to solve real problems. We&apos;re
            just getting started — the projects below are labeled demo
            concepts until we can showcase real client work.
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
