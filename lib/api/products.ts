import { PRODUCT_EXPAND, toEditableLaunch, toMyLaunch, toProductDetail, toProductSummary } from "@/lib/api/mappers";
import { PRODUCT_SORTS, type ProductSort } from "@/lib/catalog-options";
import { getPB } from "@/lib/pb/client";
import { isNotFound } from "@/lib/pb/errors";
import type { EditableLaunch, MyLaunch, Paginated, ProductDetail, ProductSummary } from "@/lib/types/models";
import type { PricingModel } from "@/lib/types/records";
import type { ProductEditInput, ProductSubmitInput } from "@/lib/validation/schemas";

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

/** The home page's launch sections, newest first. */
export type LaunchSection = "thisWeek" | "lastWeek" | "earlier";

const LAUNCH_SECTIONS: Record<LaunchSection, { query: () => ProductQuery; sort?: string }> = {
  // Paid placements pin to the top of the current week.
  thisWeek: { query: () => ({ launchedAfter: daysAgo(7) }), sort: "-priority_level,-upvotes,-launch_date" },
  lastWeek: { query: () => ({ launchedAfter: daysAgo(14), launchedBefore: daysAgo(7), sort: "top" }) },
  earlier: { query: () => ({ launchedAfter: daysAgo(30), launchedBefore: daysAgo(14), sort: "top" }) },
};

/** One page of a home launch section (also used by its "View more" button). */
export function listLaunchSection(section: LaunchSection, page: number, perPage: number) {
  const { query, sort } = LAUNCH_SECTIONS[section];
  return listProducts({ ...query(), page, perPage }, sort);
}

export async function getLaunchSections(limit = 10) {
  const [thisWeek, lastWeek, earlier] = await Promise.all([
    listLaunchSection("thisWeek", 1, limit),
    listLaunchSection("lastWeek", 1, limit),
    listLaunchSection("earlier", 1, limit),
  ]);
  return { thisWeek, lastWeek, earlier };
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

/** Top products in the same category, backfilled with top products overall when the category is small. */
export async function getRelatedProducts(product: ProductSummary, limit = 3): Promise<ProductSummary[]> {
  const [sameCategory, top] = await Promise.all([
    product.category ? listProducts({ category: product.category.slug, sort: "top", perPage: limit + 1 }) : null,
    listProducts({ sort: "top", perPage: limit * 2 + 1 }),
  ]);
  const seen = new Set([product.id]);
  return [...(sameCategory?.items ?? []), ...top.items]
    .filter((p) => !seen.has(p.id) && !!seen.add(p.id))
    .slice(0, limit);
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

/** One of the signed-in maker's launches, hidden ones included (null if missing or not theirs). */
export async function getMyLaunch(id: string, makerId: string): Promise<EditableLaunch | null> {
  try {
    const record = await getPB().collection("products").getOne(id, { expand: PRODUCT_EXPAND });
    return record.maker === makerId ? toEditableLaunch(record) : null;
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/**
 * Saves a maker's edits. Name, URL and slug are locked (the products update
 * hook enforces it too). Category picks are re-synced to tags the same way
 * `submitProduct` sets them; tags that aren't categories are kept.
 */
export async function updateLaunch(
  launch: EditableLaunch,
  input: ProductEditInput,
  files: { logo: File | null; screenshot: File | null },
  categories: { picked: string[]; all: string[] },
  tagIdsBySlug: Record<string, string>,
): Promise<EditableLaunch> {
  const categorySlugs = new Set(categories.all);
  const pickedTagIds = categories.picked.map((slug) => tagIdsBySlug[slug]).filter(Boolean);
  // Tags that don't mirror a category (e.g. set by an admin) are not the form's to remove.
  const otherTagIds = launch.tagRefs.filter((t) => !categorySlugs.has(t.slug)).map((t) => t.id);

  const body: Record<string, unknown> = {
    tagline: input.tagline,
    description: input.description,
    category: input.categories[0],
    tags: [...new Set([...pickedTagIds, ...otherTagIds])],
    pricing_model: input.pricing,
  };
  if (files.logo) body.logo = files.logo;
  if (files.screenshot) body.screenshots = [files.screenshot];

  const record = await getPB().collection("products").update(launch.id, body, { expand: PRODUCT_EXPAND });
  return toEditableLaunch(record);
}

/** Fresh upvote count, used to reconcile optimistic UI after a vote. */
export async function getUpvoteCount(productId: string): Promise<number> {
  const record = await getPB().collection("products").getOne(productId, { fields: "upvotes" });
  return record.upvotes ?? 0;
}
