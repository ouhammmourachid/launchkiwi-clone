/**
 * product-row.tsx
 * A single row in a product listing — rank number, logo, info, and vote button.
 * Server-renderable; only the upvote button hydrates on the client.
 * Rows carry no borders of their own: the list container divides them.
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
  // Paid placements (Priority/Premium) get a gold edge and a warm tint.
  const pinned = product.badge !== null;
  const meta = [product.pricing, product.category?.name, ...product.tags.filter((t) => t !== product.category?.name)].filter(
    (v): v is string => !!v,
  );

  return (
    <div
      className={`group relative flex items-center gap-3 py-3.5 pr-3 pl-2.5 transition-colors sm:gap-4 sm:pr-4 sm:pl-3.5 ${
        pinned ? "border-l-4 border-l-[#ca8a04] bg-[#ca8a04]/[0.06] hover:bg-[#ca8a04]/[0.1]" : "product-item"
      }`}
    >
      {showRank && (
        <span className="hidden h-6 w-6 shrink-0 select-none items-center justify-center rounded-full bg-sun/10 font-display text-[11px] font-bold tabular-nums text-sun sm:flex">
          {index + 1}
        </span>
      )}

      <div className="shrink-0 transition-transform group-hover:scale-105">
        <ProductLogo name={product.name} logoUrl={product.logoUrl} size="row" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="product-name truncate font-display text-sm font-bold leading-snug">
            {/* Stretched link: the whole row opens the product page. */}
            <Link href={`/p/${product.slug}`} className="after:absolute after:inset-0">
              {product.name}
            </Link>
          </h3>
          <ProductBadge badge={product.badge} />
        </div>

        <p className="line-clamp-1 text-xs leading-relaxed text-dune-400">{product.tagline}</p>

        {meta.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-dune-500">
            {meta.map((item, i) => (
              <span key={`${item}-${i}`} className={`flex items-center gap-1.5 ${i === 0 && product.pricing ? "font-semibold" : ""}`}>
                {i > 0 && <span className="h-0.5 w-0.5 rounded-full bg-dune-700" aria-hidden="true" />}
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions sit above the stretched link. */}
      <a
        href={product.websiteUrl}
        target="_blank"
        rel={product.dofollow ? "noopener" : "nofollow noopener"}
        className="relative z-10 hidden shrink-0 text-[11px] font-semibold text-dune-500 transition-colors hover:text-sun sm:block"
      >
        Visit ↗
      </a>

      <div className="relative z-10">
        <UpvoteButton productId={product.id} productName={product.name} upvotes={product.upvotes} />
      </div>
    </div>
  );
}
