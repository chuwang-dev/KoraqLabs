import type { Metadata } from "next";
import { getTestimonials } from "@/lib/admin-data";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { createTestimonial, togglePublished, removeTestimonial } from "./actions";

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
          <form action={createTestimonial} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input name="clientName" required placeholder="Client name" className="admin-input" />
            <input name="businessName" placeholder="Business" className="admin-input" />
            <input name="position" placeholder="Position" className="admin-input" />
            <input name="photoUrl" placeholder="Photo URL" className="admin-input" />
            <select name="rating" defaultValue="5" className="admin-input">
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} star{n === 1 ? "" : "s"}
                </option>
              ))}
            </select>
            <textarea
              name="quote"
              required
              placeholder="Testimonial text"
              rows={3}
              className="admin-input sm:col-span-2"
            />
            <button
              type="submit"
              className="w-fit rounded bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-700 sm:col-span-2"
            >
              Add testimonial
            </button>
          </form>
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
                    <ConfirmDeleteButton item={t.client_name} />
                  </form>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-700">&ldquo;{t.quote}&rdquo;</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
