import Link from "next/link";
import type { ReactNode } from "react";

import { footerGroups, navLinks, trustBadges } from "@/data/site";

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
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

function RocketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M4.93 4.93l2.12 2.12" />
      <path d="M16.95 16.95l2.12 2.12" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <path d="M4.93 19.07l2.12-2.12" />
      <path d="M16.95 7.05l2.12-2.12" />
    </svg>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d100b] text-white">
      <div className="bg-[#7aa14e] px-4 py-2 text-center text-[11px] font-semibold text-[#0d100b]">
        <Link href="/launch" className="inline-flex items-center justify-center gap-2 hover:underline">
          <span className="text-base">✦</span>
          <span>Launch free — permanent DR 53 dofollow backlink, verified in minutes.</span>
        </Link>
      </div>

      <header className="border-b border-white/8 bg-[#0b0d09]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-8 xl:px-12">
          <div className="flex items-center gap-5">
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#b7d65d] text-[10px] font-black text-[#0b0d09] md:flex">
              LK
            </div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-black tracking-[-0.06em] text-white">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#b7d65d] text-[10px] font-black text-[#0b0d09]">L</span>
              <span>LaunchKiwi</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#dfe7d2] transition hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden flex-1 items-center justify-center px-6 lg:flex">
            <div className="relative w-full max-w-[420px]">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#aac184]">
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search projects, tools or tags..."
                className="w-full rounded-full border border-white/8 bg-[#1a1d17] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-[#8b987f] outline-none focus:border-[#b7d65d]/80"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-[#1a1d17] text-[#dfe7d2] transition hover:bg-white/5" aria-label="Toggle theme">
              <SparkIcon />
            </button>
            <button type="button" className="hidden rounded-full border border-white/8 bg-[#1a1d17] px-4 py-2 text-sm font-medium text-[#e8eee2] sm:inline-flex">
              Sign In
            </button>
            <Link
              href="/launch"
              className="inline-flex items-center gap-2 rounded-full bg-[#b7d65d] px-4 py-2.5 text-sm font-semibold text-[#0b0d09] transition hover:bg-[#cfe67e]"
            >
              <span className="text-base">✦</span>
              <span className="hidden sm:inline">Launch your project</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">{children}</main>

      <section className="border-t border-white/8 bg-[#0b0d09] px-6 py-14 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfe7d2]">
            Stay updated
          </span>
          <h3 className="text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl">Get weekly indie project launches directly in your inbox.</h3>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#b9c1ad]">
            Subscribe to receive curated lists of the most successful SaaS products, developer tools, and community favourites.
          </p>
          <form className="mx-auto mt-6 flex max-w-xl gap-2">
            <input
              type="email"
              required
              placeholder="your.email@domain.com"
              className="w-full rounded-xl border border-white/10 bg-[#171b14] px-4 py-3 text-base text-white placeholder:text-[#848f7d] outline-none focus:border-[#b7d65d]"
            />
            <button type="submit" className="rounded-xl bg-[#b7d65d] px-6 py-3 text-sm font-semibold text-[#0b0d09] transition hover:bg-[#cfe67e]">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/8 bg-[#0b0d09] px-5 pb-10 pt-12 text-[#d5dccf]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-3 sm:px-8 xl:px-12 md:grid-cols-12">
          <div className="space-y-4 md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-[-0.06em] text-white">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#b7d65d] text-[10px] font-black text-[#0b0d09]">L</span>
              <span>LaunchKiwi</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#aeb8a0]">
              LaunchKiwi is the weekly hunt for indie projects and solo launches — submit yours, collect votes, and get in front of early adopters.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#d5dccf]">
              <a href="mailto:hello@launchkiwi.com" className="rounded-full border border-white/8 p-2 transition hover:bg-white/5">
                <MailIcon />
              </a>
              <Link href="/feed.xml" className="rounded-full border border-white/8 p-2 transition hover:bg-white/5">
                <RssIcon />
              </Link>
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.heading} className="space-y-3 md:col-span-3">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfe7d2]">{group.heading}</h4>
              <ul className="space-y-2 text-sm text-[#b7c0aa]">
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

          <div className="space-y-3 md:col-span-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfe7d2]">Community</h4>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#aeb8a0]">Total Votes</div>
              <div className="mt-2 text-3xl font-black text-white">1130</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-center">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#aeb8a0]">Products Listed</div>
              <div className="mt-2 text-3xl font-black text-white">358+</div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-[1440px] flex-col items-center justify-between gap-4 border-t border-white/8 px-3 pt-6 text-sm text-[#9ea993] sm:px-8 xl:px-12 md:flex-row">
          <span>© 2026 LaunchKiwi. All rights reserved. Made for indie builders everywhere.</span>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <span>•</span>
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
            <span>•</span>
            <Link href="/cookies" className="transition hover:text-white">Cookies</Link>
            <span>•</span>
            <Link href="/contact" className="transition hover:text-white">Contact</Link>
            <button type="button" aria-label="Back to top" className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition hover:bg-white/5 hover:text-white">
              <ArrowUpIcon />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function SideAdStack() {
  return (
    <div className="hidden w-[220px] shrink-0 flex-col gap-4 xl:flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <Link
          key={index}
          href="/advertise"
          className="flex items-center justify-center gap-3 rounded-2xl border border-[#5d5a4d] bg-[#1a1d17] p-4 text-left text-[#e9efe4] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition hover:border-[#b7d65d]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b7d65d] text-xs font-black text-[#0b0d09]">✦</div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">Advertise</div>
            <div className="text-[11px] text-[#aeb8a0]">Book this slot</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function RightRail() {
  const cards = [
    { name: "ReviewTurbo", accent: "bg-[#b7d65d]", blurb: "AI replies for your customer reviews." },
    { name: "Porn blockade...", accent: "bg-[#c7d760]", blurb: "Protect yourself and your family with a blocker built t..." },
    { name: "Personal Black Hole", accent: "bg-[#f1efe8]", blurb: "Physics-inspired black holes for any web page — Solo..." },
    { name: "CoRegulateAI", accent: "bg-[#d6dff8]", blurb: "The Personalized Operating System for Emotional..." },
    { name: "Advertise", accent: "bg-[#1a1d17]", blurb: "Book this slot" },
  ];

  return (
    <div className="hidden w-[240px] shrink-0 flex-col gap-4 xl:flex">
      {cards.map((card, index) => (
        <Link
          key={card.name}
          href="/advertise"
          className={`flex min-h-[110px] items-center rounded-2xl border border-[#4d5640] bg-[#1a1d17] p-4 text-left transition hover:border-[#b7d65d] ${index === 4 ? "border-dashed border-[#5d5a4d]" : ""}`}
        >
          <div className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black text-[#0b0d09] ${card.accent}">
            {index === 0 ? "⚡" : index === 1 ? "◉" : index === 2 ? "◌" : index === 3 ? "✦" : "✎" }
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-lg font-bold leading-tight text-white">{card.name}</div>
            <div className="mt-1 text-sm leading-relaxed text-[#b7c0aa]">{card.blurb}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ContentShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-[1440px] items-start justify-center gap-6 px-4 pb-8 pt-5 sm:px-8 xl:px-12">
      <SideAdStack />
      <div className="w-full max-w-[880px]">{children}</div>
      <RightRail />
    </div>
  );
}
