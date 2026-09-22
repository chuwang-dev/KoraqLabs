import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/data";

export function AboutPreview() {
  return (
    <section className="section-pad border-b hairline">
      <div className="container-page grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div>
            <p className="eyebrow">About Koraq Labs</p>
            <div className="mt-6 space-y-5">
              {company.about.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "max-w-xl text-[22px] leading-[1.45] text-ink-900 [font-family:var(--font-display)]"
                      : "max-w-xl text-[16px] leading-relaxed text-ink-500"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <Button href="/about" variant="secondary" className="mt-9">
              More about us
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-px overflow-hidden rounded-lg border hairline bg-ink-900/[0.09]">
            <div className="bg-paper p-7">
              <p className="eyebrow">Mission</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
                {company.mission}
              </p>
            </div>
            <div className="bg-paper p-7">
              <p className="eyebrow">Vision</p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
                {company.vision}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
