import { Reveal } from "@/components/ui/reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b hairline">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_40%_0%,black,transparent_70%)]" />
      <div className="container-page relative py-20 md:py-28">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-6 max-w-[18ch] text-display-lg [font-family:var(--font-display)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-xl text-[17px] leading-[1.65] text-ink-500">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-9">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}
