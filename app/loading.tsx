import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="relative flex h-16 w-16 items-center justify-center">
        <Image
          src="/images/koraq-labs-logo.png"
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-md object-contain"
          priority
        />
        <span className="absolute inset-0 animate-spin rounded-full border-[1.5px] border-ink-900/15 border-t-ink-900" />
      </span>
      <span className="sr-only">Loading</span>
    </div>
  );
}