"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { deleteFaq, getFaqs, logActivity, upsertFaq } from "@/lib/admin-data";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createFaq(formData: FormData): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;

  const question = getString(formData, "question");
  const answer = getString(formData, "answer");
  if (!question || !answer) return;

  const { faqs } = await getFaqs();
  const nextOrder = faqs.length ? Math.max(...faqs.map((f) => f.sort_order)) + 1 : 0;

  await upsertFaq({ question, answer, sortOrder: nextOrder, published: true });
  await logActivity(email, "faq_created", question);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
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
}

export async function removeFaq(id: string, question: string): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await deleteFaq(id);
  await logActivity(email, "faq_deleted", question);
  revalidatePath("/admin/faqs");
  revalidatePath("/faq");
}
