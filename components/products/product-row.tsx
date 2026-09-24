/**
 * product-row.tsx
 * A single row in a product listing — rank number, logo, info, and vote button.
 * Server-renderable; only the upvote button hydrates on the client.
 */

import Link from "next/link";

import { ProductLogo } from "@/components/products/product-logo";
import { UpvoteButton } from "@/components/products/upvote-button";
import { ProductBadge } from "@/components/ui/product-badge";
import type { ProductSummary } from "@/lib/types/models";

interface ProductRowProps {
  product: ProductSummary;
  index: number;
  showRank?: boolean;
}

export function ProductRow({ product, index, showRank = true }: ProductRowProps) {
  const isTopRank = index < 3;
  // Paid placements (Priority/Premium) read as one pinned block: gold edge, warm tint, hairline dividers.
  const pinned = product.badge !== null;
  const meta = [product.category?.name, ...product.tags.filter((t) => t !== product.category?.name), product.pricing].filter(
    (v): v is string => !!v,
  );

  return (
    <div
      className={`group relative flex items-center justify-between gap-3 p-3 text-left transition sm:gap-4 sm:p-4 ${
        pinned
          ? "border-l-[3px] border-l-[#ca8a04] border-b border-b-[#ca8a04]/15 last:border-b-0 bg-[#ca8a04]/[0.08] hover:bg-[#ca8a04]/[0.12]"
          : "border-b border-dune-900 last:border-b-0 hover:bg-dune-925"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 sm:gap-3.5">
        {showRank && (
          <span
            className={`hidden h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums sm:flex ${
              isTopRank ? "bg-[#ca8a04]/15 text-[#ca8a04]" : "text-dune-600"
            }`}
          >
            {index + 1}
          </span>
        )}

        <ProductLogo name={product.name} logoUrl={product.logoUrl} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none group-hover:text-sun transition">
              {/* Stretched link: the whole row opens the product page. */}
              <Link href={`/p/${product.slug}`} className="after:absolute after:inset-0">
                {product.name}
              </Link>
            </h3>
            <ProductBadge badge={product.badge} />
          </div>

          <p className="mt-1 text-xs text-dune-300 leading-snug line-clamp-1">{product.tagline}</p>

          {meta.length > 0 && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-dune-600 font-medium">
              {meta.map((item, i) => (
                <span key={`${item}-${i}`} className="flex items-center gap-1.5">
                  {item}
                  {i < meta.length - 1 && <span className="text-dune-750">·</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions sit above the stretched link. */}
      <div className="relative z-10 flex items-center gap-2.5 shrink-0">
        <a
          href={product.websiteUrl}
          target="_blank"
          rel={product.dofollow ? "noopener" : "nofollow noopener"}
          className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold transition ${
            pinned
              ? "px-1 py-1.5 text-dune-500 hover:text-sun"
              : "rounded-lg border border-dune-850 bg-dune-925 px-3 py-1.5 text-dune-200 hover:border-dune-750 hover:text-white"
          }`}
        >
          <span>Visit</span>
          <span className="text-[10px]">↗</span>
        </a>

        <UpvoteButton productId={product.id} productName={product.name} upvotes={product.upvotes} />
      </div>
    </div>
  );
}
