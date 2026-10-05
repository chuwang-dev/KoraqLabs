"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { logActivity } from "@/lib/admin-data";
import type { SaveFormState } from "@/lib/admin-form-state";
import { normalizeSiteContent, saveSiteContent } from "@/lib/site-content";

export async function saveContent(
  _previousState: SaveFormState,
  formData: FormData
): Promise<SaveFormState> {
  const email = await getAdminEmail();
  if (!email) {
    return { status: "error", message: "Your session has expired — please log in again." };
  }

  const contentJson = formData.get("contentJson");
  if (typeof contentJson !== "string" || contentJson.length > 100_000) {
    return { status: "error", message: "The content is too large to save." };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(contentJson);
  } catch {
    return { status: "error", message: "The content could not be read. Review your changes and try again." };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { status: "error", message: "The content has an invalid format." };
  }

  const result = await saveSiteContent(normalizeSiteContent(parsed));
  if (!result.ok) return { status: "error", message: result.error };

  await logActivity(email, "site_content_updated", "Public website content updated");
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
  return { status: "success", message: "Site content saved and published." };
}