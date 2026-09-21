/**
 * product-badge.tsx
 * Renders the PRIORITY or PREMIUM badge pill on a product listing row.
 */

import type { Product } from "@/data/site";

interface ProductBadgeProps {
  badge: Product["badge"];
}

export function ProductBadge({ badge }: ProductBadgeProps) {
  if (badge === "PRIORITY") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-[#282310] border border-[#483e18] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#eab308]">
        📌 PRIORITY
      </span>
    );
  }
  if (badge === "PREMIUM") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-[#232014] border border-[#3e3920] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#d4af37]">
        ⭐ PREMIUM
      </span>
    );
  }
  return null;
}
