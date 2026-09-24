/**
 * app/pricing/page.tsx — Pricing page
 * Plans come from the `pricing_plans` collection. Each plan links to /launch
 * with that tier preselected.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { ContentShell } from "@/components/layout/content-shell";
import { PlanCard } from "@/components/pricing/plan-card";
import { buttonClasses } from "@/components/ui/button";
import { listPricingPlans } from "@/lib/api/catalog";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Launch free, or skip the queue with Premium and Priority listings.",
};

export default async function PricingPage() {
  await connection();
  const plans = await listPricingPlans();

  return (
    <ContentShell>
      <div className="space-y-6 pb-12">
        <section className="pt-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sun">Pricing</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">Simple pricing for every launch stage</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-dune-300">
            All listings are permanent. Paid plans are one-time payments — no subscriptions or renewals.
          </p>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              action={
                <Link
                  href={`/launch?plan=${plan.slug}`}
                  className={buttonClasses({ variant: plan.price === 0 ? "inverse" : "primary", className: "w-full" })}
                >
                  {plan.price === 0 ? "Launch for free" : `Get ${plan.name}`}
                </Link>
              }
            />
          ))}
        </div>
      </div>
    </ContentShell>
  );
}
