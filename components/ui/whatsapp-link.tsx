"use client";

import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

export function WhatsappLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click")}
      className={cn(className)}
    >
      {children}
    </a>
  );
}
