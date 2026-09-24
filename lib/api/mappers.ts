import { getPB } from "@/lib/pb/client";
import type { Comment, EditableLaunch, MyLaunch, ProductDetail, ProductSummary, ReviewDetail, ReviewSummary, SessionUser } from "@/lib/types/models";
import type { CommentRecord, ProductRecord, ReviewRecord, UserRecord } from "@/lib/types/records";
import { htmlToParagraphs } from "@/lib/utils/format";

/** `expand` string that gives `toProductSummary` everything it needs. */
export const PRODUCT_EXPAND = "category,tags";

function fileUrl(record: { id: string; collectionId: string; collectionName: string }, filename: string, thumb?: string) {
  return filename ? getPB().files.getURL(record, filename, thumb ? { thumb } : undefined) : null;
}

export function toProductSummary(record: ProductRecord): ProductSummary {
  const category = record.expand?.category;
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    tagline: record.tagline,
    websiteUrl: record.website_url,
    logoUrl: fileUrl(record, record.logo),
    category: category ? { name: category.name, slug: category.slug } : null,
    tags: (record.expand?.tags ?? []).map((t) => t.name),
    pricing: record.pricing_model || null,
    upvotes: record.upvotes ?? 0,
    badge: record.priority_level >= 2 ? "PRIORITY" : record.priority_level === 1 ? "PREMIUM" : null,
    launchedAt: record.launch_date || record.created,
    dofollow: !!record.dofollow_enabled,
  };
}

export function toMyLaunch(record: ProductRecord): MyLaunch {
  return {
    ...toProductSummary(record),
    status: record.status,
    needsBadge: record.status === "pending" && !record.badge_verified && !record.instant_approved,
    badgeVerified: !!record.badge_verified,
    launchDate: record.launch_date,
  };
}

export function toEditableLaunch(record: ProductRecord): EditableLaunch {
  return {
    ...toMyLaunch(record),
    descriptionHtml: record.description ?? "",
    categoryId: record.category || null,
    tagRefs: (record.expand?.tags ?? []).map((t) => ({ id: t.id, slug: t.slug })),
    screenshotUrl: fileUrl(record, record.screenshots?.[0] ?? ""),
  };
}

export function toProductDetail(record: ProductRecord): ProductDetail {
  return {
    ...toProductSummary(record),
    description: htmlToParagraphs(record.description ?? ""),
    makerId: record.maker,
    screenshotUrl: fileUrl(record, record.screenshots?.[0] ?? ""),
    verified: !!record.verified,
  };
}

export function toReviewSummary(record: ReviewRecord): ReviewSummary {
  const product = record.expand?.product;
  return {
    id: record.id,
    title: record.title,
    rating: record.rating,
    publishedAt: record.published_at || record.created,
    contentHtml: record.content,
    product: product ? toProductSummary(product) : null,
  };
}

export function toReviewDetail(record: ReviewRecord): ReviewDetail {
  return {
    ...toReviewSummary(record),
    takeaways: record.takeaways ?? [],
    scores: record.scores ?? [],
    bestFor: record.best_for ?? "",
    notIdealFor: record.not_ideal_for ?? "",
    pros: record.pros ?? [],
    cons: record.cons ?? [],
    verdict: record.verdict ?? "",
  };
}

export function toSessionUser(record: UserRecord): SessionUser {
  return {
    id: record.id,
    email: record.email,
    name: record.name || record.email?.split("@")[0] || "Maker",
    avatarUrl: fileUrl(record, record.avatar, "100x100"),
  };
}

export function toComment(record: CommentRecord): Comment {
  const author = record.expand?.author;
  return {
    id: record.id,
    content: record.content,
    createdAt: record.created,
    approved: record.status === "approved",
    author: {
      id: record.author,
      name: author?.name || record.author_name || "Anonymous maker",
      avatarUrl: author ? fileUrl(author, author.avatar, "100x100") : null,
    },
  };
}
