/**
 * product-badge.tsx
 * Renders the PRIORITY or PREMIUM badge pill on a product listing row.
 */

import type { ProductBadge as Badge } from "@/lib/types/models";

export function ProductBadge({ badge }: { badge: Badge | null }) {
  if (badge === "PRIORITY") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-[#282310] border border-[#483e18] light:bg-[#fdf3d0] light:border-[#ecd48a] light:text-[#a16207] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#eab308]">
        📌 PRIORITY
      </span>
    );
  }
  if (badge === "PREMIUM") {
    return (
      <span className="inline-flex items-center gap-1 rounded bg-[#232014] border border-[#3e3920] light:bg-[#f7efd6] light:border-[#e0cf9a] light:text-[#8a6d14] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#d4af37]">
        ⭐ PREMIUM
      </span>
    );
  }
  return null;
}
