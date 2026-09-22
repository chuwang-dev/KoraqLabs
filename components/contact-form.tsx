"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitContactForm, type ContactActionState } from "@/app/actions/contact";
import { budgetRanges, businessTypes, projectNeeds } from "@/lib/data";
import { FieldWrapper, inputClass } from "@/components/form-field";
import { trackEvent } from "@/lib/analytics";

const initialState: ContactActionState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded bg-ink-900 px-5 py-3.5 text-[15px] font-medium text-paper transition-colors duration-200 hover:bg-ink-700 disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Sending…" : "Start My Project"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("contact_form_submit");
      formRef.current?.reset();
    }
  }, [state.status]);

  const errors = state.errors ?? {};

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-6">
      {/* Honeypot — hidden from real visitors, catches basic bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <FieldWrapper label="Name" htmlFor="name" error={errors.name}>
          <input id="name" name="name" type="text" required className={inputClass} placeholder="Your full name" />
        </FieldWrapper>

        <FieldWrapper label="Business name" htmlFor="businessName" error={errors.businessName}>
          <input
            id="businessName"
            name="businessName"
            type="text"
            required
            className={inputClass}
            placeholder="Your business name"
          />
        </FieldWrapper>

        <FieldWrapper label="Email" htmlFor="email" error={errors.email}>
          <input id="email" name="email" type="email" required className={inputClass} placeholder="you@business.com" />
        </FieldWrapper>

        <FieldWrapper label="Phone / WhatsApp" htmlFor="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" required className={inputClass} placeholder="0801 234 5678" />
        </FieldWrapper>

        <FieldWrapper label="Business type" htmlFor="businessType" error={errors.businessType}>
          <select id="businessType" name="businessType" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select your industry
            </option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FieldWrapper>

        <FieldWrapper label="What do you need?" htmlFor="need" error={errors.need}>
          <select id="need" name="need" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select an option
            </option>
            {projectNeeds.map((need) => (
              <option key={need} value={need}>
                {need}
              </option>
            ))}
          </select>
        </FieldWrapper>

        <FieldWrapper label="Current website URL" htmlFor="currentWebsite" optional>
          <input
            id="currentWebsite"
            name="currentWebsite"
            type="text"
            className={inputClass}
            placeholder="If you already have one"
          />
        </FieldWrapper>

        <FieldWrapper label="Budget range" htmlFor="budget" error={errors.budget}>
          <select id="budget" name="budget" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              Select a range
            </option>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </FieldWrapper>
      </div>

      <FieldWrapper label="Project description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className={inputClass}
          placeholder="Tell us about your business and what you'd like your website to do."
        />
      </FieldWrapper>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SubmitButton />
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
