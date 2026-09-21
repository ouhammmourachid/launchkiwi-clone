/**
 * product-row.tsx
 * A single row in a product listing — rank number, icon, info, and vote button.
 * This is the SINGLE definition replacing three identical copies that existed
 * across app/page.tsx, app/browse/page.tsx, and app/reviews/page.tsx.
 */

import type { Product } from "@/data/site";
import { ProductBadge } from "@/components/ui/product-badge";
import { ProductIcon } from "@/components/ui/product-icon";

interface ProductRowProps {
  product: Product;
  index: number;
}

export function ProductRow({ product, index }: ProductRowProps) {
  const isTopRank = index < 3;

  return (
    <div
      className={`group flex items-center justify-between gap-4 p-4 text-left transition ${
        product.highlighted
          ? "border-2 border-[#ca8a04] bg-[#161a0f] rounded-xl my-1 shadow-[0_0_15px_rgba(202,138,4,0.15)]"
          : "border-b border-[#1c2014] hover:bg-[#161a10]"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Rank number */}
        <span
          className={`w-5 text-center text-sm font-bold shrink-0 ${
            isTopRank ? "text-[#ca8a04]" : "text-[#727c65]"
          }`}
        >
          {index + 1}
        </span>

        {/* Product icon */}
        <ProductIcon type={product.iconType} />

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none group-hover:text-[#86ba28] transition">
              {product.name}
            </h3>
            <ProductBadge badge={product.badge} />
          </div>

          <p className="mt-1 text-xs text-[#9aa48c] leading-snug line-clamp-1">
            {product.description}
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-[#656e58] font-medium">
            {product.tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-1.5">
                {tag}
                {i < product.tags.length - 1 && (
                  <span className="text-[#3b4330]">•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a
          href={product.linkUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#262c1c] bg-[#141810] px-3 py-1.5 text-xs font-semibold text-[#a6b194] transition hover:border-[#3c452c] hover:text-white"
        >
          <span>Visit</span>
          <span className="text-[10px]">↗</span>
        </a>

        <button
          type="button"
          className="flex h-10 min-w-[42px] flex-col items-center justify-center rounded-xl border border-[#2b3120] bg-[#161a10] px-2.5 text-xs font-bold text-white transition hover:border-[#86ba28] hover:text-[#86ba28] cursor-pointer"
        >
          <span className="text-[10px] leading-none">▲</span>
          <span className="leading-tight">{product.votes}</span>
        </button>
      </div>
    </div>
  );
}
