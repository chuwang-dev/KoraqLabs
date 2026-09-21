export type ContactFormValues = {
  name: string;
  businessName: string;
  email: string;
  phone: string;
  businessType: string;
  need: string;
  currentWebsite: string;
  budget: string;
  description: string;
  // Honeypot field — real users never fill this in.
  company: string;
};

export type FieldErrors = Partial<Record<keyof ContactFormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accepts Nigerian and general international phone formats.
const PHONE_RE = /^[+]?[\d\s-]{7,15}$/;

export function validateContactForm(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = "Enter your full name.";
  }

  if (!values.businessName || values.businessName.trim().length < 2) {
    errors.businessName = "Enter your business name.";
  }

  if (!values.email || !EMAIL_RE.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phone || !PHONE_RE.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone or WhatsApp number.";
  }

  if (!values.businessType) {
    errors.businessType = "Select a business type.";
  }

  if (!values.need) {
    errors.need = "Let us know what you need.";
  }

  if (!values.budget) {
    errors.budget = "Select a budget range.";
  }

  if (!values.description || values.description.trim().length < 20) {
    errors.description = "Add a few sentences about your project (at least 20 characters).";
  }

  if (values.description && values.description.length > 4000) {
    errors.description = "Keep the description under 4000 characters.";
  }

  return errors;
}
