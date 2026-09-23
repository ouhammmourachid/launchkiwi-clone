/**
 * app/p/[slug]/page.tsx — Product detail
 * Listing details, editorial review (if any), comments and related products.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import { CommentSection } from "@/components/comments/comment-section";
import { ContentShell } from "@/components/layout/content-shell";
import { FavoriteButton } from "@/components/products/favorite-button";
import { ProductList } from "@/components/products/product-list";
import { ProductLogo } from "@/components/products/product-logo";
import { UpvoteButton } from "@/components/products/upvote-button";
import { buttonClasses } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ProductBadge } from "@/components/ui/product-badge";
import { ReviewArticle } from "@/components/reviews/review-article";
import { getProductBySlug, getRelatedProducts } from "@/lib/api/products";
import { getReviewForProduct } from "@/lib/api/reviews";
import { displayHost, formatDate } from "@/lib/utils/format";

type Params = Promise<{ slug: string }>;

// Shared by generateMetadata and the page within one request.
const loadProduct = cache(getProductBySlug);

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await loadProduct((await params).slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: { title: product.name, description: product.tagline, images: product.logoUrl ? [product.logoUrl] : [] },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await loadProduct((await params).slug);
  if (!product) notFound();

  const [review, related] = await Promise.all([getReviewForProduct(product.id), getRelatedProducts(product)]);

  const details = [
    { label: "Category", value: product.category?.name },
    { label: "Website", value: displayHost(product.websiteUrl) },
    { label: "Pricing", value: product.pricing },
    { label: "Launched", value: formatDate(product.launchedAt) },
  ].filter((d): d is { label: string; value: string } => !!d.value);

  return (
    <ContentShell>
      <div className="space-y-6 pb-12">
        <nav aria-label="Breadcrumb" className="text-xs text-[#727c65]">
          <Link href="/browse" className="hover:text-white">
            All launches
          </Link>
          {product.category && (
            <>
              <span className="mx-1.5">/</span>
              <Link href={`/browse?category=${product.category.slug}`} className="hover:text-white">
                {product.category.name}
              </Link>
            </>
          )}
        </nav>

        <Panel className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <ProductLogo name={product.name} logoUrl={product.logoUrl} size="lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{product.name}</h1>
                <ProductBadge badge={product.badge} />
              </div>
              <p className="mt-2 text-sm text-[#9aa48c] leading-relaxed">{product.tagline}</p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <a href={product.websiteUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses({ size: "sm" })}>
                  Visit site ↗
                </a>
                <FavoriteButton productId={product.id} />
                {review && (
                  <a href="#review" className="text-xs font-bold text-[#86ba28] hover:underline">
                    Read our review →
                  </a>
                )}
              </div>
            </div>
            <UpvoteButton productId={product.id} productName={product.name} upvotes={product.upvotes} size="lg" />
          </div>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <div className="space-y-6 min-w-0">
            <Panel className="p-6">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#a6b194]">About</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#c5ceb8]">
                {product.description.length > 0 ? (
                  product.description.map((paragraph, i) => <p key={i}>{paragraph}</p>)
                ) : (
                  <p>{product.tagline}</p>
                )}
              </div>
            </Panel>

            {review && <ReviewArticle review={review} />}

            <CommentSection productId={product.id} />
          </div>

          <aside className="space-y-6">
            <Panel className="p-5">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#a6b194]">Details</h2>
              <dl className="mt-3 space-y-2.5 text-xs">
                {details.map((d) => (
                  <div key={d.label} className="flex justify-between gap-3">
                    <dt className="text-[#727c65]">{d.label}</dt>
                    <dd className="truncate font-semibold text-white">{d.value}</dd>
                  </div>
                ))}
              </dl>
              {product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/browse?q=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-[#23291c] bg-[#0f120b] px-2.5 py-0.5 text-[10px] font-semibold text-[#a6b194] hover:text-white"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </Panel>
          </aside>
        </div>

        {related.length > 0 && <ProductList title="More in this category" products={related} showRank={false} />}
      </div>
    </ContentShell>
  );
}
