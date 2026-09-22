// A small hand-drawn icon set (inline SVG, stroke-based) so the site doesn't
// depend on an icon package or stock imagery.

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconLayout({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9h18" />
      <path d="M9 9v11" />
    </svg>
  );
}

export function IconTarget({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconRefresh({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.66 5.66L4 16" />
      <path d="M4 20v-4h4" />
    </svg>
  );
}

export function IconServer({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3.5" y="4" width="17" height="6" rx="1.2" />
      <rect x="3.5" y="14" width="17" height="6" rx="1.2" />
      <circle cx="7.5" cy="7" r="0.6" fill="currentColor" />
      <circle cx="7.5" cy="17" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconHeart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 20s-7-4.35-9.5-9C1 7.5 3 4 6.5 4c2 0 3.5 1.2 4.5 2.5C12 5.2 13.5 4 15.5 4 19 4 21 7.5 19.5 11 17 15.65 12 20 12 20Z" />
    </svg>
  );
}

export function IconBuilding({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="5" y="3" width="10" height="18" rx="1" />
      <rect x="15" y="9" width="4" height="12" rx="1" />
      <path d="M8 7h1M8 11h1M8 15h1M11.5 7h1M11.5 11h1M11.5 15h1" />
    </svg>
  );
}

export function IconBed({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M3 18v-7a2 2 0 0 1 2-2h4.5" />
      <path d="M3 15h18v3" />
      <path d="M21 18v-4.5A2.5 2.5 0 0 0 18.5 11H11a2 2 0 0 0-2 2v2" />
      <circle cx="7.5" cy="10.5" r="1.3" />
    </svg>
  );
}

export function IconCart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7a2 2 0 0 0 2-1.6L20 8H6" />
      <circle cx="9.5" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
    </svg>
  );
}

export function IconCar({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 16V12l2-5h12l2 5v4" />
      <path d="M3 16h18" />
      <circle cx="7.5" cy="16.5" r="1.6" />
      <circle cx="16.5" cy="16.5" r="1.6" />
    </svg>
  );
}

export function IconBriefcase({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3" y="7.5" width="18" height="12" rx="1.5" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

export function IconBolt({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M13 2 4 13.5h6.5L11 22l9-11.5h-6.5L13 2Z" />
    </svg>
  );
}

export function IconSprout({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 21v-9" />
      <path d="M12 12c0-3.5-2.5-6-7-6 0 4.2 2.7 6.6 7 6.6Z" />
      <path d="M12 10c0-3 2-5.5 6-5.5 0 3.6-2.3 5.7-6 5.7Z" />
    </svg>
  );
}

export function IconArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function IconWhatsapp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.19-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.42 0 1.43 1.04 2.82 1.19 3.01.15.2 2.05 3.13 4.97 4.39.7.3 1.24.48 1.66.61.7.22 1.34.19 1.84.11.56-.08 1.75-.71 2-1.4.24-.68.24-1.27.17-1.4-.07-.13-.27-.2-.56-.35Z" />
      <path d="M12.04 2C6.55 2 2.1 6.4 2.1 11.83c0 1.86.52 3.6 1.42 5.09L2 22l5.27-1.46a10.06 10.06 0 0 0 4.77 1.21h.01c5.49 0 9.94-4.4 9.94-9.83C21.99 6.4 17.53 2 12.04 2Zm0 17.94h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.13.87.84-3.02-.2-.31a8.08 8.08 0 0 1-1.26-4.33c0-4.47 3.66-8.11 8.16-8.11 2.18 0 4.23.85 5.77 2.38a8.03 8.03 0 0 1 2.39 5.73c0 4.47-3.67 8.11-8.09 8.11Z" />
    </svg>
  );
}
