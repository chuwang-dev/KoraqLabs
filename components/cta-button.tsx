"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type CtaButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
  external?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded px-5 py-3 text-[15px] font-medium transition-colors duration-200 ease-smooth focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
  primary:
    "bg-[#C8A2C8] text-[#1d1721] shadow-[0_10px_25px_rgba(200,162,200,0.42)] hover:bg-[#B98FB9]",
  secondary:
    "border border-[#C8A2C8]/70 bg-[#F9F2F9] text-[#1d1721] hover:border-[#B98FB9] hover:bg-[#F1E5F1]",
  ghost: "text-ink-900 hover:text-[#8D6F8D]",
};

export function CtaButton({
  href,
  children,
  variant = "primary",
  className,
  onClick,
  external,
}: CtaButtonProps) {
  const handleClick = () => {
    trackEvent("cta_click", { href, label: typeof children === "string" ? children : "" });
    onClick?.();
  };

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={cn(base, variants[variant], className)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
