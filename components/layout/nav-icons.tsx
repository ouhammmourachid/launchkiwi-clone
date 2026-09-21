/**
 * nav-icons.tsx
 * Small, focused SVG icon components used in the site shell (header/footer).
 * Each is a plain function component with no props — size is baked into className.
 */

export function KiwiLogo() {
  return (
    <div className="flex items-center gap-2">
      <svg className="h-6 w-6 text-[#86ba28]" viewBox="0 0 32 32" fill="currentColor">
        <path d="M16 4C9.37 4 4 9.37 4 16c0 3.31 1.34 6.31 3.51 8.49l-2.8 2.8a1 1 0 0 0 .71 1.71h10.17c8.84 0 16-7.16 16-16C31.59 9.37 22.63 4 16 4zm-4 8a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
        <circle cx="10.5" cy="9.5" r="1.5" fill="#0b0d08" />
        <path d="M26 14c-1.5 0-3 1.5-5 1.5s-3.5-1.5-5-1.5-3 1-4 2" stroke="#0b0d08" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <span className="text-xl font-black tracking-tight text-white">
        Launch<span className="text-[#86ba28]">Kiwi</span>
      </span>
    </div>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function RssIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  );
}

export function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#a6b194]">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

export function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#86ba28]">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}
