import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { ConsentPreferences } from "@/components/consent-preferences";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects and uses information on this website.`,
};

const UPDATED = "September 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl italic text-ink-900 md:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-ink-500">Last updated: {UPDATED}</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-700">
        <section>
          <h2 className="mb-2 font-display text-2xl italic text-ink-900">Who we are</h2>
          <p>
            {siteConfig.name} is a Nigerian digital product studio. This policy explains what information
            this website collects, why, and the choices you have. For any privacy question, email{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-signal-600 underline underline-offset-2">
              {siteConfig.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-2xl italic text-ink-900">Information you give us</h2>
          <p>
            When you submit the project inquiry form, we receive the details you enter: your name, business
            name, email address, phone number, business type, the service you&rsquo;re interested in, your
            budget range, any website URL, and your message. We use this only to respond to your inquiry
            and to manage our working relationship with you if you become a client. We keep inquiry records
            for as long as needed for that purpose, and you can ask us to delete yours at any time.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-2xl italic text-ink-900">Analytics (only with your consent)</h2>
          <p>
            If you accept analytics, we record which pages you view and a few actions (such as clicking a
            call-to-action or the WhatsApp link), together with a random session identifier, your device
            type, browser, operating system, how you arrived (for example from Google or directly), and a
            coarse country/city derived from your connection where our hosting provides it.
          </p>
          <p className="mt-3">
            We <strong>do not</strong> store your IP address, your name, or precise location in our analytics,
            and we do not try to identify individual visitors. If you decline, none of this is collected. We
            may also use Google Analytics if it is enabled on the site; its script is only loaded after you
            accept, and you can change your choice below at any time.
          </p>
          <ConsentPreferences />
        </section>

        <section>
          <h2 className="mb-2 font-display text-2xl italic text-ink-900">Cookies and local storage</h2>
          <p>
            The public site stores your analytics choice in your browser&rsquo;s local storage, and a random
            session identifier in session storage while analytics is allowed (it disappears when you close
            the tab). Our private administration area uses a secure, HTTP-only cookie to keep administrators
            signed in; visitors never receive it.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-2xl italic text-ink-900">Who we share information with</h2>
          <p>
            We don&rsquo;t sell your information. We rely on service providers to run the site (hosting,
            our database, email delivery, and analytics tools), who process data on our behalf only for
            those purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-2xl italic text-ink-900">Your rights</h2>
          <p>
            You can ask to access, correct, or delete the personal information we hold about you, or to
            withdraw consent to analytics, by emailing us or using the controls above. We will respond within
            a reasonable time.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-2xl italic text-ink-900">Changes</h2>
          <p>
            If we change how we handle information, we will update this page and the date above.
          </p>
        </section>
      </div>
    </div>
  );
}
