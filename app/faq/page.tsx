import type { Metadata } from "next";
import { CtaButton } from "@/components/cta-button";
import { FaqAccordion } from "@/components/faq-accordion";
import { getPublicFaqs } from "@/lib/public-data";
import { getSiteContent } from "@/lib/site-content";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
  return {
    title: content.pages.faq.seoTitle,
    description: content.pages.faq.description,
  };
}

export default async function FaqPage() {
  const { content } = await getSiteContent();
  const faqItems = await getPublicFaqs();

  return (
    <section className="section-pad">
      <div className="container-page">
        <h1 className="font-display text-4xl leading-[1.15] text-ink-900 md:text-5xl">
          {content.pages.faq.title}
        </h1>
        <div className="mt-12 max-w-3xl">
          <FaqAccordion items={faqItems} />
        </div>
        <CtaButton href={content.pages.faq.ctaHref} className="mt-12">
          {content.pages.faq.ctaLabel}
        </CtaButton>
      </div>
    </section>
  );
}
