"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, verifyTwoFactor, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = { status: "idle" };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-2 rounded bg-ink-900 px-6 py-3.5 text-[15px] font-medium text-paper transition-colors duration-200 hover:bg-ink-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-paper/30 border-t-paper" />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}

function ErrorBanner({ state }: { state: LoginState }) {
  if (!state.message || (state.status !== "error" && state.status !== "expired")) return null;
  return (
    <div role="alert" className="rounded border border-red-500/25 bg-red-500/5 px-4 py-3 text-sm text-red-700">
      {state.message}
    </div>
  );
}

const inputClass =
  "w-full rounded border border-ink-900/15 bg-paper-white px-3.5 py-2.5 text-[15px] text-ink-900 outline-none transition-colors focus:border-signal-500";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [loginState, loginAction] = useFormState(login, initialState);
  const [codeState, codeAction] = useFormState(verifyTwoFactor, initialState);

  const needsCode = loginState.status === "needs_code" && codeState.status !== "expired";

  if (needsCode) {
    return (
      <form action={codeAction} className="space-y-5">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <p className="text-sm text-ink-600">
          Enter the 6-digit code from your authenticator app to finish signing in.
        </p>
        <ErrorBanner state={codeState} />
        <div className="space-y-1.5">
          <label htmlFor="code" className="text-sm font-medium text-ink-800">
            Authentication code
          </label>
          <input
            id="code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            maxLength={7}
            required
            autoFocus
            className={`${inputClass} font-mono tracking-[0.3em]`}
          />
        </div>
        <SubmitButton label="Verify" pendingLabel="Verifying…" />
      </form>
    );
  }

  return (
    <form action={loginAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <ErrorBanner state={codeState.status === "expired" ? codeState : loginState} />

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink-800">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputClass} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink-800">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      <SubmitButton label="Sign in" pendingLabel="Signing in…" />
    </form>
  );
}
