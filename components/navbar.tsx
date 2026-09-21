import Link from "next/link";
import Image from "next/image";
import { primaryNav } from "@/lib/config";
import { MobileMenu } from "@/components/mobile-menu";
import { CtaButton } from "@/components/cta-button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#C8A2C8]/30 bg-[#FBF6FB]/90 backdrop-blur">
      <div className="container-page flex h-[65px] items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-ink-900">
          <Image
            src="/images/koraq-labs-logo.png"
            alt="Koraq Labs"
            width={44}
            height={44}
            className="h-11 w-11 rounded-md bg-[#F3E7F3] p-1 object-contain shadow-[0_2px_10px_rgba(200,162,200,0.18)]"
            priority
          />
          <span className="font-display text-xl">Koraq Labs</span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[15px] text-ink-500 transition-colors duration-200 hover:text-ink-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <CtaButton href="/contact">Start a Project</CtaButton>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
