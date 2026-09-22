import { cn } from "@/lib/utils";

type FieldWrapperProps = {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
};

export function FieldWrapper({ label, htmlFor, error, optional, children }: FieldWrapperProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-[14px] font-medium text-ink-800">
        {label}
        {optional ? <span className="ml-1 font-normal text-ink-400">(optional)</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1.5 text-[13px] text-red-600">{error}</p> : null}
    </div>
  );
}

export const inputClass = cn(
  "w-full rounded border border-ink-900/15 bg-paper px-3.5 py-2.5 text-[15px] text-ink-900 outline-none transition-colors duration-150",
  "placeholder:text-ink-300 focus:border-ink-900/40"
);
