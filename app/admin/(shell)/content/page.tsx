import type { Metadata } from "next";
import { DemoDataBadge } from "@/components/admin/demo-data-badge";
import { SiteContentEditor } from "@/components/admin/site-content-editor";
import { defaultSiteContent, getSiteContent } from "@/lib/site-content";

export const metadata: Metadata = { title: "Site Content — Koraq Labs Admin" };

export default async function ContentPage() {
  const { content, usingDemoData } = await getSiteContent();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl italic text-ink-900">Site Content</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-500">
            Edit public page copy, lists, calls to action, and homepage section visibility. Changes publish across the site when saved.
          </p>
        </div>
        {usingDemoData ? <DemoDataBadge /> : null}
      </div>

      {usingDemoData ? (
        <div className="rounded-lg border border-dashed border-ink-900/15 bg-paper-white p-5 text-sm text-ink-500">
          Connect <code className="font-mono text-xs">DATABASE_URL</code> to save site content. Until then, the public site uses its built-in defaults.
        </div>
      ) : null}

      {!usingDemoData ? <SiteContentEditor content={content} templates={defaultSiteContent} /> : null}
    </div>
  );
}