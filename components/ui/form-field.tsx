import { cn } from "@/lib/utils";

export function FieldWrapper({
  label,
  htmlFor,
  error,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-400"
      >
        {label}
        {optional ? <span className="ml-1.5 normal-case tracking-normal">(optional)</span> : null}
      </label>
      <div className="mt-2.5">{children}</div>
      {error ? (
        <p className="mt-2 text-[13px] text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass = cn(
  "w-full rounded border border-ink-900/12 bg-paper px-3.5 py-3 text-[15px] text-ink-900 outline-none transition-colors duration-150",
  "placeholder:text-ink-300 hover:border-ink-900/20 focus:border-signal-400"
);
