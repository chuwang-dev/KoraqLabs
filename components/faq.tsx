import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";
import { getPublicFaqs } from "@/lib/public-data";

export async function Faq() {
  const faqItems = await getPublicFaqs();

  return (
    <section className="section-pad border-b border-ink-900/10 bg-paper-soft">
      <div className="container-page">
        <SectionHeading title="Frequently Asked Questions" />
        <div className="mt-10 max-w-3xl">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}
