import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { faqItems } from "@/lib/data";
import { siteConfig, whatsappLink } from "@/lib/config";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about working with Koraq Labs.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Frequently asked questions."
        description="If your question isn't answered here, message us — we'll answer it directly."
      />

      <section className="section-pad border-b hairline">
        <div className="container-page max-w-3xl">
          <Reveal>
            <FaqAccordion items={faqItems} />
          </Reveal>

          <Reveal>
            <div className="mt-14 flex flex-wrap items-center gap-3">
              <Button href="/contact" size="lg">Start a Project</Button>
              <Button
                href={whatsappLink("Hi Koraq Labs, I have a question.")}
                variant="secondary"
                size="lg"
                external
              >
                WhatsApp {siteConfig.whatsappDisplay}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
