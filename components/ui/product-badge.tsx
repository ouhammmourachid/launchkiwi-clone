/**
 * product-badge.tsx
 * Renders the PRIORITY or PREMIUM badge pill on a product listing row:
 * a black chip with gold text that a light sweep runs across.
 */

import { CrownIcon, RocketIcon } from "@/components/layout/nav-icons";
import type { ProductBadge as Badge } from "@/lib/types/models";

const BADGES = {
  PRIORITY: { label: "Priority", Icon: RocketIcon, color: "#eab308" },
  PREMIUM: { label: "Premium", Icon: CrownIcon, color: "#d4af37" },
} as const;

export function ProductBadge({ badge }: { badge: Badge | null }) {
  if (!badge) return null;
  const { label, Icon, color } = BADGES[badge];

  return (
    <span className="inline-flex shrink-0 items-center gap-1 overflow-hidden rounded bg-black px-1.5 py-px uppercase tracking-wide">
      <span style={{ color }}>
        <Icon className="h-[9px] w-[9px]" />
      </span>
      <span
        className="animate-shine bg-clip-text text-[9px] font-bold text-transparent"
        style={{ backgroundImage: `linear-gradient(110deg, ${color} 35%, #fff 50%, ${color} 65%)` }}
      >
        {label}
      </span>
    </span>
  );
}
