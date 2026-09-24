"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { deleteTestimonial, getTestimonials, logActivity, upsertTestimonial } from "@/lib/admin-data";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createTestimonial(formData: FormData): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;

  const clientName = getString(formData, "clientName");
  const quote = getString(formData, "quote");
  if (!clientName || !quote) return;

  const ratingRaw = getString(formData, "rating");
  const rating = ratingRaw ? Number(ratingRaw) : undefined;

  await upsertTestimonial({
    clientName,
    businessName: getString(formData, "businessName") || undefined,
    position: getString(formData, "position") || undefined,
    quote,
    photoUrl: getString(formData, "photoUrl") || undefined,
    rating: rating && rating >= 1 && rating <= 5 ? rating : undefined,
    // Never auto-publish — an administrator must explicitly flip this later.
    published: false,
    featured: false,
  });

  await logActivity(email, "testimonial_created", clientName);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
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
  revalidatePath("/");
}

export async function removeTestimonial(id: string, clientName: string): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await deleteTestimonial(id);
  await logActivity(email, "testimonial_deleted", clientName);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
