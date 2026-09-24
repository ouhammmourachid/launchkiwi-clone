/**
 * app/p/[slug]/review/page.tsx — Editorial review
 * Laid out after launchkiwi.com's review pages: a hero with the overall score
 * ring, then key takeaways, the long-form write-up, per-criterion ratings,
 * best for / not ideal for, pros & cons and a closing verdict.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CheckIcon, ExternalLinkIcon, MinusIcon } from "@/components/layout/nav-icons";
import { ProductLogo } from "@/components/products/product-logo";
import { ScoreBar, ScoreRing } from "@/components/reviews/review-scores";
import { buttonClasses } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/api/products";
import { getReviewForProduct } from "@/lib/api/reviews";
import { formatDate } from "@/lib/utils/format";

type Params = Promise<{ slug: string }>;

// Shared by generateMetadata and the page within one request.
const loadReview = cache(async (slug: string) => {
  const product = await getProductBySlug(slug);
  const review = product ? await getReviewForProduct(product.id) : null;
  return product && review ? { product, review } : null;
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await loadReview((await params).slug);
  if (!data) return { title: "Review not found" };
  const { product, review } = data;
  const description = review.verdict || product.tagline;
  return {
    title: `${product.name} review`,
    description,
    openGraph: {
      type: "article",
      title: review.title,
      description,
      publishedTime: review.publishedAt,
      images: product.screenshotUrl ? [product.screenshotUrl] : product.logoUrl ? [product.logoUrl] : [],
    },
  };
}

export default async function ReviewPage({ params }: { params: Params }) {
  const data = await loadReview((await params).slug);
  if (!data) notFound();
  const { product, review } = data;

  const listingHref = `/p/${product.slug}`;
  const websiteRel = product.dofollow ? "noopener" : "nofollow noopener";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    headline: review.title,
    datePublished: review.publishedAt,
    reviewBody: review.verdict || undefined,
    itemReviewed: { "@type": "SoftwareApplication", name: product.name, url: product.websiteUrl },
    reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 10, worstRating: 0 },
    author: { "@type": "Organization", name: "LaunchDunes" },
  };

  return (
    <div className="pb-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(55%_70%_at_20%_0%,color-mix(in_oklab,var(--color-sun)_16%,transparent),transparent_70%),radial-gradient(40%_60%_at_90%_10%,color-mix(in_oklab,var(--color-ember)_10%,transparent),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-4 pt-8 sm:px-6 sm:pt-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-dune-500">
            <Link href="/reviews" className="transition hover:text-sun">
              Reviews
            </Link>
            <span aria-hidden className="text-dune-700">/</span>
            <Link href={listingHref} className="normal-case tracking-normal text-dune-200 transition hover:text-sun">
              {product.name}
            </Link>
            <span className="ml-1 rounded-full bg-sun/[0.12] px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-sun light:text-sun-deep">
              Editorial Review
            </span>
            {product.category && (
              <span className="rounded-full bg-dune-900 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-dune-400">
                {product.category.name}
              </span>
            )}
          </nav>

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-4 flex items-center gap-3">
                <ProductLogo name={product.name} logoUrl={product.logoUrl} />
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wide text-sun">LaunchDunes Review</span>
                  <time dateTime={review.publishedAt} className="block text-xs text-dune-500">
                    {formatDate(review.publishedAt)}
                  </time>
                </div>
              </div>
              <h1 className="max-w-2xl font-display text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">{review.title}</h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-dune-300 sm:text-lg">{product.tagline}</p>
            </div>

            <div className="flex shrink-0 items-center gap-4 self-start rounded-2xl border border-sun/20 bg-dune-940/70 px-5 py-4 backdrop-blur-sm lg:self-auto">
              <ScoreRing rating={review.rating} />
              <div>
                <p className="font-display text-2xl font-black leading-none text-white">
                  {review.rating}
                  <span className="text-sm font-semibold text-dune-500">/10</span>
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-dune-500">Overall score</p>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href={product.websiteUrl} target="_blank" rel={websiteRel} className={buttonClasses({ className: "rounded-xl" })}>
              Visit {product.name}
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
            <Link href={listingHref} className="text-sm font-semibold text-sun hover:underline light:text-sun-deep">
              LaunchDunes listing →
            </Link>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-dune-850 to-transparent" aria-hidden />
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {review.takeaways.length > 0 && (
          <section className="mb-10 rounded-2xl border border-sun/15 bg-sun/[0.05] p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-sun light:text-sun-deep">Key takeaways</h2>
            <ul className="space-y-2">
              {review.takeaways.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-dune-100">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sun text-on-sun">
                    <CheckIcon className="h-2.5 w-2.5" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Admin-authored HTML: only published editorial reviews reach this page. */}
        <div
          className="text-[15px] leading-relaxed text-dune-100 [&_a]:font-semibold [&_a]:text-sun [&_em]:italic [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:border-t [&_h2]:border-dune-850 [&_h2]:pt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:text-white [&_h2:first-child]:mt-0 [&_h2:first-child]:border-t-0 [&_h2:first-child]:pt-0 [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_li]:mt-1.5 [&_p]:mb-4 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: review.contentHtml }}
        />

        {review.scores.length > 0 && (
          <section className="mt-10 rounded-2xl border border-dune-850 bg-dune-940 p-6">
            <h2 className="mb-1 font-display text-2xl font-black tracking-tight text-white">Editorial ratings</h2>
            <p className="mb-6 text-xs text-dune-500">Editorial assessment based on the maker&apos;s submitted listing — not hands-on testing.</p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              {review.scores.map((s) => (
                <ScoreBar key={s.label} score={s} />
              ))}
            </div>
          </section>
        )}

        {(review.bestFor || review.notIdealFor) && (
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {review.bestFor && (
              <div className="rounded-xl border border-emerald-900/60 bg-emerald-950/25 p-4 light:border-emerald-100 light:bg-emerald-50">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 light:text-emerald-700">Best for</p>
                <p className="text-sm text-dune-100">{review.bestFor}</p>
              </div>
            )}
            {review.notIdealFor && (
              <div className="rounded-xl border border-ember/30 bg-ember/[0.08] p-4">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-[#e8743b] light:text-ember">Not ideal for</p>
                <p className="text-sm text-dune-100">{review.notIdealFor}</p>
              </div>
            )}
          </div>
        )}

        {(review.pros.length > 0 || review.cons.length > 0) && (
          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-dune-850 pt-8 sm:grid-cols-2">
            <ProsCons title="Pros" items={review.pros} icon={<CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 light:text-emerald-600" />} />
            <ProsCons title="Cons" items={review.cons} icon={<MinusIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#e8743b] light:text-ember" />} />
          </div>
        )}

        {review.verdict && (
          <section className="mt-10 rounded-2xl border border-dune-850 bg-dune-940 p-6 sm:p-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-sun light:text-sun-deep">Verdict</p>
            <blockquote className="border-l-2 border-sun pl-4 font-display text-lg font-semibold leading-relaxed text-white sm:text-xl">
              <p>{review.verdict}</p>
            </blockquote>
          </section>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-dune-850 pt-8">
          <a href={product.websiteUrl} target="_blank" rel={websiteRel} className={buttonClasses({ className: "rounded-xl" })}>
            Visit {product.name} ↗
          </a>
          <Link href={listingHref} className="text-sm font-semibold text-sun hover:underline light:text-sun-deep">
            View full listing →
          </Link>
        </div>
      </article>
    </div>
  );
}

function ProsCons({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="mb-2.5 text-[10px] font-bold uppercase tracking-widest text-dune-500">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-dune-100">
            {icon}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
