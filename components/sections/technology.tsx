import { Reveal } from "@/components/ui/reveal";
import { techGroups } from "@/lib/data";

export function Technology() {
  return (
    <section className="section-pad border-b hairline">
      <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div>
            <p className="eyebrow">Technology</p>
            <h2 className="mt-5 text-display-md [font-family:var(--font-display)]">
              Modern technology. Practical results.
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-500">
              We choose tools based on what a project actually needs — not to
              put logos on a page. A landing page doesn&apos;t need a database.
              A booking system does. The right answer is the one that keeps the
              project fast to build and simple to maintain.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-10 sm:grid-cols-2">
            {techGroups.map((group) => (
              <div key={group.label} className="border-t hairline pt-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
                  {group.label}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded border hairline bg-paper-soft px-3 py-1.5 text-[13px] text-ink-700"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
