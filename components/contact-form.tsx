"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactActionState } from "@/app/actions/contact";
import { FieldWrapper, inputClass } from "@/components/form-field";
import { trackEvent } from "@/lib/analytics";
import type { SiteContent } from "@/lib/site-content";

const initialState: ContactActionState = { status: "idle" };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded bg-ink-900 px-5 py-3.5 text-[15px] font-medium text-paper transition-colors duration-200 hover:bg-ink-700 disabled:opacity-60 sm:w-auto"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function ContactForm({ content }: { content: SiteContent }) {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const form = content.form;
  const fields = form.fields;

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("contact_form_submit");
      formRef.current?.reset();
    }
  }, [state.status]);

  const errors = state.errors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      <input type="hidden" name="validationMessage" value={form.validationMessage} />
      <input type="hidden" name="successMessage" value={form.successMessage} />
      <input type="hidden" name="errorMessage" value={form.errorMessage} />
      {/* Honeypot — hidden from real visitors, catches basic bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldWrapper label={fields.name.label} htmlFor="name" error={errors.name}>
          <input id="name" name="name" type="text" required className={inputClass} placeholder={fields.name.placeholder} />
        </FieldWrapper>

        <FieldWrapper label={fields.businessName.label} htmlFor="businessName" error={errors.businessName}>
          <input
            id="businessName"
            name="businessName"
            type="text"
            required
            className={inputClass}
            placeholder={fields.businessName.placeholder}
          />
        </FieldWrapper>

        <FieldWrapper label={fields.email.label} htmlFor="email" error={errors.email}>
          <input id="email" name="email" type="email" required className={inputClass} placeholder={fields.email.placeholder} />
        </FieldWrapper>

        <FieldWrapper label={fields.phone.label} htmlFor="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" required className={inputClass} placeholder={fields.phone.placeholder} />
        </FieldWrapper>

        <FieldWrapper label={fields.businessType.label} htmlFor="businessType" error={errors.businessType}>
          <select id="businessType" name="businessType" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              {fields.businessType.placeholder}
            </option>
            {content.collections.businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FieldWrapper>

        <FieldWrapper label={fields.need.label} htmlFor="need" error={errors.need}>
          <select id="need" name="need" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              {fields.need.placeholder}
            </option>
            {content.collections.projectNeeds.map((need) => (
              <option key={need} value={need}>
                {need}
              </option>
            ))}
          </select>
        </FieldWrapper>

        <FieldWrapper label={fields.currentWebsite.label} htmlFor="currentWebsite" optional>
          <input
            id="currentWebsite"
            name="currentWebsite"
            type="text"
            className={inputClass}
            placeholder={fields.currentWebsite.placeholder}
          />
        </FieldWrapper>

        <FieldWrapper label={fields.budget.label} htmlFor="budget" error={errors.budget}>
          <select id="budget" name="budget" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              {fields.budget.placeholder}
            </option>
            {content.collections.budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </FieldWrapper>
      </div>

      <FieldWrapper label={fields.description.label} htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className={inputClass}
          placeholder={fields.description.placeholder}
        />
      </FieldWrapper>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SubmitButton label={form.submitLabel} pendingLabel={form.submittingLabel} />
        {state.status === "success" ? (
          <p role="status" className="text-[14px] text-signal-700">
            {state.message}
          </p>
        ) : null}
        {state.status === "error" && state.message ? (
          <p role="alert" className="text-[14px] text-red-600">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
