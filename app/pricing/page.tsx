/**
 * app/pricing/page.tsx — Pricing page
 * Pricing plan data is imported from data/site.ts.
 */

import Link from "next/link";

import { ContentShell } from "@/components/layout/content-shell";
import { pricingPlans } from "@/data/site";

export default function PricingPage() {
  return (
    <ContentShell>
      <div className="space-y-6">
          {/* Header */}
          <section className="rounded-3xl border border-[#ece7e1] bg-white p-6 shadow-sm text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6b2c]">
              Pricing
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#111827] md:text-4xl">
              Simple pricing for every launch stage
            </h1>
          </section>

          {/* Plan cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-6 shadow-sm ${
                  plan.highlighted
                    ? "border-[#ff6b2c] bg-[#fff7f2]"
                    : "border-[#ece7e1] bg-white"
                }`}
              >
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#ff6b2c]">
                  {plan.name}
                </p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-black text-[#111827]">{plan.price}</span>
                  <span className="pb-1 text-sm text-[#64748b]">/month</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#64748b]">
                  {plan.description}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-[#475569]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="text-[#ff6b2c]">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/launch"
                  className="mt-6 inline-flex rounded-full bg-[#ff6b2c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#eb5d1f]"
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
      </div>
    </ContentShell>
  );
}
