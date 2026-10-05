import type { Metadata } from "next";
import { ConsentPreferences } from "@/components/consent-preferences";
import { getSiteContent } from "@/lib/site-content";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getSiteContent();
  return {
    title: content.pages.privacy.seoTitle,
    description: content.pages.privacy.seoDescription,
  };
}

export default async function PrivacyPage() {
  const [{ content }, { settings }] = await Promise.all([
    getSiteContent(),
    getSiteSettings(),
  ]);
  const page = content.pages.privacy;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <p className="eyebrow">{page.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl italic text-ink-900 md:text-5xl">{page.title}</h1>
      <p className="mt-3 text-sm text-ink-500">Last updated: {page.updated}</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-700">
        {page.sections.map((section, sectionIndex) => (
          <section key={`${section.heading}-${sectionIndex}`}>
            <h2 className="mb-2 font-display text-2xl italic text-ink-900">{section.heading}</h2>
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={`${section.heading}-${paragraphIndex}`} className={paragraphIndex ? "mt-3" : undefined}>
                {paragraph
                  .replaceAll("{siteName}", settings.name)
                  .replaceAll("{email}", settings.email)}
              </p>
            ))}
            {section.showConsentPreferences ? <ConsentPreferences content={content.consent} /> : null}
          </section>
        ))}
      </div>
    </div>
  );
}
