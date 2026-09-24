/**
 * review-article.tsx
 * Teaser for a product's editorial review, shown on the product page and
 * linking to the full review at /p/<slug>/review.
 */

import Link from "next/link";

import { CheckIcon } from "@/components/layout/nav-icons";
import { CardTitle } from "@/components/ui/card-title";
import { Panel } from "@/components/ui/panel";
import type { ReviewDetail } from "@/lib/types/models";
import { formatDate } from "@/lib/utils/format";

export function ReviewTeaser({ review, productSlug }: { review: ReviewDetail; productSlug: string }) {
  return (
    <Panel id="review" className="scroll-mt-24 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>Editorial review</CardTitle>
          <h2 className="mt-3 text-lg font-black tracking-tight text-white">{review.title}</h2>
          <p className="mt-1 text-xs text-dune-500">{formatDate(review.publishedAt)}</p>
        </div>
        <RatingPill rating={review.rating} />
      </div>
      {review.takeaways.length > 0 && (
        <ul className="mt-4 space-y-2">
          {review.takeaways.map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-dune-100">
              <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-sun" />
              {t}
            </li>
          ))}
        </ul>
      )}
      <Link href={`/p/${productSlug}/review`} className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-sun hover:underline">
        Read the full review →
      </Link>
    </Panel>
  );
}

export function RatingPill({ rating }: { rating: number }) {
  return (
    <div className="shrink-0 rounded-xl border border-dune-850 bg-dune-925 px-3 py-1 text-center">
      <span className="text-sm font-black text-sun leading-none block">{rating}</span>
      <span className="text-[9px] font-semibold text-dune-600 block -mt-0.5">/10</span>
    </div>
  );
}
