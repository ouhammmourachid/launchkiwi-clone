/**
 * plan-card.tsx
 * A pricing plan card (name, price, pitch, features) with a caller-supplied
 * call to action. Shared by /pricing and /upgrade.
 */

import type { ReactNode } from "react";

import type { PricingPlan } from "@/lib/types/models";
import { formatPlanPrice } from "@/lib/utils/format";

export function PlanCard({ plan, action }: { plan: PricingPlan; action: ReactNode }) {
  return (
    <div
      className={`flex flex-col rounded-[24px] border p-6 ${
        plan.highlighted ?"border-sun bg-dune-925" :"border-dune-850 bg-dune-940"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sun">{plan.name}</p>
        {plan.highlighted && (
          <span className="rounded-full bg-sun px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-on-sun">Best value</span>
        )}
      </div>
      <div className="mt-4 flex items-end gap-2">
        <span className="text-4xl font-black text-white">{formatPlanPrice(plan)}</span>
        <span className="pb-1 text-xs text-dune-500">one-time</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-dune-300">{plan.description}</p>
      <ul className="mt-5 flex-1 space-y-2 text-xs text-dune-100">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="text-sun">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-6">{action}</div>
    </div>
  );
}
