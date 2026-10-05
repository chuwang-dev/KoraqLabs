"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { deleteTestimonial, getTestimonials, logActivity, upsertTestimonial } from "@/lib/admin-data";
import type { SaveFormState } from "@/lib/admin-form-state";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function saveTestimonial(_prevState: SaveFormState, formData: FormData): Promise<SaveFormState> {
  const email = await getAdminEmail();
  if (!email) return { status: "error", message: "Your session has expired — please log in again." };

  const clientName = getString(formData, "clientName");
  const quote = getString(formData, "quote");
  if (!clientName || !quote) {
    return { status: "error", message: "Client name and testimonial text are required." };
  }

  const ratingRaw = getString(formData, "rating");
  const rating = ratingRaw ? Number(ratingRaw) : undefined;
  const id = getString(formData, "id") || undefined;

  // Editing an existing testimonial preserves its current published/featured
  // state (carried as hidden fields from the form) rather than resetting
  // it — only the dedicated publish toggle should change that.
  const published = formData.get("published") === "on";
  const featured = formData.get("featured") === "on";

  const result = await upsertTestimonial({
    id,
    clientName,
    businessName: getString(formData, "businessName") || undefined,
    position: getString(formData, "position") || undefined,
    quote,
    photoUrl: getString(formData, "photoUrl") || undefined,
    rating: rating && rating >= 1 && rating <= 5 ? rating : undefined,
    // New testimonials are never auto-published, regardless of the hidden
    // field, since one won't be present on the create form.
    published: id ? published : false,
    featured,
  });

  if (!result.ok) {
    return { status: "error", message: result.error };
  }

  await logActivity(email, id ? "testimonial_updated" : "testimonial_created", clientName);
  revalidatePath("/admin/testimonials");
  revalidatePath("/", "page");
  return { status: "success", message: id ? "Testimonial updated." : "Testimonial added." };
}

export async function togglePublished(id: string, published: boolean): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  const { testimonials } = await getTestimonials();
  const existing = testimonials.find((t) => t.id === id);
  if (!existing) return;

  await upsertTestimonial({
    id,
    clientName: existing.client_name,
    businessName: existing.business_name ?? undefined,
    position: existing.position ?? undefined,
    quote: existing.quote,
    photoUrl: existing.photo_url ?? undefined,
    rating: existing.rating ?? undefined,
    published,
    featured: existing.featured,
  });

  await logActivity(
    email,
    published ? "testimonial_published" : "testimonial_unpublished",
    existing.client_name
  );
  revalidatePath("/admin/testimonials");
  revalidatePath("/", "page");
}

export async function removeTestimonial(id: string, clientName: string): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await deleteTestimonial(id);
  await logActivity(email, "testimonial_deleted", clientName);
  revalidatePath("/admin/testimonials");
  revalidatePath("/", "page");
}
