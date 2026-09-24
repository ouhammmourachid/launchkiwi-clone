/**
 * product-badge.tsx
 * Renders the PRIORITY or PREMIUM badge pill on a product listing row.
 */

import { PinIcon, StarIcon } from "@/components/layout/nav-icons";
import type { ProductBadge as Badge } from "@/lib/types/models";

export function ProductBadge({ badge }: { badge: Badge | null }) {
  if (badge === "PRIORITY") {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-[#483e18] bg-black px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#eab308]">
        <PinIcon />
        Priority
      </span>
    );
  }
  if (badge === "PREMIUM") {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-[#3e3920] bg-black px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#d4af37]">
        <StarIcon />
        Premium
      </span>
    );
  }
  return null;
}
