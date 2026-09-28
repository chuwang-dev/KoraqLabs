import { Reveal } from "@/components/ui/reveal";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { faqItems } from "@/lib/data";
import { getPublicFaqs } from "@/lib/admin-data";

export async function Faq() {
  const items = await getPublicFaqs(faqItems);
  return (
    <section className="section-pad border-b hairline">
      <div className="container-page grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
        <Reveal>
          <div>
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-5 text-display-md [font-family:var(--font-display)]">
              Frequently asked questions.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <FaqAccordion items={items} />
        </Reveal>
      </div>
    </section>
  );
}
