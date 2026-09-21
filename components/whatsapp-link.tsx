"use client";

import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

type WhatsappLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

export function WhatsappLink({ href, className, children }: WhatsappLinkProps) {
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
