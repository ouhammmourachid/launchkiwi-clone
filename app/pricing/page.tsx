/**
 * app/pricing/page.tsx — Pricing page
 * Plans come from the `pricing_plans` collection. Checkout isn't built yet,
 * so paid plans show a disabled "coming soon" button.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { ContentShell } from "@/components/layout/content-shell";
import { buttonClasses } from "@/components/ui/button";
import { listPricingPlans } from "@/lib/api/catalog";
import type { PricingPlan } from "@/lib/types/models";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Launch free, or skip the queue with Premium and Priority listings.",
};

function formatPrice(plan: PricingPlan) {
  if (plan.price === 0) return "$0";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency, maximumFractionDigits: 0 }).format(plan.price);
}

function PlanCard({ plan }: { plan: PricingPlan }) {
  const isFree = plan.price === 0;
  return (
    <div
      className={`flex flex-col rounded-[24px] border p-6 shadow-lg ${
        plan.highlighted ? "border-[#86ba28] bg-[#171c0f] shadow-[0_0_25px_rgba(134,186,40,0.12)]" : "border-[#22271a] bg-[#13160e]"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#86ba28]">{plan.name}</p>
        {plan.highlighted && (
          <span className="rounded-full bg-[#86ba28] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#0a0d06]">Best value</span>
        )}
      </div>
      <div className="mt-4 flex items-end gap-2">
        <span className="text-4xl font-black text-white">{formatPrice(plan)}</span>
        <span className="pb-1 text-xs text-[#727c65]">one-time</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#9aa48c]">{plan.description}</p>
      <ul className="mt-5 flex-1 space-y-2 text-xs text-[#c5ceb8]">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="text-[#86ba28]">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      {isFree ? (
        <Link href="/launch" className={buttonClasses({ className: "mt-6 w-full" })}>
          Launch for free
        </Link>
      ) : (
        <button type="button" disabled className={buttonClasses({ variant: "secondary", className: "mt-6 w-full" })}>
          Checkout coming soon
        </button>
      )}
    </div>
  );
}

export default async function PricingPage() {
  await connection();
  const plans = await listPricingPlans();

  return (
    <ContentShell>
      <div className="space-y-6 pb-12">
        <section className="pt-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86ba28]">Pricing</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">Simple pricing for every launch stage</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-[#9aa48c]">
            All listings are permanent. Paid plans are one-time payments — no subscriptions or renewals.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </ContentShell>
  );
}
