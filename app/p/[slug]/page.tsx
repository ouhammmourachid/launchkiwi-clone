/**
 * app/p/[slug]/page.tsx — Product detail
 * Laid out after launchkiwi.com: a dark hero band (breadcrumb, logo, name,
 * tagline, actions, upvote), then the preview / about / review teaser /
 * comments column beside a details + categories + featured sidebar, then
 * more products. The full review lives at /p/<slug>/review.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CommentSection } from "@/components/comments/comment-section";
import { ExternalLinkIcon, GlobeIcon, GridIcon, VerifiedIcon } from "@/components/layout/nav-icons";
import { FavoriteButton } from "@/components/products/favorite-button";
import { ProductLogo } from "@/components/products/product-logo";
import { UpvoteButton } from "@/components/products/upvote-button";
import { ReviewTeaser } from "@/components/reviews/review-article";
import { buttonClasses } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card-title";
import { Panel } from "@/components/ui/panel";
import { ProductBadge } from "@/components/ui/product-badge";
import { getFeaturedProducts, getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import { getReviewForProduct } from "@/lib/api/reviews";
import type { ProductSummary } from "@/lib/types/models";
import { displayHost, formatDate, formatNumber } from "@/lib/utils/format";

type Params = Promise<{ slug: string }>;

const FEATURED_LIMIT = 4;

// Shared by generateMetadata and the page within one request.
const loadProduct = cache(getProductBySlug);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: product.screenshotUrl ? [product.screenshotUrl] : product.logoUrl ? [product.logoUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await loadProduct((await params).slug);
  if (!product) notFound();

  const [review, related, featured] = await Promise.all([
    getReviewForProduct(product.id),
    getRelatedProducts(product),
    getFeaturedProducts(FEATURED_LIMIT + 1).catch(() => []),
  ]);
  const featuredOthers = featured.filter((p) => p.id !== product.id).slice(0, FEATURED_LIMIT);
  const websiteRel = product.dofollow ? "noopener" : "nofollow noopener";
  const chips = [...new Set([product.category?.name, ...product.tags].filter((c): c is string => !!c))];

  return (
    <div className="pb-14">
      {/* Hero: themed surface with a soft sun glow, no dark band. */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(55%_70%_at_20%_0%,color-mix(in_oklab,var(--color-sun)_16%,transparent),transparent_70%),radial-gradient(40%_60%_at_90%_10%,color-mix(in_oklab,var(--color-ember)_10%,transparent),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[1140px] px-4 pt-8 sm:pt-10">
          <nav aria-label="Breadcrumb" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dune-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-sun">
                  Home
                </Link>
              </li>
              {product.category && (
                <>
                  <li aria-hidden className="text-dune-700">/</li>
                  <li>
                    <Link href={`/browse?category=${product.category.slug}`} className="transition hover:text-sun">
                      {product.category.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden className="text-dune-700">/</li>
              <li aria-current="page" className="truncate text-white">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
            <div className="shrink-0 rounded-[22px] bg-dune-940 p-1.5 ring-1 ring-dune-850">
              <ProductLogo name={product.name} logoUrl={product.logoUrl} size="xl" />
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-[42px] sm:leading-none">{product.name}</h1>
                {product.verified && (
                  <span title="Verified maker" className="text-sun">
                    <VerifiedIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="sr-only">Verified</span>
                  </span>
                )}
                <ProductBadge badge={product.badge} />
              </div>
              <p className="mt-3 max-w-[580px] text-sm leading-relaxed text-dune-300 sm:text-base">{product.tagline}</p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <a
                  href={product.websiteUrl}
                  target="_blank"
                  rel={websiteRel}
                  className={buttonClasses({ className: "rounded-xl hover:-translate-y-px" })}
                >
                  <GlobeIcon className="h-4 w-4" />
                  Visit Site
                </a>
                {review && (
                  <Link href={`/p/${product.slug}/review`} className={buttonClasses({ variant: "secondary", className: "rounded-xl hover:border-sun/50" })}>
                    Read our review →
                  </Link>
                )}
                <FavoriteButton productId={product.id} />
              </div>
            </div>

            <div className="hidden sm:block">
              <UpvoteButton productId={product.id} productName={product.name} upvotes={product.upvotes} size="lg" />
            </div>
          </div>

          <div className="mt-8 h-px bg-gradient-to-r from-transparent via-dune-850 to-transparent" aria-hidden />
        </div>
      </section>

      <div className="mx-auto max-w-[1140px] px-4 pt-8">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
          <div className="min-w-0 space-y-6">
            {product.screenshotUrl && (
              <Panel className="overflow-hidden p-1.5">
                <Image
                  src={product.screenshotUrl}
                  alt={`${product.name} preview`}
                  width={1280}
                  height={800}
                  unoptimized
                  preload
                  className="h-auto w-full rounded-[18px]"
                />
              </Panel>
            )}

            <Panel className="p-6">
              <CardTitle>About {product.name}</CardTitle>
              <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-dune-100">
                {product.description.length > 0 ? (
                  product.description.map((paragraph, i) => <p key={i}>{paragraph}</p>)
                ) : (
                  <p>{product.tagline}</p>
                )}
              </div>
            </Panel>

            {review && <ReviewTeaser review={review} productSlug={product.slug} />}

            <CommentSection productId={product.id} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <Panel className="p-6">
              <CardTitle>Details</CardTitle>
              <dl className="mt-4 space-y-3 text-sm">
                {product.category && (
                  <DetailRow label="Category">
                    <Link href={`/browse?category=${product.category.slug}`} className="font-semibold text-sun hover:underline">
                      {product.category.name}
                    </Link>
                  </DetailRow>
                )}
                <DetailRow label="Website">
                  <a href={product.websiteUrl} target="_blank" rel={websiteRel} className="inline-flex items-center gap-1 font-semibold text-sun hover:underline">
                    {displayHost(product.websiteUrl)}
                    <ExternalLinkIcon className="h-3 w-3" />
                  </a>
                </DetailRow>
                {product.pricing && <DetailRow label="Pricing">{product.pricing}</DetailRow>}
                <DetailRow label="Published">{formatDate(product.launchedAt)}</DetailRow>
              </dl>
              <div className="mt-5 border-t border-dune-850 pt-5 text-center">
                <p className="text-3xl font-black tabular-nums text-white">{formatNumber(product.upvotes)}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-dune-500">Upvotes</p>
                <div className="mt-3 flex justify-center sm:hidden">
                  <UpvoteButton productId={product.id} productName={product.name} upvotes={product.upvotes} size="lg" />
                </div>
              </div>
            </Panel>

            {chips.length > 0 && (
              <Panel className="p-6">
                <CardTitle>Categories</CardTitle>
                <div className="mt-4 flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <Link
                      key={chip}
                      href={chip === product.category?.name ? `/browse?category=${product.category.slug}` : `/browse?q=${encodeURIComponent(chip)}`}
                      className="rounded-full bg-sun/[0.12] px-3 py-1 text-xs font-semibold text-sun transition hover:bg-sun/[0.2] light:text-sun-deep"
                    >
                      {chip}
                    </Link>
                  ))}
                </div>
              </Panel>
            )}

            {featuredOthers.length > 0 && (
              <Panel className="p-6">
                <CardTitle>Featured</CardTitle>
                <ul className="mt-4 space-y-3">
                  {featuredOthers.map((p) => (
                    <li key={p.id}>
                      <Link href={`/p/${p.slug}`} className="group flex items-center gap-3">
                        <ProductLogo name={p.name} logoUrl={p.logoUrl} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="product-name truncate text-sm font-semibold">{p.name}</span>
                            <ProductBadge badge={p.badge} />
                          </div>
                          <p className="truncate text-xs text-dune-400">{p.tagline}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-white">
              <GridIcon className="h-4 w-4 text-sun" />
              More Products
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <MoreProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-dune-500">{label}</dt>
      <dd className="truncate text-right font-medium text-white">{children}</dd>
    </div>
  );
}

function MoreProductCard({ product }: { product: ProductSummary }) {
  const chips = [product.category?.name, ...product.tags].filter((c): c is string => !!c).slice(0, 3);
  return (
    <Link
      href={`/p/${product.slug}`}
      className="product-item group flex flex-col rounded-[24px] border border-dune-850 p-5 transition hover:-translate-y-0.5 hover:border-sun/40"
    >
      <div className="flex items-center gap-3">
        <ProductLogo name={product.name} logoUrl={product.logoUrl} size="sm" />
        <h3 className="product-name truncate text-base font-bold">{product.name}</h3>
      </div>
      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[...new Set(chips)].map((chip) => (
            <span key={chip} className="rounded-md bg-dune-900 px-2 py-0.5 text-[11px] font-medium text-dune-300">
              {chip}
            </span>
          ))}
        </div>
      )}
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-dune-300">{product.tagline}</p>
    </Link>
  );
}
