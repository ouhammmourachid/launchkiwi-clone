/**
 * site-footer.tsx
 * Global site footer: brand column, link groups, community stats, legal bar.
 */

import Link from "next/link";
import { connection } from "next/server";

import { BackToTopButton } from "@/components/layout/back-to-top-button";
import { DunesLogo, MailIcon, RssIcon } from "@/components/layout/nav-icons";
import { footerGroups } from "@/data/site";
import { getSiteStats } from "@/lib/api/catalog";
import { formatNumber } from "@/lib/utils/format";

export async function SiteFooter() {
  await connection();
  const stats = await getSiteStats().catch(() => null);

  return (
    <footer className="border-t border-dune-900 bg-dune-990 px-4 pb-10 pt-12 text-dune-100">
      <div className="mx-auto grid max-w-[1480px] gap-8 px-2 sm:px-6 md:grid-cols-12">

        {/* Brand column */}
        <div className="space-y-3 md:col-span-4">
          <Link href="/" className="inline-block">
            <DunesLogo />
          </Link>
          <p className="max-w-xs text-xs leading-relaxed text-dune-400">
            LaunchDunes is the weekly hunt for indie projects and solo launches — submit yours, collect votes, and get in front of early adopters. Built for developers, designers, and tech creators globally.
          </p>
          <div className="flex items-center gap-2 pt-1 text-dune-200">
            <a
              href="mailto:hello@launchdunes.com"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-dune-850 bg-dune-925 transition hover:border-sun hover:text-white"
            >
              <MailIcon />
            </a>
            <Link
              href="/feed.xml"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-dune-850 bg-dune-925 transition hover:border-sun hover:text-white"
            >
              <RssIcon />
            </Link>
          </div>
        </div>

        {/* Link groups */}
        {footerGroups.map((group) => (
          <div key={group.heading} className="space-y-3 md:col-span-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-dune-200">
              {group.heading}
            </h4>
            <ul className="space-y-2 text-xs text-dune-400">
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
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-dune-200">COMMUNITY</h4>
          <div className="rounded-xl border border-dune-850 bg-dune-940 p-3.5 text-center">
            <div className="text-[9px] uppercase tracking-widest text-dune-500 font-bold">TOTAL VOTES</div>
            <div className="mt-1 text-2xl font-black text-white">{stats ? formatNumber(stats.upvotes) : "—"}</div>
          </div>
          <div className="rounded-xl border border-dune-850 bg-dune-940 p-3.5 text-center">
            <div className="text-[9px] uppercase tracking-widest text-dune-500 font-bold">PRODUCTS LISTED</div>
            <div className="mt-1 text-2xl font-black text-white">{stats ? formatNumber(stats.products) : "—"}</div>
          </div>
        </div>

      </div>

      {/* Legal / bottom bar */}
      <div className="mx-auto mt-10 flex max-w-[1480px] flex-col items-center justify-between gap-4 border-t border-dune-900 px-2 pt-6 text-xs text-dune-500 sm:px-6 md:flex-row">
        <span>© 2026 LaunchDunes. All rights reserved. Made for indie builders everywhere.</span>
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
