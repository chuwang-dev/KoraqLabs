"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { getLeadById, logActivity, updateLeadStatus } from "@/lib/admin-data";

export async function changeLeadStatus(id: string, status: string): Promise<void> {
  const [email, lead] = await Promise.all([getAdminEmail(), getLeadById(id)]);
  if (!email) return;

  const ok = await updateLeadStatus(id, status);
  if (ok && lead) {
    await logActivity(
      email,
      "lead_status_change",
      `${lead.business_name} changed ${lead.status} → ${status}`
    );
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin/dashboard");
}
