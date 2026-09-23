/** Read-only reference data: categories, site stats, pricing plans. */

import { getPB } from "@/lib/pb/client";
import type { CategoryOption, PricingPlan, SiteStats } from "@/lib/types/models";

export async function listCategories(): Promise<CategoryOption[]> {
  const items = await getPB().collection("category_stats").getFullList({ sort: "-products_count,name" });
  return items
    .filter((c) => c.products_count > 0)
    .map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c.products_count }));
}

/** Every active category, including empty ones (for the submit form). */
export async function listAllCategories(): Promise<CategoryOption[]> {
  const items = await getPB().collection("categories").getFullList({ filter: "active = true", sort: "sort_order,name" });
  return items.map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: 0 }));
}

export async function getSiteStats(): Promise<SiteStats> {
  const [stats] = await getPB().collection("site_stats").getFullList();
  return {
    products: Number(stats?.products_count ?? 0),
    upvotes: Number(stats?.votes_count ?? 0),
    users: Number(stats?.users_count ?? 0),
    subscribers: Number(stats?.subscribers_count ?? 0),
  };
}

export async function listPricingPlans(): Promise<PricingPlan[]> {
  const items = await getPB().collection("pricing_plans").getFullList({ filter: "active = true", sort: "price" });
  const maxPriority = Math.max(...items.map((p) => p.priority_level));
  return items.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    currency: p.currency || "USD",
    description: p.description.replace(/<[^>]*>/g, ""),
    features: p.features ?? [],
    highlighted: p.priority_level === maxPriority && maxPriority > 0,
  }));
}
