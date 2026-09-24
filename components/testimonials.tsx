import { SectionHeading } from "@/components/section-heading";
import { getPublicTestimonials } from "@/lib/public-data";

// No real clients yet — this stays honest rather than fabricating quotes.
// Once real testimonials exist, add them to lib/data.ts as a structured
// array and map over them here.

export async function Testimonials() {
  const testimonials = await getPublicTestimonials();

  return (
    <section className="section-pad border-b border-ink-900/10">
      <div className="container-page">
        <SectionHeading title="What Our Clients Say" />

        {testimonials.length === 0 ? (
          <div className="mt-10 rounded-md border border-dashed border-ink-900/15 bg-paper-soft px-8 py-14 text-center">
            <p className="mx-auto max-w-md text-[15px] text-ink-500">
              Client testimonials will appear here as we launch our first projects.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure key={`${testimonial.clientName}-${testimonial.quote}`} className="rounded-md border border-ink-900/10 bg-paper-white p-6">
                <blockquote className="font-display text-xl leading-relaxed text-ink-900">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 text-sm text-ink-500">
                  <span className="font-medium text-ink-900">{testimonial.clientName}</span>
                  {testimonial.position || testimonial.businessName ? (
                    <span> · {[testimonial.position, testimonial.businessName].filter(Boolean).join(", ")}</span>
                  ) : null}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
