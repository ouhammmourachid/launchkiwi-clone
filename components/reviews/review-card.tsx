/**
 * review-card.tsx
 * Card component for a single editorial review entry.
 */

import Link from "next/link";
import type { ReviewItem } from "@/data/site";
import { ProductIcon } from "@/components/ui/product-icon";

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="group flex flex-col justify-between rounded-[20px] border border-[#22271a] bg-[#13160e] p-5 transition hover:border-[#38412b] shadow-md">
      <div>
        {/* Card header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <ProductIcon type={review.iconType} />
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#86ba28] block truncate">
                {review.badge}
              </span>
              <span className="text-xs text-[#78826b] block mt-0.5 truncate">
                {review.date}
              </span>
            </div>
          </div>

          {/* Rating pill */}
          <div className="shrink-0 rounded-xl border border-[#262c1c] bg-[#161a10] px-3 py-1 text-center">
            <span className="text-sm font-black text-[#86ba28] leading-none block">
              {review.rating}
            </span>
            <span className="text-[9px] font-semibold text-[#5e6652] block -mt-0.5">
              /10
            </span>
          </div>
        </div>

        {/* Review title */}
        <h3 className="mt-4 text-base sm:text-lg font-black tracking-tight text-white leading-snug group-hover:text-[#86ba28] transition">
          {review.title}
        </h3>

        {/* Description snippet */}
        <p className="mt-2.5 text-xs text-[#9aa48c] leading-relaxed line-clamp-2">
          {review.description}
        </p>
      </div>

      {/* CTA */}
      <div className="mt-4 pt-2">
        <Link
          href={`/reviews/${review.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#86ba28] transition hover:underline"
        >
          <span>Read review</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
