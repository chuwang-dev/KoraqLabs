"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/lib/config";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-ink-900/[0.09] bg-paper/85 backdrop-blur-md"
          : "border-transparent bg-paper"
      )}
    >
      <div className="container-page flex h-[68px] items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Koraq Labs home">
              <Image
                src="/images/koraq-labs-mark.png"
                alt=""
                width={490}
                height={439}
                priority
                className="h-7 w-auto"
              />
          <span className="text-[19px] text-ink-900 [font-family:var(--font-display)]">
            Koraq Labs
          </span>
        </Link>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {primaryNav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-[14px] transition-colors duration-200",
                      active ? "text-ink-900" : "text-ink-500 hover:text-ink-900"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Button href="/contact">Start a Project</Button>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
