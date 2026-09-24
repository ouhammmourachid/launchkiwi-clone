import { PRODUCT_EXPAND, toMyLaunch, toProductDetail, toProductSummary } from "@/lib/api/mappers";
import { PRODUCT_SORTS, type ProductSort } from "@/lib/catalog-options";
import { getPB } from "@/lib/pb/client";
import { isNotFound } from "@/lib/pb/errors";
import type { MyLaunch, Paginated, ProductDetail, ProductSummary } from "@/lib/types/models";
import type { PricingModel } from "@/lib/types/records";
import type { ProductSubmitInput } from "@/lib/validation/schemas";

export interface ProductQuery {
  search?: string;
  category?: string;
  pricing?: PricingModel;
  sort?: ProductSort;
  launchedAfter?: Date;
  launchedBefore?: Date;
  page?: number;
  perPage?: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS);

function buildFilter(q: ProductQuery): string {
  const pb = getPB();
  // Queued / scheduled launches stay hidden until their launch date.
  const parts = [pb.filter("status = {:status} && launch_date <= @now", { status: "published" })];
  if (q.search) {
    parts.push(pb.filter("(name ~ {:s} || tagline ~ {:s} || tags.name ?~ {:s} || category.name ~ {:s})", { s: q.search }));
  }
  if (q.category) parts.push(pb.filter("category.slug = {:category}", { category: q.category }));
  if (q.pricing) parts.push(pb.filter("pricing_model = {:pricing}", { pricing: q.pricing }));
  if (q.sort === "trending") parts.push(pb.filter("launch_date >= {:since}", { since: daysAgo(30) }));
  if (q.launchedAfter) parts.push(pb.filter("launch_date >= {:after}", { after: q.launchedAfter }));
  if (q.launchedBefore) parts.push(pb.filter("launch_date < {:before}", { before: q.launchedBefore }));
  return parts.join(" && ");
}

export async function listProducts(q: ProductQuery = {}, sortOverride?: string): Promise<Paginated<ProductSummary>> {
  const res = await getPB()
    .collection("products")
    .getList(q.page ?? 1, q.perPage ?? 20, {
      filter: buildFilter(q),
      sort: sortOverride ?? PRODUCT_SORTS[q.sort ?? "new"].sort,
      expand: PRODUCT_EXPAND,
    });
  return {
    items: res.items.map(toProductSummary),
    page: res.page,
    totalPages: res.totalPages,
    totalItems: res.totalItems,
  };
}

/** Home page sections: paid placements pin to the top of the current week. */
export async function getLaunchSections(limit = 15) {
  const [thisWeek, lastWeek, earlier] = await Promise.all([
    listProducts({ launchedAfter: daysAgo(7), perPage: limit }, "-priority_level,-upvotes,-launch_date"),
    listProducts({ launchedAfter: daysAgo(14), launchedBefore: daysAgo(7), perPage: limit, sort: "top" }),
    listProducts({ launchedAfter: daysAgo(30), launchedBefore: daysAgo(14), perPage: limit, sort: "top" }),
  ]);
  return { thisWeek, lastWeek, earlier };
}

/** Launches older than the home page's sections, one page at a time (the home "load more"). */
export function listOlderProducts(page: number, perPage = 15) {
  return listProducts({ launchedBefore: daysAgo(30), page, perPage, sort: "top" });
}

/** How many products launched this week and last week (the mobile menu's counters). */
export async function getWeeklyLaunchCounts(): Promise<{ thisWeek: number; lastWeek: number }> {
  const count = async (q: ProductQuery) =>
    (await getPB().collection("products").getList(1, 1, { filter: buildFilter(q), fields: "id" })).totalItems;
  const [thisWeek, lastWeek] = await Promise.all([
    count({ launchedAfter: daysAgo(7) }),
    count({ launchedAfter: daysAgo(14), launchedBefore: daysAgo(7) }),
  ]);
  return { thisWeek, lastWeek };
}

/** Paid (Premium/Priority) listings for sidebars. */
export async function getFeaturedProducts(limit = 5, offset = 0): Promise<ProductSummary[]> {
  const res = await getPB()
    .collection("products")
    .getList(1, limit + offset, {
      filter: 'status = "published" && priority_level > 0 && launch_date <= @now',
      sort: "-priority_level,-launch_date",
      expand: PRODUCT_EXPAND,
    });
  return res.items.slice(offset).map(toProductSummary);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  try {
    const pb = getPB();
    const record = await pb
      .collection("products")
      .getFirstListItem(pb.filter("slug = {:slug} && status = 'published'", { slug }), { expand: PRODUCT_EXPAND });
    return toProductDetail(record);
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

export async function getRelatedProducts(product: ProductSummary, limit = 4): Promise<ProductSummary[]> {
  if (!product.category) return [];
  const res = await listProducts({ category: product.category.slug, sort: "top", perPage: limit + 1 });
  return res.items.filter((p) => p.id !== product.id).slice(0, limit);
}

/** The maker's own launches, hidden ones included (the collection rules allow it). */
export async function listProductsByMaker(makerId: string): Promise<MyLaunch[]> {
  const pb = getPB();
  const items = await pb.collection("products").getFullList({
    filter: pb.filter("maker = {:maker}", { maker: makerId }),
    sort: "-created",
    expand: PRODUCT_EXPAND,
  });
  return items.map(toMyLaunch);
}

/**
 * Self-serve launch. Server hooks set status, slug and counters; the launch
 * stays hidden until its badge is verified (free) or its plan is paid. The first category is the primary one; all picks also become
 * tags when a tag with the same slug exists.
 */
export async function submitProduct(
  input: ProductSubmitInput,
  files: { logo: File; screenshot: File },
  categorySlugs: string[],
  tagIdsBySlug: Record<string, string>,
): Promise<ProductSummary> {
  const record = await getPB()
    .collection("products")
    .create(
      {
        name: input.name,
        slug: input.name,
        website_url: input.websiteUrl,
        tagline: input.tagline,
        description: input.description,
        category: input.categories[0],
        tags: categorySlugs.map((slug) => tagIdsBySlug[slug]).filter(Boolean),
        pricing_model: input.pricing,
        logo: files.logo,
        screenshots: [files.screenshot],
      },
      { expand: PRODUCT_EXPAND },
    );
  return toProductSummary(record);
}

/** Fresh upvote count, used to reconcile optimistic UI after a vote. */
export async function getUpvoteCount(productId: string): Promise<number> {
  const record = await getPB().collection("products").getOne(productId, { fields: "upvotes" });
  return record.upvotes ?? 0;
}
