import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/lib/config";
import { IconDownload } from "@/components/ui/icons";

export function BrochureCta() {
  return (
    <section className="relative overflow-hidden border-b hairline bg-ink-900 text-paper">
      <div className="grid-bg-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_50%,black,transparent_70%)]" />

      <div className="container-page relative grid items-center gap-10 py-20 md:py-24 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
              Company profile
            </p>
            <h2 className="mt-5 max-w-[18ch] text-display-md text-paper [font-family:var(--font-display)]">
              Want the full Koraq Labs profile?
            </h2>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/55">
              Download our company brochure to explore our services,
              capabilities, process, portfolio, and project options.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Button href={siteConfig.brochurePath} variant="onDark" size="lg" download>
              <IconDownload className="h-4 w-4" />
              Download Company Brochure
            </Button>
            <Button
              href="/contact"
              size="lg"
              className="border border-white/20 bg-transparent text-paper hover:bg-white/5"
            >
              Start a Project
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
