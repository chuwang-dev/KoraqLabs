"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { deleteFaq, getFaqs, logActivity, upsertFaq } from "@/lib/admin-data";
import type { SaveFormState } from "@/lib/admin-form-state";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function saveFaq(_prevState: SaveFormState, formData: FormData): Promise<SaveFormState> {
  const email = await getAdminEmail();
  if (!email) return { status: "error", message: "Your session has expired — please log in again." };

  const question = getString(formData, "question");
  const answer = getString(formData, "answer");
  if (!question || !answer) {
    return { status: "error", message: "Both a question and an answer are required." };
  }

  const id = getString(formData, "id") || undefined;
  const sortOrderRaw = getString(formData, "sortOrder");

  let sortOrder: number;
  if (sortOrderRaw && Number.isFinite(Number(sortOrderRaw))) {
    sortOrder = Math.trunc(Number(sortOrderRaw));
  } else {
    const { faqs } = await getFaqs();
    sortOrder = faqs.length ? Math.max(...faqs.map((f) => f.sort_order)) + 1 : 0;
  }

  // Editing preserves current published state (hidden field); only the
  // dedicated toggle should change that. New FAQs default to published.
  const published = id ? formData.get("published") === "on" : true;

  const result = await upsertFaq({ id, question, answer, sortOrder, published });
  if (!result.ok) return { status: "error", message: result.error };

  await logActivity(email, id ? "faq_updated" : "faq_created", question);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  revalidatePath("/");
  revalidatePath("/contact");
  return { status: "success", message: id ? "FAQ updated." : "FAQ added." };
}

export async function toggleFaqPublished(id: string, published: boolean): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  const { faqs } = await getFaqs();
  const existing = faqs.find((f) => f.id === id);
  if (!existing) return;

  await upsertFaq({
    id,
    question: existing.question,
    answer: existing.answer,
    sortOrder: existing.sort_order,
    published,
  });
  await logActivity(email, published ? "faq_published" : "faq_unpublished", existing.question);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  revalidatePath("/");
  revalidatePath("/contact");
}

export async function removeFaq(id: string, question: string): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await deleteFaq(id);
  await logActivity(email, "faq_deleted", question);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
  revalidatePath("/");
  revalidatePath("/contact");
}
