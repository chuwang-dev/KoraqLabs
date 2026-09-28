import type { Metadata } from "next";
import { getProjects } from "@/lib/admin-data";
import { PROJECT_STATUSES } from "@/lib/constants";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { StatusSelect } from "@/components/admin/status-select";
import { ToggleSwitch } from "@/components/admin/toggle-switch";
import { ProjectForm } from "@/components/admin/project-form";
import { changeProjectStatus, toggleProjectFeatured, removeProject } from "./actions";

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
          <ProjectForm />
        </details>
      )}

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 p-10 text-center text-sm text-ink-400">
          No projects yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.id} className="rounded-lg border border-ink-900/10 bg-paper-white">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className="font-medium text-ink-900">{p.name}</p>
                  <p className="text-xs text-ink-400">{p.client_name ?? "—"} {p.industry ? `· ${p.industry}` : ""}</p>
                </div>
                <div className="flex items-center gap-4">
                  <ToggleSwitch
                    id={p.id}
                    checked={p.featured}
                    label={p.featured ? "Featured" : "Not featured"}
                    action={toggleProjectFeatured}
                  />
                  <StatusSelect id={p.id} status={p.status} options={PROJECT_STATUSES} action={changeProjectStatus} />
                  {!usingDemoData && (
                    <form action={removeProject.bind(null, p.id, p.name)}>
                      <button type="submit" className="text-xs font-medium text-red-600 hover:underline">
                        Delete
                      </button>
                    </form>
                  )}
                </div>
              </div>
              {!usingDemoData && (
                <details className="border-t border-ink-900/5 px-5 py-3">
                  <summary className="cursor-pointer text-xs font-medium text-signal-600">Edit</summary>
                  <ProjectForm project={p} />
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
