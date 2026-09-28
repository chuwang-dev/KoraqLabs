import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { InterfaceComposition } from "@/components/ui/interface-composition";
import { IconArrowUpRight } from "@/components/ui/icons";

const disciplines = [
  "Websites",
  "Landing Pages",
  "Web Applications",
  "Digital Products",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b hairline">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_72%)]" />

      <div className="container-page relative grid items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div>
          <Reveal>
            <p className="eyebrow">Nigerian technology studio</p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-6 max-w-[15ch] text-display-xl font-normal text-ink-900 [font-family:var(--font-display)]">
              Websites and digital products built to move your business forward.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-7 max-w-lg text-[17px] leading-[1.65] text-ink-500">
              Koraq Labs designs and builds fast, modern digital experiences for
              businesses ready to look credible, reach more customers, and
              operate better online.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/contact" size="lg">
                Start a Project
                <IconArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
              <Button href="/work" variant="secondary" size="lg">
                View Our Work
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
              {disciplines.map((item, i) => (
                <li key={item} className="flex items-center gap-3">
                  {item}
                  {i < disciplines.length - 1 ? (
                    <span className="text-signal-400">•</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="relative lg:pl-6">
          <div className="mx-auto max-w-[460px] lg:mx-0">
            <InterfaceComposition />
          </div>
        </div>
      </div>
    </section>
  );
}
