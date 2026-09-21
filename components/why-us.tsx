import { SectionHeading } from "@/components/section-heading";
import { whyPoints } from "@/lib/data";
import { IconTarget, IconPhone, IconBolt, IconSprout } from "@/components/icons";

const icons = [IconTarget, IconPhone, IconBolt, IconSprout];

export function WhyUs() {
  return (
    <section className="section-pad border-b border-ink-900/10 bg-paper-soft">
      <div className="container-page">
        <SectionHeading title="Why Businesses Choose Koraq Labs" />

        <div className="mt-14 grid gap-10 sm:grid-cols-2">
          {whyPoints.map((point, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={point.title} className="flex gap-5">
                <Icon className="mt-1 h-6 w-6 shrink-0 text-signal-600" />
                <div>
                  <h3 className="font-display text-lg text-ink-900">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
