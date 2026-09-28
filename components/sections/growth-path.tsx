import { Reveal } from "@/components/ui/reveal";
import { growthStages } from "@/lib/data";
import { IconArrowDown } from "@/components/ui/icons";

export function GrowthPath() {
  return (
    <section className="section-pad border-b hairline bg-paper-soft">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">Website vs digital product</p>
          <h2 className="mt-5 max-w-[20ch] text-display-md [font-family:var(--font-display)]">
            Your first website doesn&apos;t have to be your final digital
            product.
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-500">
            Most businesses start with something small. What matters is that
            what you start with can carry you forward instead of needing to be
            thrown away.
          </p>
        </Reveal>

        <ol className="mt-16 grid gap-4 lg:grid-cols-4 lg:gap-0">
          {growthStages.map((stage, i) => (
            <Reveal key={stage.stage} delay={i * 0.07}>
              <li className="relative flex h-full flex-col rounded-lg border hairline bg-paper p-7 lg:rounded-none lg:border-r-0 lg:first:rounded-l-lg lg:last:rounded-r-lg lg:last:border-r">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-signal-500">
                  {stage.stage}
                </span>
                <h3 className="mt-4 text-[20px] leading-snug text-ink-900 [font-family:var(--font-display)]">
                  {stage.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-500">
                  {stage.description}
                </p>

                {i < growthStages.length - 1 ? (
                  <span
                    className="absolute left-1/2 top-full z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border hairline bg-paper p-1.5 lg:left-full lg:top-1/2 lg:-translate-y-1/2 lg:-translate-x-1/2"
                    aria-hidden="true"
                  >
                    <IconArrowDown className="h-3 w-3 text-ink-300 lg:-rotate-90" />
                  </span>
                ) : null}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
