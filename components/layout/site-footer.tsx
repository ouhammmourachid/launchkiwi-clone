/**
 * site-footer.tsx
 * Global site footer: brand column, link groups, community stats, legal bar.
 */

import Link from "next/link";
import { connection } from "next/server";

import { BackToTopButton } from "@/components/layout/back-to-top-button";
import { KiwiLogo, MailIcon, RssIcon } from "@/components/layout/nav-icons";
import { footerGroups } from "@/data/site";
import { getSiteStats } from "@/lib/api/catalog";
import { formatNumber } from "@/lib/utils/format";

export async function SiteFooter() {
  await connection();
  const stats = await getSiteStats().catch(() => null);

  return (
    <footer className="border-t border-[#1b1f14] bg-[#080a06] px-4 pb-10 pt-12 text-[#c5ceb8]">
      <div className="mx-auto grid max-w-[1480px] gap-8 px-2 sm:px-6 md:grid-cols-12">

        {/* Brand column */}
        <div className="space-y-3 md:col-span-4">
          <Link href="/" className="inline-block">
            <KiwiLogo />
          </Link>
          <p className="max-w-xs text-xs leading-relaxed text-[#828c74]">
            LaunchKiwi is the weekly hunt for indie projects and solo launches — submit yours, collect votes, and get in front of early adopters. Built for developers, designers, and tech creators globally.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[#a6b194]">
            <a
              href="mailto:hello@launchkiwi.com"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#22271a] bg-[#141810] transition hover:border-[#86ba28] hover:text-white"
            >
              <MailIcon />
            </a>
            <Link
              href="/feed.xml"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#22271a] bg-[#141810] transition hover:border-[#86ba28] hover:text-white"
            >
              <RssIcon />
            </Link>
          </div>
        </div>

        {/* Link groups */}
        {footerGroups.map((group) => (
          <div key={group.heading} className="space-y-3 md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#a6b194]">
              {group.heading}
            </h4>
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

        {/* Community stats */}
        <div className="space-y-3 md:col-span-2">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#a6b194]">COMMUNITY</h4>
          <div className="rounded-xl border border-[#22271a] bg-[#12150d] p-3.5 text-center">
            <div className="text-[9px] uppercase tracking-widest text-[#727c65] font-bold">TOTAL VOTES</div>
            <div className="mt-1 text-2xl font-black text-white">{stats ? formatNumber(stats.upvotes) : "—"}</div>
          </div>
          <div className="rounded-xl border border-[#22271a] bg-[#12150d] p-3.5 text-center">
            <div className="text-[9px] uppercase tracking-widest text-[#727c65] font-bold">PRODUCTS LISTED</div>
            <div className="mt-1 text-2xl font-black text-white">{stats ? formatNumber(stats.products) : "—"}</div>
          </div>
        </div>

      </div>

      {/* Legal / bottom bar */}
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
          <BackToTopButton />
        </div>
      </div>
    </footer>
  );
}
