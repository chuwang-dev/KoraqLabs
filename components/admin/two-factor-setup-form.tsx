"use client";

import { useActionState } from "react";
import { initialSaveFormState } from "@/lib/admin-form-state";
import { verifyTwoFactorSetup } from "@/app/admin/(shell)/settings/two-factor/actions";
import { SaveButton, FormStatusBanner } from "@/components/admin/form-status";

export function TwoFactorSetupForm({ secret }: { secret: string }) {
  const [state, formAction] = useActionState(verifyTwoFactorSetup, initialSaveFormState);
  return (
    <form action={formAction} className="mt-4 space-y-3">
      <input type="hidden" name="secret" value={secret} />
      <FormStatusBanner state={state} />
      <input
        name="code"
        inputMode="numeric"
        autoComplete="off"
        maxLength={7}
        required
        placeholder="6-digit code"
        className="admin-input max-w-[200px] font-mono tracking-[0.2em]"
      />
      <div>
        <SaveButton label="Verify code" savingLabel="Checking…" />
      </div>
    </form>
  );
}
