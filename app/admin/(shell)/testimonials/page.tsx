import type { Metadata } from "next";
import { getTestimonials } from "@/lib/admin-data";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { togglePublished, removeTestimonial } from "./actions";

export const metadata: Metadata = { title: "Testimonials — Koraq Labs Admin" };

export default async function TestimonialsPage() {
  const { testimonials, usingDemoData } = await getTestimonials();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl italic text-ink-900">Testimonials</h1>
          <p className="mt-1 text-sm text-ink-500">
            New testimonials are never published automatically — flip the switch when ready.
          </p>
        </div>
        {usingDemoData ? <DemoDataBadge /> : null}
      </div>

      {usingDemoData ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 bg-paper-white p-5 text-sm text-ink-500">
          Connect <code className="font-mono text-xs">DATABASE_URL</code> to add and publish testimonials.
        </div>
      ) : (
        <details className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
          <summary className="cursor-pointer text-sm font-semibold text-ink-800">
            + Add a testimonial
          </summary>
          <TestimonialForm />
        </details>
      )}

      {testimonials.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-400">
          No testimonials yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {testimonials.map((t) => (
            <li key={t.id} className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink-900">{t.client_name}</p>
                  <p className="text-xs text-ink-400">
                    {t.business_name ?? "—"} {t.position ? `· ${t.position}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <ToggleSwitch
                    id={t.id}
                    checked={t.published}
                    label={t.published ? "Published" : "Unpublished"}
                    action={togglePublished}
                  />
                  <form action={removeTestimonial.bind(null, t.id, t.client_name)}>
                    <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-700">&ldquo;{t.quote}&rdquo;</p>
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-signal-600">Edit</summary>
                <TestimonialForm testimonial={t} />
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
