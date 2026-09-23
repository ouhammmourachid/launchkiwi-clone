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
  const highlighted = product.badge === "PRIORITY";
  const meta = [product.category?.name, ...product.tags.filter((t) => t !== product.category?.name), product.pricing].filter(
    (v): v is string => !!v,
  );

  return (
    <div
      className={`group relative flex items-center justify-between gap-4 p-4 text-left transition ${
        highlighted
          ? "border-2 border-[#ca8a04] bg-[#161a0f] rounded-xl my-1 shadow-[0_0_15px_rgba(202,138,4,0.15)]"
          : "border-b border-[#1c2014] last:border-b-0 hover:bg-[#161a10]"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {showRank && (
          <span className={`w-5 text-center text-sm font-bold shrink-0 ${isTopRank ? "text-[#ca8a04]" : "text-[#727c65]"}`}>
            {index + 1}
          </span>
        )}

        <ProductLogo name={product.name} logoUrl={product.logoUrl} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none group-hover:text-[#86ba28] transition">
              {/* Stretched link: the whole row opens the product page. */}
              <Link href={`/p/${product.slug}`} className="after:absolute after:inset-0">
                {product.name}
              </Link>
            </h3>
            <ProductBadge badge={product.badge} />
          </div>

          <p className="mt-1 text-xs text-[#9aa48c] leading-snug line-clamp-1">{product.tagline}</p>

          {meta.length > 0 && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-[#656e58] font-medium">
              {meta.map((item, i) => (
                <span key={`${item}-${i}`} className="flex items-center gap-1.5">
                  {item}
                  {i < meta.length - 1 && <span className="text-[#3b4330]">•</span>}
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
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#262c1c] bg-[#141810] px-3 py-1.5 text-xs font-semibold text-[#a6b194] transition hover:border-[#3c452c] hover:text-white"
        >
          <span>Visit</span>
          <span className="text-[10px]">↗</span>
        </a>

        <UpvoteButton productId={product.id} productName={product.name} upvotes={product.upvotes} />
      </div>
    </div>
  );
}
