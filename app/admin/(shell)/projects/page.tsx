import type { Metadata } from "next";
import { getProjects, PROJECT_STATUSES } from "@/lib/admin-data";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { StatusSelect } from "@/components/admin/status-select";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { createProject, changeProjectStatus, toggleProjectFeatured, removeProject } from "./actions";

export const metadata: Metadata = { title: "Projects — Koraq Labs Admin" };

export default async function ProjectsPage() {
  const { projects, usingDemoData } = await getProjects();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl italic text-ink-900">Projects</h1>
          <p className="mt-1 text-sm text-ink-500">Manage portfolio entries shown on /work.</p>
        </div>
        {usingDemoData ? <DemoDataBadge /> : null}
      </div>

      {usingDemoData ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 bg-paper-white p-5 text-sm text-ink-500">
          Connect <code className="font-mono text-xs">DATABASE_URL</code> to add, edit, or feature real
          projects. The list below shows two demo entries for layout reference only.
        </div>
      ) : (
        <details className="rounded-lg border border-ink-900/10 bg-paper-white p-5">
          <summary className="cursor-pointer text-sm font-semibold text-ink-800">
            + Add a project
          </summary>
          <form action={createProject} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input name="name" required placeholder="Project name" className="admin-input" />
            <input name="slug" placeholder="URL slug (optional, derived from name)" className="admin-input" />
            <input name="clientName" placeholder="Client / business" className="admin-input" />
            <input name="industry" placeholder="Industry" className="admin-input" />
            <input name="projectType" placeholder="Project type (e.g. Landing page)" className="admin-input" />
            <input name="websiteUrl" placeholder="Website URL" className="admin-input" />
            <input name="thumbnailUrl" placeholder="Thumbnail image URL" className="admin-input" />
            <input name="technologies" placeholder="Technologies, comma separated" className="admin-input" />
            <select name="status" defaultValue="planning" className="admin-input">
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" name="featured" className="h-4 w-4 rounded border-ink-900/25" />
              Featured
            </label>
            <textarea
              name="description"
              placeholder="Short description"
              rows={3}
              className="admin-input sm:col-span-2"
            />
            <button
              type="submit"
              className="w-fit rounded bg-ink-900 px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink-700 sm:col-span-2"
            >
              Add project
            </button>
          </form>
        </details>
      )}

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-400">
          No projects yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ink-900/10 bg-paper-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="px-4 py-3 font-medium">Project</th>
                <th className="px-4 py-3 font-medium">Industry</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-ink-900/5 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900">{p.name}</p>
                    <p className="text-xs text-ink-400">{p.client_name ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{p.industry ?? "—"}</td>
                  <td className="px-4 py-3">
                    <ToggleSwitch
                      id={p.id}
                      checked={p.featured}
                      label={p.featured ? "Yes" : "No"}
                      action={toggleProjectFeatured}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <StatusSelect id={p.id} status={p.status} options={PROJECT_STATUSES} action={changeProjectStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!usingDemoData && (
                      <form action={removeProject.bind(null, p.id, p.name)}>
                        <button
                          type="submit"
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
