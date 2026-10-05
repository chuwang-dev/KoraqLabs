"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { FormStatusBanner, SaveButton } from "@/components/admin/form-status";
import { initialSaveFormState } from "@/lib/admin-form-state";
import { changeAdminPassword } from "@/app/admin/(shell)/settings/actions";

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changeAdminPassword, initialSaveFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="mt-4 space-y-4">
      <FormStatusBanner state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-ink-600 sm:col-span-2">
          Current password
          <input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className="admin-input mt-1"
          />
        </label>
        <label className="text-sm text-ink-600">
          New password
          <input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={72}
            required
            className="admin-input mt-1"
          />
        </label>
        <label className="text-sm text-ink-600">
          Confirm new password
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={72}
            required
            className="admin-input mt-1"
          />
        </label>
      </div>
      <SaveButton label="Change password" savingLabel="Updating…" />
    </form>
  );
}