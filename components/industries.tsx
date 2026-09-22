import { SectionHeading } from "@/components/section-heading";
import { industries } from "@/lib/data";
import {
  IconHeart,
  IconBuilding,
  IconBed,
  IconCart,
  IconCar,
  IconBriefcase,
} from "@/components/icons";

const icons = [IconHeart, IconBuilding, IconBed, IconCart, IconCar, IconBriefcase];

export function Industries() {
  return (
    <section className="section-pad border-b border-ink-900/10 bg-paper-soft">
      <div className="container-page">
        <SectionHeading
          title="Built for Businesses Ready to Grow"
          supporting="Whether you're launching a new business or taking an established company online, we build around the way your customers actually find and contact you."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {industries.map((industry, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div
                key={industry.name}
                className="flex flex-col items-center gap-3 rounded-md border border-ink-900/10 bg-paper px-4 py-7 text-center"
              >
                <Icon className="h-6 w-6 text-ink-900/70" />
                <span className="text-[14px] font-medium text-ink-700">
                  {industry.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
