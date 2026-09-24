"use server";

import { validateContactForm, type ContactFormValues } from "@/lib/validations";
import { sendContactEmail } from "@/lib/mailer";
import { insertLead } from "@/lib/admin-data";
import { revalidatePath } from "next/cache";

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

  const stored = await insertLead({
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
  });

  if (!stored) {
    return {
      status: "error",
      message: "We could not save your project details. Please try again or reach us on WhatsApp.",
    };
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin/dashboard");

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
      status: "success",
      message: "Thanks — your project details were saved. We will be in touch shortly.",
    };
  }
}
