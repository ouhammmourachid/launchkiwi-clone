/**
 * app/reviews/page.tsx — Editorial reviews listing (published reviews from PocketBase).
 */

import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { ContentShell } from "@/components/layout/content-shell";
import { ReviewCard } from "@/components/reviews/review-card";
import { EmptyState } from "@/components/ui/panel";
import { listPublishedReviews } from "@/lib/api/reviews";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Editorial write-ups of Priority-tier listings on LaunchDunes.",
};

export default async function ReviewsPage() {
  await connection();
  const reviews = await listPublishedReviews();

  return (
    <ContentShell>
      <div className="space-y-8 pb-12">
          {/* Page header */}
          <section className="pt-2 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-dune-400 block mb-1.5">
              LAUNCHDUNES
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              Reviews
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-dune-300 leading-relaxed max-w-xl">
              Editorial write-ups of Priority-tier listings — based on each maker&apos;s own submitted details, not hands-on testing.
            </p>
          </section>

          {/* Review cards grid */}
          {reviews.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </section>
          ) : (
            <EmptyState title="No reviews published yet" />
          )}

          {/* Priority upsell callout */}
          <section className="rounded-[24px] border border-dune-800 bg-dune-925 p-6 sm:p-8 shadow-md">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Want your product reviewed?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-dune-300 leading-relaxed max-w-2xl">
              Editorial reviews are a Priority-tier perk — pinned to the top for 14 days, plus an SEO-optimised review page with a dofollow backlink like the ones above.
            </p>
            <div className="mt-5">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full bg-sun px-5 py-2.5 text-xs font-bold text-dune-970 transition hover:bg-sun-bright shadow-sm cursor-pointer"
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
