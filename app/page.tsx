/**
 * app/page.tsx — Home page
 * Server-rendered launch sections from PocketBase; upvotes hydrate on the client.
 */

import Link from "next/link";
import { connection } from "next/server";

import { ContentShell } from "@/components/layout/content-shell";
import { ProductList } from "@/components/products/product-list";
import { buttonClasses } from "@/components/ui/button";
import { SubmitForm } from "@/components/ui/submit-form";
import { heroFeatures, marketingStats } from "@/data/site";
import { getSiteStats } from "@/lib/api/catalog";
import { getLaunchSections } from "@/lib/api/products";
import type { SiteStats } from "@/lib/types/models";
import { formatNumber } from "@/lib/utils/format";

// ---------------------------------------------------------------------------
// Hero section sub-components
// ---------------------------------------------------------------------------

function HeroBadge() {
  return (
    <span className="inline-block rounded-full border border-[#2b3120] bg-[#1a1e13] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#a6b194]">
      WEEKLY INDIE PRODUCT LAUNCHES
    </span>
  );
}

function HeroStats({ stats }: { stats: SiteStats }) {
  const items = [
    { value: formatNumber(stats.upvotes), label: "Upvotes" },
    ...marketingStats,
    { value: `${formatNumber(stats.products)}+`, label: "Products submitted" },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 rounded-2xl border border-[#22271a] bg-[#0a0c07] overflow-hidden divide-x divide-y sm:divide-y-0 divide-[#22271a]">
      {items.map((stat) => (
        <div key={stat.label} className="p-4 text-center">
          <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
          <div className="text-[11px] font-medium text-[#8c967d] mt-0.5">{stat.label}</div>
          {"sub" in stat && <div className="text-[9px] text-[#5e6652] mt-0.5">{stat.sub}</div>}
        </div>
      ))}
    </div>
  );
}

function HeroSection({ stats }: { stats: SiteStats }) {
  return (
    <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] p-6 sm:p-10 text-center shadow-lg">
      <HeroBadge />

      <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] max-w-2xl mx-auto">
        Get your product in front of 107,730+ visitors
      </h1>

      <p className="mt-4 text-xs sm:text-sm text-[#9aa48c] max-w-xl mx-auto leading-relaxed">
        Free to submit. Permanent DR 53 backlink. Every launch gets a real, SEO-indexed home — no approval wait.
      </p>

      <SubmitForm />

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-medium text-[#9aa48c]">
        {heroFeatures.map((feature) => (
          <span key={feature} className="flex items-center gap-1">
            <span className="text-[#86ba28]">✓</span>
            {feature}
          </span>
        ))}
      </div>

      <HeroStats stats={stats} />
    </section>
  );
}

function ViewMoreLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="text-center py-2">
      <Link href={href} className={buttonClasses({ variant: "secondary", size: "sm" })}>
        <span>{label}</span>
        <span>→</span>
      </Link>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function HomePage() {
  await connection(); // always render fresh launches
  const [sections, stats] = await Promise.all([getLaunchSections(), getSiteStats()]);
  const { thisWeek, lastWeek, earlier } = sections;

  return (
    <ContentShell withSidebars>
      <div className="space-y-6 pb-12">
        <HeroSection stats={stats} />

        <ProductList
          title="This Week's Hunts"
          subtitle={`${thisWeek.totalItems} launches this week`}
          products={thisWeek.items}
          emptyTitle="No launches yet this week"
          emptyContent={
            <Link href="/launch" className="font-bold text-[#86ba28] hover:underline">
              Be the first to launch →
            </Link>
          }
        />

        <ProductList title="Last Week's Hunts" subtitle="Sorted by upvote count" products={lastWeek.items} emptyTitle="Nothing launched last week" />

        <ProductList title="Earlier This Month" subtitle="Sorted by upvote count" products={earlier.items} emptyTitle="Nothing launched earlier this month" />

        <ViewMoreLink href="/browse?sort=top" label="Browse all products" />
      </div>
    </ContentShell>
  );
}
