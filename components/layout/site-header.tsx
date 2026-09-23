/**
 * site-header.tsx
 * Sticky top navigation bar: logo, nav links, search, actions.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserMenu } from "@/components/auth/user-menu";
import { HeaderSearch } from "@/components/layout/header-search";
import { DunesLogo } from "@/components/layout/nav-icons";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { navLinks } from "@/data/site";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-dune-900 bg-dune-970 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6">

        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <DunesLogo />
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold transition px-2.5 py-1 rounded-lg ${
                    isActive
                      ? "text-sun bg-dune-925 border border-dune-850"
                      : "text-dune-100 hover:text-white"
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
          <HeaderSearch />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
          <Link
            href="/launch"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-sun px-3.5 py-1.5 text-xs font-bold text-on-sun transition hover:bg-sun-bright shadow-sm"
          >
            <span>🚀</span>
            <span className="hidden sm:inline">Launch your project</span>
            <span className="sm:hidden">Launch</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
