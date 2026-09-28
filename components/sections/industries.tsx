import { Reveal } from "@/components/ui/reveal";
import { industries } from "@/lib/data";

export function Industries() {
  return (
    <section className="section-pad border-b hairline">
      <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div>
            <p className="eyebrow">Who we build for</p>
            <h2 className="mt-5 text-display-md [font-family:var(--font-display)]">
              We build for businesses, not industries.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-500">
              The structure changes, the standard doesn&apos;t. What matters is
              how your customers find you, what convinces them, and how they get
              in touch — that thinking applies anywhere.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border hairline bg-ink-900/[0.09] sm:grid-cols-3">
            {industries.map((industry) => (
              <li
                key={industry}
                className="bg-paper px-5 py-7 text-[15px] text-ink-700 transition-colors duration-300 hover:bg-paper-soft"
              >
                {industry}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
