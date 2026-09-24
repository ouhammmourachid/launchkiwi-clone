/**
 * app/upgrade/page.tsx — Upgrade a launch to a paid plan.
 * /upgrade[?product=<id>] — the maker picks a product, then Premium or Priority.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { ContentShell } from "@/components/layout/content-shell";
import { UpgradeForm } from "@/components/upgrade/upgrade-form";
import { listPricingPlans } from "@/lib/api/catalog";

export const metadata: Metadata = { title: "Upgrade your launch" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function UpgradePage({ searchParams }: { searchParams: SearchParams }) {
  const { product } = await searchParams;
  const plans = (await listPricingPlans()).filter((p) => p.price > 0);

  return (
    <ContentShell>
      <div className="mx-auto max-w-3xl space-y-6 pb-12">
        <section className="pt-2">
          <Link href="/pricing" className="text-xs font-semibold text-dune-400 hover:text-sun">
            ← All plans
          </Link>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-sun">Upgrade</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Upgrade your launch</h1>
          <p className="mt-3 text-sm leading-relaxed text-dune-300">
            Skip the badge and the queue. One-time payment, no subscription.
          </p>
        </section>

        <UpgradeForm plans={plans} initialProductId={typeof product === "string" ? product : undefined} />
      </div>
    </ContentShell>
  );
}
