/**
 * review-article.tsx
 * Full editorial review shown on a product page.
 * Content is admin-authored HTML (user reviews stay "pending" and are never listed).
 */

import { Panel } from "@/components/ui/panel";
import type { ReviewSummary } from "@/lib/types/models";
import { formatDate } from "@/lib/utils/format";

export function ReviewArticle({ review }: { review: ReviewSummary }) {
  return (
    <Panel id="review" className="scroll-mt-24 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#86ba28]">Editorial review</span>
          <h2 className="mt-1 text-lg font-black tracking-tight text-white">{review.title}</h2>
          <p className="mt-1 text-xs text-[#727c65]">{formatDate(review.publishedAt)}</p>
        </div>
        <RatingPill rating={review.rating} />
      </div>
      <div
        className="mt-4 space-y-3 text-sm leading-relaxed text-[#c5ceb8] [&_h3]:mt-5 [&_h3]:text-xs [&_h3]:font-black [&_h3]:uppercase [&_h3]:tracking-widest [&_h3]:text-[#a6b194] [&_li]:ml-4 [&_li]:list-disc [&_li]:mt-1.5"
        dangerouslySetInnerHTML={{ __html: review.contentHtml }}
      />
      <p className="mt-5 text-[11px] text-[#656e58]">Editorial assessment based on the maker&apos;s submitted listing — not hands-on testing.</p>
    </Panel>
  );
}

export function RatingPill({ rating }: { rating: number }) {
  return (
    <div className="shrink-0 rounded-xl border border-[#262c1c] bg-[#161a10] px-3 py-1 text-center">
      <span className="text-sm font-black text-[#86ba28] leading-none block">{rating}</span>
      <span className="text-[9px] font-semibold text-[#5e6652] block -mt-0.5">/10</span>
    </div>
  );
}
