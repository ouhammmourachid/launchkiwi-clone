/**
 * site-header.tsx
 * Sticky top navigation bar: logo, nav links, search, actions.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/data/site";
import {
  KiwiLogo,
  SearchIcon,
  SunIcon,
} from "@/components/layout/nav-icons";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[#1b1f14] bg-[#0a0c07] sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <KiwiLogo />
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold transition px-2.5 py-1 rounded-lg ${
                    isActive
                      ? "text-[#86ba28] bg-[#141810] border border-[#23291b]"
                      : "text-[#c5ceb8] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search bar */}
        <div className="hidden flex-1 items-center justify-center px-6 lg:flex">
          <div className="relative w-full max-w-[360px]">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78826b]">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search projects, tools or tags..."
              className="w-full rounded-full border border-[#23291b] bg-[#141810] py-2 pl-9 pr-4 text-xs text-white placeholder:text-[#6e7760] outline-none focus:border-[#86ba28] transition"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#23291b] bg-[#141810] transition hover:bg-[#1a2015]"
            aria-label="Toggle theme"
          >
            <SunIcon />
          </button>
          <button
            type="button"
            className="text-xs font-semibold text-[#c5ceb8] transition hover:text-white px-2 py-1"
          >
            Sign In
          </button>
          <Link
            href="/launch"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#86ba28] px-3.5 py-1.5 text-xs font-bold text-[#0a0d06] transition hover:bg-[#96cc2e] shadow-sm"
          >
            <span>🚀</span>
            <span>Launch your project</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
