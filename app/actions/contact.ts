"use server";

import { validateContactForm, type ContactFormValues } from "@/lib/validations";
import { sendContactEmail } from "@/lib/mailer";
import { insertLead } from "@/lib/admin-data";

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

  // Best-effort: record the lead even if the notification email fails, and
  // vice versa — a DB hiccup should never be the reason a real inquiry is
  // lost, and a slow DB should never block a visitor's confirmation.
  insertLead({
    name: values.name,
    businessName: values.businessName,
    email: values.email,
    phone: values.phone,
    businessType: values.businessType,
    need: values.need,
    currentWebsite: values.currentWebsite,
    budget: values.budget,
    description: values.description,
    source: getString(formData, "source") || "direct",
    landingPage: getString(formData, "landingPage") || undefined,
  }).catch((error) => {
    console.error("Failed to store lead in database:", error);
  });

  try {
    await sendContactEmail({
      name: values.name,
      businessName: values.businessName,
      email: values.email,
      phone: values.phone,
      businessType: values.businessType,
      need: values.need,
      currentWebsite: values.currentWebsite,
      budget: values.budget,
      description: values.description,
    });

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
