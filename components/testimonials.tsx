import { SectionHeading } from "@/components/section-heading";

// No real clients yet — this stays honest rather than fabricating quotes.
// Once real testimonials exist, add them to lib/data.ts as a structured
// array and map over them here.

export function Testimonials() {
  return (
    <section className="section-pad border-b border-ink-900/10">
      <div className="container-page">
        <SectionHeading title="What Our Clients Say" />

        <div className="mt-10 rounded-md border border-dashed border-ink-900/15 bg-paper-soft px-8 py-14 text-center">
          <p className="mx-auto max-w-md text-[15px] text-ink-500">
            Client testimonials will appear here as we launch our first
            projects.
          </p>
        </div>
      </div>
    </section>
  );
}
