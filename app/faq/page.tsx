import type { Metadata } from "next";
import { CtaButton } from "@/components/cta-button";
import { FaqAccordion } from "@/components/faq-accordion";
import { faqItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about working with Koraq Labs.",
};

export default function FaqPage() {
  return (
    <section className="section-pad">
      <div className="container-page">
        <h1 className="font-display text-4xl leading-[1.15] text-ink-900 md:text-5xl">
          Frequently Asked Questions
        </h1>
        <div className="mt-12 max-w-3xl">
          <FaqAccordion items={faqItems} />
        </div>
        <CtaButton href="/contact" className="mt-12">
          Still have questions? Talk to us
        </CtaButton>
      </div>
    </section>
  );
}
