const capabilities = [
  "Discovery & scoping",
  "Interface design",
  "Front-end engineering",
  "Web applications",
  "API integrations",
  "Domain & SSL setup",
  "Deployment pipelines",
  "Performance tuning",
  "Ongoing maintenance",
];

// Deliberately a capability strip rather than a client-logo wall — we don't
// have logos to show, and inventing them would be dishonest.

export function CapabilityStrip() {
  return (
    <section className="overflow-hidden border-b hairline bg-paper-soft py-7">
      <p className="container-page eyebrow mb-5">Trusted by the way we work</p>

      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
          {[...capabilities, ...capabilities].map((item, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-10 whitespace-nowrap text-[14px] text-ink-400"
            >
              {item}
              <span className="h-1 w-1 rounded-full bg-signal-300" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
