import { cn } from "@/lib/utils";
import Image from "next/image";

// A lightweight, abstract "browser window" used to represent a website
// without relying on stock photography. Each mockup is built from simple
// blocks so it reads as a layout, not a screenshot.

type BrowserMockupProps = {
  label: string;
  accent?: boolean;
  className?: string;
  image?: string;
};

export function BrowserMockup({ label, accent, className, image }: BrowserMockupProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-md border border-ink-900/10 bg-white shadow-[0_1px_0_rgba(18,21,26,0.04)]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-ink-900/10 px-3 py-2.5">
        <span className="h-2 w-2 rounded-full bg-ink-900/15" />
        <span className="h-2 w-2 rounded-full bg-ink-900/15" />
        <span className="h-2 w-2 rounded-full bg-ink-900/15" />
        <span className="ml-2 h-2 w-24 rounded-full bg-ink-900/10" />
      </div>
      {image ? (
        <div className="relative aspect-[2/1] w-full bg-ink-900/5">
          <Image
            src={image}
            alt={`${label} landing page preview`}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      ) : (
      <div className="space-y-3 p-4">
        <div
          className={cn(
            "h-3 w-2/3 rounded-full",
            accent ? "bg-signal-400" : "bg-ink-900/15"
          )}
        />
        <div className="h-2 w-full rounded-full bg-ink-900/[0.08]" />
        <div className="h-2 w-4/5 rounded-full bg-ink-900/[0.08]" />
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="h-10 rounded bg-ink-900/[0.06]" />
          <div className="h-10 rounded bg-ink-900/[0.06]" />
          <div className="h-10 rounded bg-ink-900/[0.06]" />
        </div>
        <p className="pt-1 text-[12px] font-medium text-ink-400">{label}</p>
      </div>
      )}
    </div>
  );
}
