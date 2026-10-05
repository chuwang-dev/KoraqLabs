"use server";

import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import {
  deleteProject,
  logActivity,
  PROJECT_STATUSES,
  updateProjectFeatured,
  updateProjectStatus,
  upsertProject,
} from "@/lib/admin-data";
import type { SaveFormState } from "@/lib/admin-form-state";

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

export async function saveProject(_prevState: SaveFormState, formData: FormData): Promise<SaveFormState> {
  const email = await getAdminEmail();
  if (!email) return { status: "error", message: "Your session has expired — please log in again." };

  const name = getString(formData, "name");
  if (!name) return { status: "error", message: "Project name is required." };

  const id = getString(formData, "id") || undefined;
  const status = getString(formData, "status") || "planning";
  const technologies = getString(formData, "technologies")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const result = await upsertProject({
    id,
    slug: slugify(getString(formData, "slug") || name),
    name,
    clientName: getString(formData, "clientName") || undefined,
    industry: getString(formData, "industry") || undefined,
    description: getString(formData, "description") || undefined,
    projectType: getString(formData, "projectType") || undefined,
    technologies,
    websiteUrl: getString(formData, "websiteUrl") || undefined,
    thumbnailUrl: getString(formData, "thumbnailUrl") || undefined,
    status: PROJECT_STATUSES.includes(status as (typeof PROJECT_STATUSES)[number]) ? status : "planning",
    featured: formData.get("featured") === "on",
  });

  if (!result.ok) {
    return { status: "error", message: result.error };
  }

  await logActivity(email, id ? "project_updated" : "project_created", name);
  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/sitemap.xml");
  return { status: "success", message: id ? "Project updated." : "Project added." };
}

export async function changeProjectStatus(id: string, status: string): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await updateProjectStatus(id, status);
  await logActivity(email, "project_updated", `Status → ${status}`);
  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export async function toggleProjectFeatured(id: string, featured: boolean): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await updateProjectFeatured(id, featured);
  await logActivity(email, "project_updated", featured ? "Marked featured" : "Unmarked featured");
  revalidatePath("/admin/projects");
  revalidatePath("/work");
}

export async function removeProject(id: string, name: string): Promise<void> {
  const email = await getAdminEmail();
  if (!email) return;
  await deleteProject(id);
  await logActivity(email, "project_deleted", name);
  revalidatePath("/admin/projects");
  revalidatePath("/work");
  revalidatePath("/work/[slug]", "page");
  revalidatePath("/sitemap.xml");
}
