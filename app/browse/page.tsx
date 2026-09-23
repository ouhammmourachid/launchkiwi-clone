/**
 * app/browse/page.tsx — Browse / filter page
 * Filters live in the URL (?q=&category=&pricing=&sort=&page=) so results are
 * server-rendered, shareable and work with the back button.
 */

import type { Metadata } from "next";

import { BrowseFilters } from "@/components/browse/browse-filters";
import { Pagination } from "@/components/browse/pagination";
import { ContentShell } from "@/components/layout/content-shell";
import { ProductList } from "@/components/products/product-list";
import { listCategories } from "@/lib/api/catalog";
import { listProducts } from "@/lib/api/products";
import { PRODUCT_SORTS, type ProductSort } from "@/lib/catalog-options";
import { PRICING_MODELS, type PricingModel } from "@/lib/types/records";

export const metadata: Metadata = {
  title: "Browse products",
  description: "Search and filter every indie product launched on LaunchKiwi.",
};

const PER_PAGE = 20;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)?.trim() || undefined;

export default async function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const search = first(params.q);
  const category = first(params.category);
  const pricingParam = first(params.pricing);
  const pricing = PRICING_MODELS.includes(pricingParam as PricingModel) ? (pricingParam as PricingModel) : undefined;
  const sortParam = first(params.sort);
  const sort: ProductSort = sortParam && sortParam in PRODUCT_SORTS ? (sortParam as ProductSort) : "new";
  const page = Math.max(1, Number(first(params.page)) || 1);

  const [results, categories] = await Promise.all([
    listProducts({ search, category, pricing, sort, page, perPage: PER_PAGE }),
    listCategories(),
  ]);

  const hasFilters = !!(search || category || pricing);

  return (
    <ContentShell withSidebars>
      <div className="space-y-6 pb-12">
        <BrowseFilters categories={categories} totalItems={results.totalItems} current={{ search, category, pricing, sort }} />

        <ProductList
          products={results.items}
          startIndex={(results.page - 1) * PER_PAGE}
          emptyTitle="No products match your filters"
          emptyContent={hasFilters ? "Try a different search term or clear some filters." : "Nothing has launched yet."}
        />

        <Pagination page={results.page} totalPages={results.totalPages} params={{ q: search, category, pricing, sort }} />
      </div>
    </ContentShell>
  );
}
