"use client";

import { useFormState } from "react-dom";
import type { Testimonial } from "@/lib/admin-data";
import { initialSaveFormState } from "@/lib/admin-form-state";
import { saveTestimonial } from "@/app/admin/(shell)/testimonials/actions";
import { SaveButton, FormStatusBanner } from "@/components/admin/form-status";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const [state, formAction] = useFormState(saveTestimonial, initialSaveFormState);

  return (
    <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {testimonial ? (
        <>
          <input type="hidden" name="id" value={testimonial.id} />
          <input type="hidden" name="published" value={testimonial.published ? "on" : ""} />
          <input type="hidden" name="featured" value={testimonial.featured ? "on" : ""} />
        </>
      ) : null}

      <FormStatusBanner state={state} />

      <input name="clientName" required placeholder="Client name" defaultValue={testimonial?.client_name} className="admin-input" />
      <input name="businessName" placeholder="Business" defaultValue={testimonial?.business_name ?? ""} className="admin-input" />
      <input name="position" placeholder="Position" defaultValue={testimonial?.position ?? ""} className="admin-input" />
      <ImageUploadField name="photoUrl" defaultValue={testimonial?.photo_url} placeholder="Photo URL, or upload" />
      <select name="rating" defaultValue={String(testimonial?.rating ?? 5)} className="admin-input">
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
        defaultValue={testimonial?.quote}
        className="admin-input sm:col-span-2"
      />
      <div className="sm:col-span-2">
        <SaveButton label={testimonial ? "Save changes" : "Add testimonial"} savingLabel="Saving…" />
      </div>
    </form>
  );
}
