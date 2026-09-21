/**
 * app/reviews/page.tsx — Reviews listing page
 * ReviewCard is imported from the shared component.
 * All review data comes from data/site.ts.
 */

import Link from "next/link";

import { ContentShell } from "@/components/layout/content-shell";
import { ReviewCard } from "@/components/reviews/review-card";
import { reviewsData } from "@/data/site";

export default function ReviewsPage() {
  return (
    <ContentShell>
      <div className="space-y-8 pb-12">
          {/* Page header */}
          <section className="pt-2 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#868f77] block mb-1.5">
              LAUNCHKIWI
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Reviews
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-[#9aa48c] leading-relaxed max-w-xl">
              Editorial write-ups of Priority-tier listings — based on each maker&apos;s own submitted details, not hands-on testing.
            </p>
          </section>

          {/* Review cards grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviewsData.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </section>

          {/* Priority upsell callout */}
          <section className="rounded-[24px] border border-[#2a301e] bg-[#171a10] p-6 sm:p-8 shadow-md">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Want your product reviewed?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#9aa48c] leading-relaxed max-w-2xl">
              Editorial reviews are a Priority-tier perk — pinned to the top for 14 days, plus an SEO-optimised review page with a dofollow backlink like the ones above.
            </p>
            <div className="mt-5">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#86ba28] px-5 py-2.5 text-xs font-bold text-[#0a0d06] transition hover:bg-[#96cc2e] shadow-sm cursor-pointer"
              >
                <span>Get Priority</span>
                <span>→</span>
              </Link>
            </div>
          </section>
      </div>
    </ContentShell>
  );
}
