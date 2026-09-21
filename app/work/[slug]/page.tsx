import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BrowserMockup } from "@/components/browser-mockup";
import { CtaButton } from "@/components/cta-button";
import { portfolioItems } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item) return {};
  return {
    title: item.name,
    description: item.description,
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item) notFound();

  return (
    <section className="section-pad">
      <div className="container-page grid gap-14 md:grid-cols-[1fr_1fr]">
        <div>
          <Link href="/work" className="text-[14px] text-ink-400 hover:text-ink-900">
            ← Back to work
          </Link>
          <p className="mt-5 text-[13px] font-medium text-signal-600">
            {item.category} · {item.isPlaceholder ? "Demo project" : "Live project"}
          </p>
          <h1 className="mt-1.5 font-display text-3xl text-ink-900 md:text-4xl">
            {item.name}
          </h1>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-500">
            {item.description}
          </p>
          <p className="mt-6 text-[14px] text-ink-400">
            Built with {item.technologies.join(", ")}.
          </p>
          {item.isPlaceholder ? (
            <div className="mt-8 rounded-md border border-dashed border-ink-900/15 bg-paper-soft px-5 py-4 text-[13px] text-ink-500">
              This is a labeled demo concept, not a live client project. Real
              case studies will replace these once client work is available.
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaButton href="/contact">Start a Similar Project</CtaButton>
            {item.liveUrl ? (
              <CtaButton href={item.liveUrl} variant="secondary" external>
                Visit Live Site
              </CtaButton>
            ) : null}
          </div>
        </div>

        <BrowserMockup label={item.category} accent image={item.image} className="h-fit" />
      </div>
    </section>
  );
}
