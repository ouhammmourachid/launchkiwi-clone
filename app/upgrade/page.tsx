/**
 * app/upgrade/page.tsx — Upgrade a launch to a paid plan.
 * /upgrade?plan=premium[&product=<id>]
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContentShell } from "@/components/layout/content-shell";
import { UpgradeForm } from "@/components/upgrade/upgrade-form";
import { listPricingPlans } from "@/lib/api/catalog";
import { formatPlanPrice } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Upgrade your launch" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function UpgradePage({ searchParams }: { searchParams: SearchParams }) {
  const { plan: planSlug, product } = await searchParams;
  const plans = await listPricingPlans();
  const plan = plans.find((p) => p.slug === planSlug && p.price > 0);
  if (!plan) notFound();

  return (
    <ContentShell>
      <div className="mx-auto max-w-2xl space-y-6 pb-12">
        <section className="pt-2">
          <Link href="/pricing" className="text-xs font-semibold text-dune-400 hover:text-sun">
            ← All plans
          </Link>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-sun">Upgrade</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
            {plan.name} · {formatPlanPrice(plan)}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-dune-300">{plan.description}</p>
          <ul className="mt-4 grid gap-2 text-xs text-dune-100 sm:grid-cols-2">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="text-sun">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <UpgradeForm plan={plan} priceLabel={formatPlanPrice(plan)} initialProductId={typeof product === "string" ? product : undefined} />
      </div>
    </ContentShell>
  );
}
