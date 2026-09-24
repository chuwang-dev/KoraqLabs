import type { Metadata } from "next";
import { getFaqs } from "@/lib/admin-data";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";
import { createFaq, toggleFaqPublished, removeFaq } from "./actions";

export const metadata: Metadata = { title: "FAQs — Koraq Labs Admin" };

export default async function FaqsPage() {
  const { faqs, usingDemoData } = await getFaqs();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl italic text-ink-900">FAQs</h1>
          <p className="mt-1 text-sm text-ink-500">Edit the questions shown on /faq without a deploy.</p>
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
          <form action={createFaq} className="mt-4 space-y-4">
            <input name="question" required placeholder="Question" className="admin-input" />
            <textarea name="answer" required placeholder="Answer" rows={3} className="admin-input" />
            <button
              type="submit"
              className="rounded bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-700"
            >
              Add FAQ
            </button>
          </form>
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
                <p className="font-medium text-ink-900">{f.question}</p>
                <div className="flex shrink-0 items-center gap-4">
                  <ToggleSwitch
                    id={f.id}
                    checked={f.published}
                    label={f.published ? "Published" : "Hidden"}
                    action={toggleFaqPublished}
                  />
                  <form action={removeFaq.bind(null, f.id, f.question)}>
                    <ConfirmDeleteButton item={f.question} />
                  </form>
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-600">{f.answer}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
