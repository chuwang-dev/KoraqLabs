"use server";

import { validateContactForm, type ContactFormValues } from "@/lib/validations";
import { siteConfig } from "@/lib/config";

export type ContactActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ContactFormValues, string>>;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactForm(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const values: ContactFormValues = {
    name: getString(formData, "name"),
    businessName: getString(formData, "businessName"),
    email: getString(formData, "email"),
    phone: getString(formData, "phone"),
    businessType: getString(formData, "businessType"),
    need: getString(formData, "need"),
    currentWebsite: getString(formData, "currentWebsite"),
    budget: getString(formData, "budget"),
    description: getString(formData, "description"),
    // Honeypot: bots tend to fill every field. If this has a value, silently
    // report success without sending anything.
    company: getString(formData, "company"),
  };

  if (values.company) {
    return { status: "success" };
  }

  const errors = validateContactForm(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields and try again.",
      errors,
    };
  }

  const apiKey = process.env.EMAIL_API_KEY;
  const to = process.env.EMAIL_TO ?? siteConfig.email;
  const from = process.env.EMAIL_FROM ?? "Koraq Labs <onboarding@koraqlabs.com>";

  const subject = `New project inquiry — ${values.businessName}`;
  const body = [
    `Name: ${values.name}`,
    `Business: ${values.businessName}`,
    `Email: ${values.email}`,
    `Phone/WhatsApp: ${values.phone}`,
    `Business type: ${values.businessType}`,
    `What they need: ${values.need}`,
    `Current website: ${values.currentWebsite || "None"}`,
    `Budget: ${values.budget}`,
    "",
    "Project description:",
    values.description,
  ].join("\n");

  try {
    if (apiKey) {
      // Uses Resend's HTTP API directly via fetch, so no extra dependency is
      // required. Swap the endpoint/body shape here if using a different
      // provider.
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          subject,
          text: body,
          reply_to: values.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email provider responded with ${response.status}`);
      }
    } else {
      // No email provider configured yet — log server-side so submissions
      // are not silently lost during early setup.
      console.warn(
        "EMAIL_API_KEY is not set. Contact form submission was not emailed:",
        { to, subject }
      );
    }

    return {
      status: "success",
      message: "Thanks — we've received your project details and will be in touch shortly.",
    };
  } catch (error) {
    console.error("Failed to send contact form email:", error);
    return {
      status: "error",
      message:
        "Something went wrong sending your message. Please try again or reach us on WhatsApp.",
    };
  }
}
