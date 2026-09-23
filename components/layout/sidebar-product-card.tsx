/**
 * sidebar-product-card.tsx
 * Compact featured-product card and advertise slot used by both sidebars.
 * Styled after launchkiwi.com: borderless tinted cards that pop in, then dashed ad slots.
 */

import Link from "next/link";

import { ProductLogo } from "@/components/products/product-logo";
import type { ProductSummary } from "@/lib/types/models";

// Tints cycle green -> amber -> gold, matching the reference site's primary/accent/premium.
const TONES = [
  "bg-[#86ba28]/[0.13] hover:bg-[#86ba28]/[0.18]",
  "bg-[#a6641e]/[0.16] hover:bg-[#a6641e]/[0.22]",
  "bg-[#c9a227]/[0.16] hover:bg-[#c9a227]/[0.22]",
];

const CARD_MOTION = "animate-card-pop transition-[transform,box-shadow,background-color,border-color] hover:scale-[1.03] hover:shadow-md";

interface SidebarProductCardProps {
  product: ProductSummary;
  index: number;
}

export function SidebarProductCard({ product, index }: SidebarProductCardProps) {
  return (
    <Link
      href={`/p/${product.slug}`}
      className={`group flex flex-col gap-1.5 rounded-2xl p-3.5 ${CARD_MOTION} ${TONES[index % TONES.length]}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-2.5">
        <ProductLogo name={product.name} logoUrl={product.logoUrl} size="xs" />
        <h4 className="flex-1 truncate text-sm font-bold leading-snug text-white">{product.name}</h4>
        <ExternalIcon />
      </div>
      <p className="line-clamp-2 text-xs leading-relaxed text-[#a4ad95]">{product.tagline}</p>
    </Link>
  );
}

export function SidebarAdvertiseSlot({ index }: { index: number }) {
  return (
    <Link
      href="/advertise"
      className={`group flex items-center justify-center gap-2 rounded-2xl border border-dashed border-[#2d3522] p-10 hover:border-[#a6641e]/40 hover:bg-[#a6641e]/5 ${CARD_MOTION}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px] shrink-0 text-[#3a4330] transition-colors group-hover:text-[#a6641e]/60" aria-hidden>
        <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
        <path d="M8 6v8" />
      </svg>
      <div className="min-w-0">
        <p className="text-xs font-semibold leading-snug text-[#a4ad95] transition-colors group-hover:text-[#d08a3c]">Advertise</p>
        <p className="text-[10px] leading-snug text-[#6b7460]">Book this slot</p>
      </div>
    </Link>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0 text-[#d08a3c] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
