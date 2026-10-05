import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { getPublicFaqs } from "@/lib/public-data";
import type { SiteContent } from "@/lib/site-content";

export async function Faq({ content }: { content: SiteContent }) {
  const faqItems = await getPublicFaqs();
  const section = content.home.faq;
  if (!section.enabled) return null;

  return (
    <section className="section-pad border-b border-ink-900/10 bg-paper-soft">
      <div className="container-page">
        <SectionHeading title={section.title} />
        <div className="mt-10 max-w-3xl">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}
