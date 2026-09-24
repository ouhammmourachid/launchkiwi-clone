/**
 * app/launch/page.tsx — Launch a product (free queue or paid tier).
 * The hero URL box on the home page forwards here as /launch?url=…,
 * and pricing links can preselect a tier with /launch?plan=premium.
 */

import type { Metadata } from "next";

import { SubmitProductForm } from "@/components/launch/submit-product-form";
import { getNextFreeLaunchDate, listAllCategories, listPricingPlans, listTagIdsBySlug } from "@/lib/api/catalog";

export const metadata: Metadata = {
  title: "Launch your project",
  description: "Submit your indie project or solo startup to LaunchDunes to get indexed, gain traffic and collect feedback.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LaunchPage({ searchParams }: { searchParams: SearchParams }) {
  const { url, plan } = await searchParams;
  const [categories, plans, tagIdsBySlug, nextFreeDate] = await Promise.all([
    listAllCategories(),
    listPricingPlans(),
    listTagIdsBySlug(),
    getNextFreeLaunchDate(),
  ]);

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-8 md:py-12">
      <div className="overflow-hidden rounded-[24px] border border-dune-850 bg-dune-940">
        <header className="bg-sun px-6 py-7 text-on-sun md:px-8">
          <h1 className="text-2xl font-black tracking-tight md:text-3xl">Launch Your Project</h1>
          <p className="mt-1.5 text-sm font-medium opacity-80">
            Submit your indie project or solo startup to index, gain traffic, and collect feedback.
          </p>
        </header>

        <SubmitProductForm
          categories={categories}
          plans={plans}
          tagIdsBySlug={tagIdsBySlug}
          nextFreeDate={nextFreeDate}
          initialUrl={typeof url === "string" ? url : ""}
          initialPlan={typeof plan === "string" ? plan : undefined}
        />
      </div>
    </div>
  );
}
