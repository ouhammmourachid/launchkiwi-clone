/**
 * site-header.tsx
 * Sticky top navigation bar: logo, nav links, search, actions.
 * Below `md` the nav, search and sign-in move into the MobileMenu panel.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { UserMenu } from "@/components/auth/user-menu";
import { HeaderSearch } from "@/components/layout/header-search";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { CloseIcon, DunesLogo, MenuIcon, RocketIcon } from "@/components/layout/nav-icons";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { navLinks } from "@/data/site";

const MOBILE_MENU_ID = "mobile-menu";

export function SiteHeader() {
  const pathname = usePathname();
  // The menu remembers the page it was opened on, so navigating anywhere closes it.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const closeMenu = () => setMenuPath(null);
  // The panel covers the viewport from the header's bottom edge down (the banner may be scrolled away).
  const headerRef = useRef<HTMLElement>(null);
  const [menuTop, setMenuTop] = useState(0);
  const measureMenuTop = () => setMenuTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);

  const toggleMenu = () => {
    if (menuOpen) return closeMenu();
    measureMenuTop();
    setMenuPath(pathname);
  };

  // While open: lock page scroll, close on Escape, and close if the screen grows past `md`.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuPath(null);
    const onResize = () => (window.innerWidth >= 768 ? setMenuPath(null) : measureMenuTop());
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-dune-900 bg-dune-970">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between gap-2 px-4 sm:px-6">

        {/* Menu toggle (phones) + Logo + Nav */}
        <div className="flex items-center gap-2.5 md:gap-4 lg:gap-6">
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dune-850 bg-dune-925 text-dune-100 transition hover:border-dune-750 hover:text-white md:hidden"
          >
            {menuOpen ? <CloseIcon className="h-[18px] w-[18px]" /> : <MenuIcon className="h-[18px] w-[18px]" />}
          </button>

          <Link href="/" aria-label="LaunchDunes home" className="flex shrink-0 items-center gap-2">
            <DunesLogo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex lg:gap-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap text-xs font-semibold transition px-2 lg:px-2.5 py-1 rounded-lg ${
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
        <div className="hidden flex-1 items-center justify-center px-6 xl:flex">
          <HeaderSearch />
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="hidden md:flex md:items-center">
            <UserMenu />
          </div>
          <Link
            href="/launch"
            aria-label="Launch your project"
            className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-sun px-3 text-xs font-bold text-on-sun transition hover:bg-sun-bright sm:h-auto sm:px-3.5 sm:py-1.5"
          >
            <RocketIcon className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="hidden lg:inline">Launch your project</span>
            <span className="hidden sm:inline lg:hidden">Launch</span>
          </Link>
        </div>

      </div>

      {menuOpen && <MobileMenu id={MOBILE_MENU_ID} top={menuTop} pathname={pathname} onClose={closeMenu} />}
    </header>
  );
}
