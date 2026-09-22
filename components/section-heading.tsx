import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  supporting?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  title,
  supporting,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <h2 className="font-display text-3xl leading-[1.15] text-ink-900 md:text-4xl">
        {title}
      </h2>
      {supporting ? (
        <p className="mt-4 text-[17px] leading-relaxed text-ink-500">
          {supporting}
        </p>
      ) : null}
    </div>
  );
}
