import type { Metadata } from "next";
import { getFaqs } from "@/lib/admin-data";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { FaqForm } from "@/components/admin/faq-form";
import { toggleFaqPublished, removeFaq } from "./actions";

export const metadata: Metadata = { title: "FAQs — Koraq Labs Admin" };

export default async function FaqsPage() {
  const { faqs, usingDemoData } = await getFaqs();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl italic text-ink-900">FAQs</h1>
          <p className="mt-1 text-sm text-ink-500">
            Edit the questions shown on /faq without a deploy. Lower order numbers show first.
          </p>
        </div>
        {usingDemoData ? <DemoDataBadge /> : null}
      </div>

      {usingDemoData ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 bg-paper-white p-5 text-sm text-ink-500">
          Connect <code className="font-mono text-xs">DATABASE_URL</code> to manage FAQs here. Until then,
          the public /faq page uses the FAQs defined in <code className="font-mono text-xs">lib/data.ts</code>.
        </div>
      ) : (
        <details className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
          <summary className="cursor-pointer text-sm font-semibold text-ink-800">+ Add a FAQ</summary>
          <FaqForm />
        </details>
      )}

      {faqs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-400">
          No FAQs in the database yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {faqs.map((f) => (
            <li key={f.id} className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <p className="font-medium text-ink-900">
                  <span className="mr-2 font-mono text-xs text-ink-400">#{f.sort_order}</span>
                  {f.question}
                </p>
                <div className="flex shrink-0 items-center gap-4">
                  <ToggleSwitch
                    id={f.id}
                    checked={f.published}
                    label={f.published ? "Published" : "Hidden"}
                    action={toggleFaqPublished}
                  />
                  <form action={removeFaq.bind(null, f.id, f.question)}>
                    <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-600">{f.answer}</p>
              <details className="mt-3">
                <summary className="cursor-pointer text-xs font-medium text-signal-600">Edit</summary>
                <FaqForm faq={f} />
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
