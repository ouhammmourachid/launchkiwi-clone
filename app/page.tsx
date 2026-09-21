/**
 * app/page.tsx — Home page
 * All product data comes from data/site.ts.
 * ProductRow/ProductList components are shared from components/.
 */

import { ContentShell } from "@/components/layout/content-shell";
import { ProductList } from "@/components/products/product-list";
import { SubmitForm } from "@/components/ui/submit-form";
import {
  thisWeeksHunts,
  pastMonthHunts,
  pastWeekHunts,
  siteStats,
  heroFeatures,
} from "@/data/site";

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

// SubmitForm is a Client Component (has onSubmit) — imported from components/ui/submit-form.tsx

function HeroStats() {
  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 rounded-2xl border border-[#22271a] bg-[#0a0c07] overflow-hidden divide-x divide-y sm:divide-y-0 divide-[#22271a]">
      {siteStats.map((stat) => (
        <div key={stat.label} className="p-4 text-center">
          <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
          <div className="text-[11px] font-medium text-[#8c967d] mt-0.5">{stat.label}</div>
          {stat.sub && (
            <div className="text-[9px] text-[#5e6652] mt-0.5">{stat.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function HeroSection() {
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

      {/* Feature check-list */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-medium text-[#9aa48c]">
        {heroFeatures.map((feature) => (
          <span key={feature} className="flex items-center gap-1">
            <span className="text-[#86ba28]">✓</span>
            {feature}
          </span>
        ))}
      </div>

      <HeroStats />
    </section>
  );
}

function ViewMoreButton({ label }: { label: string }) {
  return (
    <div className="text-center py-2">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-[#272d1d] bg-[#161910] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#1f2417] cursor-pointer"
      >
        <span>{label}</span>
        <span>→</span>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function HomePage() {
  return (
    <ContentShell>
      <div className="space-y-6 pb-12">
        <HeroSection />

        <ProductList
          title="This Week's Hunts"
          subtitle="39 launches this week"
          products={thisWeeksHunts}
        />

        <ViewMoreButton label="View older projects" />

        <ProductList
          title="Past Month Hunts"
          subtitle="Sorted by upvote count"
          products={pastMonthHunts}
        />

        <ViewMoreButton label="View more" />

        <ProductList
          title="Past Week Hunts"
          subtitle="Launches from last week"
          products={pastWeekHunts}
        />
      </div>
    </ContentShell>
  );
}
