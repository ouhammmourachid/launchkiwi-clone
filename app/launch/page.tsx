/**
 * app/launch/page.tsx — Free product submission.
 * The hero URL box on the home page forwards here as /launch?url=…
 */

import type { Metadata } from "next";
import Link from "next/link";

import { SubmitProductForm } from "@/components/launch/submit-product-form";
import { ContentShell } from "@/components/layout/content-shell";
import { Panel } from "@/components/ui/panel";
import { listAllCategories } from "@/lib/api/catalog";

export const metadata: Metadata = {
  title: "Launch your product",
  description: "Submit your product for free and get a permanent listing on LaunchKiwi.",
};

const steps = [
  "Add your product URL and basic details.",
  "Pick a category and pricing model.",
  "Publish instantly and start collecting upvotes and feedback.",
];

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LaunchPage({ searchParams }: { searchParams: SearchParams }) {
  const { url } = await searchParams;
  const categories = await listAllCategories();

  return (
    <ContentShell>
      <div className="space-y-6 pb-12">
        <section className="pt-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#86ba28]">Launch</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Submit your product</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9aa48c]">
            Get a free permanent product listing and bring early adopters, builders, and product enthusiasts to your launch.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <SubmitProductForm categories={categories} initialUrl={typeof url === "string" ? url : ""} />

          <aside className="space-y-4">
            <Panel className="p-6">
              <h2 className="text-lg font-bold text-white">How it works</h2>
              <ol className="mt-4 space-y-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-[#c5ceb8]">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#86ba28] text-xs font-bold text-[#0a0d06]">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Panel>
            <Panel className="p-6">
              <h2 className="text-sm font-bold text-white">Want more visibility?</h2>
              <p className="mt-2 text-xs leading-relaxed text-[#9aa48c]">
                Premium and Priority listings get pinned, featured badges and an editorial review.
              </p>
              <Link href="/pricing" className="mt-3 inline-block text-xs font-bold text-[#86ba28] hover:underline">
                See pricing →
              </Link>
            </Panel>
          </aside>
        </div>
      </div>
    </ContentShell>
  );
}
