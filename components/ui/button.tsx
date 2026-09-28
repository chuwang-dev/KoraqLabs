"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "onDark";
  size?: "md" | "lg";
  className?: string;
  external?: boolean;
  download?: boolean;
  onClick?: () => void;
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-200 ease-smooth";

const sizes = {
  md: "px-5 py-2.5 text-[14px]",
  lg: "px-6 py-3.5 text-[15px]",
};

const variants = {
  primary: "bg-ink-900 text-paper hover:bg-ink-700",
  secondary:
    "border border-ink-900/15 bg-transparent text-ink-900 hover:border-ink-900/35 hover:bg-ink-900/[0.03]",
  ghost: "text-ink-600 hover:text-ink-900",
  onDark: "bg-paper text-ink-900 hover:bg-ink-100",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  download,
  onClick,
}: ButtonProps) {
  const classes = cn(base, sizes[size], variants[variant], className);

  const handleClick = () => {
    trackEvent("cta_click", { href });
    onClick?.();
  };

  if (external || download) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={classes}
        {...(download
          ? { download: "" }
          : { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className={classes}>
      {children}
    </Link>
  );
}
