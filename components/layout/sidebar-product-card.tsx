/**
 * sidebar-product-card.tsx
 * Compact featured-product card, paid spotlight ad card and open advertise
 * slot used by both sidebars and the mobile featured grid.
 * Styled after launchdunes.com: borderless tinted cards that pop in, then dashed ad slots.
 */

import Link from "next/link";

import { ProductLogo } from "@/components/products/product-logo";
import type { ProductSummary, SpotlightAd } from "@/lib/types/models";

// Tints cycle green -> amber -> gold, matching the reference site's primary/accent/premium.
const TONES = [
  "bg-sun/[0.13] hover:bg-sun/[0.18]",
  "bg-ember/[0.16] hover:bg-ember/[0.22]",
  "bg-[#c9a227]/[0.16] hover:bg-[#c9a227]/[0.22]",
];

const CARD_MOTION ="animate-card-pop transition-[transform,background-color,border-color] hover:scale-[1.03]";

interface SidebarProductCardProps {
  product: ProductSummary;
  index: number;
}

export function SidebarProductCard({ product, index }: SidebarProductCardProps) {
  return (
    <Link
      href={`/p/${product.slug}`}
      className={`group flex flex-col gap-2 rounded-2xl p-4 ${CARD_MOTION} ${TONES[index % TONES.length]}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-2.5">
        <ProductLogo name={product.name} logoUrl={product.logoUrl} size="sm" />
        <h4 className="product-name flex-1 truncate text-[15px] font-bold leading-snug">{product.name}</h4>
        <ExternalIcon />
      </div>
      <p className="line-clamp-2 text-[13px] leading-relaxed text-dune-200">{product.tagline}</p>
    </Link>
  );
}

/** A paid spotlight ad. Clicks go through PocketBase so they're counted. */
export function SidebarAdCard({ ad, index }: { ad: SpotlightAd; index: number }) {
  return (
    <a
      href={ad.clickUrl}
      target="_blank"
      rel="sponsored noopener"
      className={`group flex flex-col gap-2 rounded-2xl border border-sun/30 bg-sun/[0.07] p-4 hover:border-sun/60 hover:bg-sun/[0.11] ${CARD_MOTION}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-2.5">
        <ProductLogo name={ad.name} logoUrl={ad.logoUrl} size="sm" />
        <h4 className="product-name flex-1 truncate text-[15px] font-bold leading-snug">{ad.name}</h4>
        <ExternalIcon />
      </div>
      <p className="line-clamp-2 text-[13px] leading-relaxed text-dune-200">{ad.tagline}</p>
      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-sun">Sponsored</span>
    </a>
  );
}

export function SidebarAdvertiseSlot({ index }: { index: number }) {
  return (
    <Link
      href="/advertise"
      className={`group flex items-center justify-center gap-2 rounded-2xl border border-dashed border-dune-800 p-10 hover:border-ember/40 hover:bg-ember/5 ${CARD_MOTION}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[15px] w-[15px] shrink-0 text-dune-750 transition-colors group-hover:text-ember/60" aria-hidden>
        <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
        <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
        <path d="M8 6v8" />
      </svg>
      <div className="min-w-0">
        <p className="text-xs font-semibold leading-snug text-dune-200 transition-colors group-hover:text-sun-bright">Advertise</p>
        <p className="text-[10px] leading-snug text-dune-500">Book this slot</p>
      </div>
    </Link>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 shrink-0 text-sun-bright opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
