"use client";

import { useFormState } from "react-dom";
import type { Project } from "@/lib/admin-data";
import { PROJECT_STATUSES } from "@/lib/constants";
import { initialSaveFormState } from "@/lib/admin-form-state";
import { saveProject } from "@/app/admin/(shell)/projects/actions";
import { SaveButton, FormStatusBanner } from "@/components/admin/form-status";
import { ImageUploadField } from "@/components/admin/image-upload-field";

export function ProjectForm({ project }: { project?: Project }) {
  const [state, formAction] = useFormState(saveProject, initialSaveFormState);

  return (
    <form action={formAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <FormStatusBanner state={state} />

      <input
        name="name"
        required
        placeholder="Project name"
        defaultValue={project?.name}
        className="admin-input"
      />
      <input
        name="slug"
        placeholder="URL slug (optional, derived from name)"
        defaultValue={project?.slug}
        className="admin-input"
      />
      <input
        name="clientName"
        placeholder="Client / business"
        defaultValue={project?.client_name ?? ""}
        className="admin-input"
      />
      <input
        name="industry"
        placeholder="Industry"
        defaultValue={project?.industry ?? ""}
        className="admin-input"
      />
      <input
        name="projectType"
        placeholder="Project type (e.g. Landing page)"
        defaultValue={project?.project_type ?? ""}
        className="admin-input"
      />
      <input
        name="websiteUrl"
        placeholder="Website URL"
        defaultValue={project?.website_url ?? ""}
        className="admin-input"
      />
      <ImageUploadField name="thumbnailUrl" defaultValue={project?.thumbnail_url} placeholder="Thumbnail image URL, or upload" />
      <input
        name="technologies"
        placeholder="Technologies, comma separated"
        defaultValue={project?.technologies?.join(", ") ?? ""}
        className="admin-input"
      />
      <select name="status" defaultValue={project?.status ?? "planning"} className="admin-input">
        {PROJECT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm text-ink-600">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={project?.featured ?? false}
          className="h-4 w-4 rounded border-ink-900/25"
        />
        Featured
      </label>
      <textarea
        name="description"
        placeholder="Short description"
        rows={3}
        defaultValue={project?.description ?? ""}
        className="admin-input sm:col-span-2"
      />
      <div className="sm:col-span-2">
        <SaveButton label={project ? "Save changes" : "Add project"} savingLabel="Saving…" />
      </div>
    </form>
  );
}
