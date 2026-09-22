"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = { status: "idle" };

function SubmitButton() {
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
          Signing in…
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="rounded border border-red-500/25 bg-red-500/5 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full rounded border border-ink-900/15 bg-paper-white px-3.5 py-2.5 text-[15px] text-ink-900 outline-none transition-colors focus:border-signal-500"
        />
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
          className="w-full rounded border border-ink-900/15 bg-paper-white px-3.5 py-2.5 text-[15px] text-ink-900 outline-none transition-colors focus:border-signal-500"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
