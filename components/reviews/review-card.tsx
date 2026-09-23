/**
 * review-card.tsx
 * Card component for a single editorial review entry.
 */

import Link from "next/link";

import { ProductLogo } from "@/components/products/product-logo";
import { RatingPill } from "@/components/reviews/review-article";
import type { ReviewSummary } from "@/lib/types/models";
import { formatDate } from "@/lib/utils/format";

export function ReviewCard({ review }: { review: ReviewSummary }) {
  const { product } = review;
  if (!product) return null;

  return (
    <article className="group relative flex flex-col justify-between rounded-[20px] border border-[#22271a] bg-[#13160e] p-5 transition hover:border-[#38412b] shadow-md">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <ProductLogo name={product.name} logoUrl={product.logoUrl} />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#86ba28] block truncate">{product.name}</span>
              <span className="text-xs text-[#78826b] block mt-0.5 truncate">{formatDate(review.publishedAt)}</span>
            </div>
          </div>
          <RatingPill rating={review.rating} />
        </div>

        <h3 className="mt-4 text-base sm:text-lg font-black tracking-tight text-white leading-snug group-hover:text-[#86ba28] transition">
          {review.title}
        </h3>

        <p className="mt-2.5 text-xs text-[#9aa48c] leading-relaxed line-clamp-2">{product.tagline}</p>
      </div>

      <div className="mt-4 pt-2">
        <Link
          href={`/p/${product.slug}#review`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#86ba28] transition hover:underline after:absolute after:inset-0"
        >
          <span>Read review</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  );
}
