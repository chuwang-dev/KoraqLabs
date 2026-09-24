"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { deleteProject, logActivity, PROJECT_STATUSES, updateProjectFeatured, updateProjectStatus, upsertProject } from "@/lib/admin-data";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createProject(formData: FormData): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;

  const name = getString(formData, "name");
  if (!name) return;

  const status = getString(formData, "status") || "live";
  const technologies = getString(formData, "technologies")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await upsertProject({
    slug: slugify(getString(formData, "slug") || name),
    name,
    clientName: getString(formData, "clientName") || undefined,
    industry: getString(formData, "industry") || undefined,
    description: getString(formData, "description") || undefined,
    projectType: getString(formData, "projectType") || undefined,
    technologies,
    websiteUrl: getString(formData, "websiteUrl") || undefined,
    thumbnailUrl: getString(formData, "thumbnailUrl") || undefined,
    status: PROJECT_STATUSES.includes(status as (typeof PROJECT_STATUSES)[number]) ? status : "live",
    featured: formData.get("featured") === "on",
  });

  await logActivity(email, "project_created", name);
  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/");
}

export async function changeProjectStatus(id: string, status: string): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await updateProjectStatus(id, status);
  await logActivity(email, "project_updated", `Status → ${status}`);
  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/");
}

export async function toggleProjectFeatured(id: string, featured: boolean): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await updateProjectFeatured(id, featured);
  await logActivity(email, "project_updated", featured ? "Marked featured" : "Unmarked featured");
  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/");
}

export async function removeProject(id: string, name: string): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await deleteProject(id);
  await logActivity(email, "project_deleted", name);
  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/");
}
