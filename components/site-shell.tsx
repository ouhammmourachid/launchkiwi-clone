"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { footerGroups, leftSidebarProducts, navLinks, rightSidebarProducts } from "@/data/site";

function KiwiLogo() {
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-3.5 w-3.5">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function RssIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  );
}

function SunIcon() {
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

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#86ba28]">
      <path d="m3 11 18-5v12L3 13v-2z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0c07] text-[#f3efe6] font-sans antialiased">
      {/* Top Banner */}
      <div className="bg-[#86ba28] px-4 py-1.5 text-center text-xs font-semibold text-[#0a0d06] flex items-center justify-center gap-1.5">
        <span>🚀</span>
        <span>Launch free — permanent DR 53 dofollow backlink, verified in minutes.</span>
      </div>

      {/* Main Header */}
      <header className="border-b border-[#1b1f14] bg-[#0a0c07] sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <KiwiLogo />
            </Link>

            <nav className="hidden items-center gap-5 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-semibold text-[#c5ceb8] transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

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

      {/* Main Container */}
      <main className="relative">{children}</main>

      {/* Newsletter Section */}
      <section className="border-t border-[#1b1f14] bg-[#0a0c07] px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <span className="inline-block rounded-full border border-[#282e1e] bg-[#15190e] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#a6b194]">
            STAY UPDATED
          </span>
          <h3 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
            Get weekly indie project launches directly in your inbox.
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-[#9aa48c] leading-relaxed">
            Subscribe to receive curated lists of the most successful SaaS products, developer tools, and community favourites.
          </p>
          <form className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              required
              placeholder="your.email@domain.com"
              className="w-full rounded-xl border border-[#23291b] bg-[#141810] px-4 py-2.5 text-xs text-white placeholder:text-[#5e6652] outline-none focus:border-[#86ba28]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto shrink-0 rounded-xl bg-[#86ba28] px-5 py-2.5 text-xs font-bold text-[#0a0d06] transition hover:bg-[#96cc2e] cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1b1f14] bg-[#080a06] px-4 pb-10 pt-12 text-[#c5ceb8]">
        <div className="mx-auto grid max-w-[1480px] gap-8 px-2 sm:px-6 md:grid-cols-12">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-4">
            <Link href="/" className="inline-block">
              <KiwiLogo />
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-[#828c74]">
              LaunchKiwi is the weekly hunt for indie projects and solo launches — submit yours, collect votes, and get in front of early adopters. Built for developers, designers, and tech creators globally.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[#a6b194]">
              <a href="mailto:hello@launchkiwi.com" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#22271a] bg-[#141810] transition hover:border-[#86ba28] hover:text-white">
                <MailIcon />
              </a>
              <Link href="/feed.xml" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#22271a] bg-[#141810] transition hover:border-[#86ba28] hover:text-white">
                <RssIcon />
              </Link>
            </div>
          </div>

          {/* Footer Nav Groups */}
          {footerGroups.map((group) => (
            <div key={group.heading} className="space-y-3 md:col-span-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#a6b194]">{group.heading}</h4>
              <ul className="space-y-2 text-xs text-[#828c74]">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Community Stats */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#a6b194]">COMMUNITY</h4>
            <div className="rounded-xl border border-[#22271a] bg-[#12150d] p-3.5 text-center">
              <div className="text-[9px] uppercase tracking-widest text-[#727c65] font-bold">TOTAL VOTES</div>
              <div className="mt-1 text-2xl font-black text-white">11030</div>
            </div>
            <div className="rounded-xl border border-[#22271a] bg-[#12150d] p-3.5 text-center">
              <div className="text-[9px] uppercase tracking-widest text-[#727c65] font-bold">PRODUCTS LISTED</div>
              <div className="mt-1 text-2xl font-black text-white">358 +</div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mx-auto mt-10 flex max-w-[1480px] flex-col items-center justify-between gap-4 border-t border-[#1b1f14] px-2 pt-6 text-xs text-[#6e7760] sm:px-6 md:flex-row">
          <span>© 2026 LaunchKiwi. All rights reserved. Made for indie builders everywhere.</span>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
            <span>•</span>
            <Link href="/cookies" className="transition hover:text-white">Cookies</Link>
            <span>•</span>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#22271a] bg-[#141810] text-[#9aa48c] transition hover:bg-[#1a2015] hover:text-white cursor-pointer"
            >
              <ArrowUpIcon />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function LeftSidebar() {
  return (
    <aside className="hidden w-[210px] shrink-0 flex-col gap-3 xl:flex">
      {leftSidebarProducts.map((item) => (
        <div
          key={item.name}
          className="rounded-2xl border border-[#22271a] bg-[#141810] p-3.5 transition hover:border-[#343c28]"
        >
          <div className="flex items-start gap-2.5">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} text-sm`}>
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white leading-tight truncate">{item.name}</h4>
              <p className="mt-1 text-[11px] leading-snug text-[#828c74] line-clamp-2">{item.blurb}</p>
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
}

export function RightSidebar() {
  return (
    <aside className="hidden w-[210px] shrink-0 flex-col gap-3 xl:flex">
      {rightSidebarProducts.map((item) =>
        item.isAd ? (
          <Link
            key="ad-slot"
            href="/advertise"
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2d3522] bg-[#141810] p-4 text-center transition hover:border-[#86ba28]"
          >
            <MegaphoneIcon />
            <span className="mt-1.5 text-xs font-bold text-white">Advertise</span>
            <span className="text-[10px] text-[#828c74]">Book this slot</span>
          </Link>
        ) : (
          <div
            key={item.name}
            className="rounded-2xl border border-[#22271a] bg-[#141810] p-3.5 transition hover:border-[#343c28]"
          >
            <div className="flex items-start gap-2.5">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} text-sm text-white`}>
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white leading-tight truncate">{item.name}</h4>
                <p className="mt-1 text-[11px] leading-snug text-[#828c74] line-clamp-2">{item.blurb}</p>
              </div>
            </div>
          </div>
        )
      )}
    </aside>
  );
}

export function ContentShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1480px] items-start justify-center gap-4 px-4 py-5">
      <LeftSidebar />
      <div className="w-full flex-1 max-w-[920px]">{children}</div>
      <RightSidebar />
    </div>
  );
}

