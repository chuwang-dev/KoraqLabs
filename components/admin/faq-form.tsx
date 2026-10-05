"use client";

import { useActionState } from "react";
import type { Faq } from "@/lib/admin-data";
import { initialSaveFormState } from "@/lib/admin-form-state";
import { saveFaq } from "@/app/admin/(shell)/faqs/actions";
import { SaveButton, FormStatusBanner } from "@/components/admin/form-status";

export function FaqForm({ faq }: { faq?: Faq }) {
  const [state, formAction] = useActionState(saveFaq, initialSaveFormState);

  return (
    <form action={formAction} className="mt-4 space-y-4">
      {faq ? (
        <>
          <input type="hidden" name="id" value={faq.id} />
          <input type="hidden" name="published" value={faq.published ? "on" : ""} />
        </>
      ) : null}

      <FormStatusBanner state={state} />

      <input name="question" required placeholder="Question" defaultValue={faq?.question} className="admin-input" />
      <textarea name="answer" required placeholder="Answer" rows={3} defaultValue={faq?.answer} className="admin-input" />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-ink-500">
          Order
          <input type="number" name="sortOrder" defaultValue={faq?.sort_order} className="admin-input w-20 py-1.5" />
        </label>
        <SaveButton label={faq ? "Save changes" : "Add FAQ"} savingLabel="Saving…" />
      </div>
    </form>
  );
}
