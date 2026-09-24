/**
 * app/page.tsx — Home page
 * Server-rendered launch sections from PocketBase; upvotes hydrate on the client.
 */

import Link from "next/link";
import { connection } from "next/server";

import { ContentShell } from "@/components/layout/content-shell";
import { FeaturedGrid } from "@/components/layout/featured-grid";
import { LoadMoreProducts } from "@/components/products/load-more-products";
import { ProductList } from "@/components/products/product-list";
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
    <span className="inline-block rounded-full border border-dune-800 bg-dune-900 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-dune-200">
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
    <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 rounded-2xl border border-dune-850 bg-dune-970/75 backdrop-blur-sm overflow-hidden divide-x divide-y sm:divide-y-0 divide-dune-850">
      {items.map((stat) => (
        <div key={stat.label} className="p-3 text-center">
          <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
          <div className="text-[11px] font-medium text-dune-400 mt-0.5">{stat.label}</div>
          {"sub" in stat && <div className="text-[9px] text-dune-600 mt-0.5">{stat.sub}</div>}
        </div>
      ))}
    </div>
  );
}

// Each ridge path repeats exactly every 1200 units across a 2400-wide box, so sliding
// the SVG left by half its width loops seamlessly.
const BACK_RIDGE = "M0 60C200 40 400 20 600 55S1000 80 1200 60S1600 20 1800 55S2200 80 2400 60";
const FRONT_RIDGE = "M0 88C200 76 400 60 600 80S1000 100 1200 88S1600 60 1800 80S2200 100 2400 88";

/** Two dune ridges with a sunlit crest line drifting slowly behind the bottom of the hero. */
function HeroDunes() {
  const layer = "absolute bottom-0 left-0 h-full w-[200%]";
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden" aria-hidden="true">
      <svg className={`${layer} animate-dune-drift-slow`} viewBox="0 0 2400 112" preserveAspectRatio="none">
        <path d={`${BACK_RIDGE}V112H0z`} className="fill-dune-850" opacity="0.55" />
      </svg>
      <svg className={`${layer} animate-dune-drift`} viewBox="0 0 2400 112" preserveAspectRatio="none">
        <path d={`${FRONT_RIDGE}V112H0z`} className="fill-dune-900" />
        <path
          d={FRONT_RIDGE}
          fill="none"
          className="stroke-sun"
          strokeWidth="1.5"
          opacity="0.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function HeroSection({ stats }: { stats: SiteStats }) {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-dune-850 bg-dune-940 px-4 pt-5 pb-8 sm:px-10 sm:pt-6 sm:pb-10 text-center shadow-lg">
      <HeroDunes />
      <div className="relative">
        <HeroBadge />

        <h1 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] max-w-2xl mx-auto">
          Get your product in front of 107,730+ visitors
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-dune-300 max-w-xl mx-auto leading-relaxed">
          Free to submit. Permanent DR 53 backlink. Every launch gets a real, SEO-indexed home — no approval wait.
        </p>

        <SubmitForm />

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-medium text-dune-300">
          {heroFeatures.map((feature) => (
            <span key={feature} className="flex items-center gap-1">
              <span className="text-sun">✓</span>
              {feature}
            </span>
          ))}
        </div>

        <HeroStats stats={stats} />
      </div>
    </section>
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

        <FeaturedGrid />

        <ProductList
          title="This Week's Hunts"
          subtitle={`${thisWeek.totalItems} launches this week`}
          products={thisWeek.items}
          emptyTitle="No launches yet this week"
          emptyContent={
            <Link href="/launch" className="font-bold text-sun hover:underline">
              Be the first to launch →
            </Link>
          }
        />

        <ProductList title="Last Week's Hunts" subtitle="Sorted by upvote count" products={lastWeek.items} emptyTitle="Nothing launched last week" />

        <ProductList title="Earlier This Month" subtitle="Sorted by upvote count" products={earlier.items} emptyTitle="Nothing launched earlier this month" />

        <LoadMoreProducts />
      </div>
    </ContentShell>
  );
}
