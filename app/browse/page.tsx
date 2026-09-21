/**
 * app/browse/page.tsx — Browse / filter page
 * All static data (categories, priceFilters, products) comes from data/site.ts.
 * ProductRow is imported from the shared component.
 */

"use client";

import { useState } from "react";

import { ContentShell } from "@/components/layout/content-shell";
import { ProductRow } from "@/components/products/product-row";
import {
  categories,
  priceFilters,
  thisWeeksHunts,
  pastMonthHunts,
  pastWeekHunts,
  type Product,
} from "@/data/site";

// Merge all product arrays into one browseable list
const allProducts: Product[] = [
  ...thisWeeksHunts,
  ...pastMonthHunts,
  ...pastWeekHunts,
];

// ---------------------------------------------------------------------------
// Filter bar sub-components
// ---------------------------------------------------------------------------

interface FilterChipProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, count, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
        active
          ? "bg-[#86ba28] text-[#0a0d06] font-bold"
          : "bg-[#13170e] border border-[#23291c] text-[#a6b194] hover:border-[#38412b] hover:text-white"
      }`}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] ${active ? "text-[#0a0d06]/70" : "text-[#656e58]"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest Launched 🚀");

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All" ||
      product.tags.some(
        (tag) => tag.toLowerCase() === selectedCategory.toLowerCase()
      );

    const matchesPrice =
      selectedPrice === "All" ||
      product.tags.some(
        (tag) => tag.toLowerCase() === selectedPrice.toLowerCase()
      );

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <ContentShell>
      <div className="space-y-6 pb-12">
          {/* Filter panel */}
          <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] p-6 shadow-lg">
            {/* Title + sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <h1 className="text-2xl font-black text-white tracking-tight">Browse Products</h1>
                </div>
                <p className="mt-1 text-xs text-[#8c967d]">
                  Search and filter our global product index.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#656e58]">
                  SORT:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-full border border-[#23291c] bg-[#0a0c07] px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-[#86ba28] cursor-pointer"
                >
                  <option value="Newest Launched 🚀">Newest Launched 🚀</option>
                  <option value="Most Upvoted 🔥">Most Upvoted 🔥</option>
                  <option value="Trending 📈">Trending 📈</option>
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-5">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4e5642]">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tags, pricing, SaaS, AI, developer tools..."
                className="w-full rounded-xl border border-[#1e2417] bg-[#070905] py-3 pl-10 pr-4 text-xs text-white placeholder:text-[#4e5642] outline-none focus:border-[#86ba28] transition shadow-inner"
              />
            </div>

            {/* Category filters */}
            <div className="mt-5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#727c65] mb-2.5">
                <span>CATEGORY</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <FilterChip
                    key={cat.name}
                    label={cat.name}
                    count={cat.count}
                    active={selectedCategory === cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                  />
                ))}
              </div>
            </div>

            {/* Price filters */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#727c65]">
                PRICE:
              </span>
              <div className="flex items-center gap-1.5">
                {priceFilters.map((price) => (
                  <FilterChip
                    key={price}
                    label={price}
                    active={selectedPrice === price}
                    onClick={() => setSelectedPrice(price)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Product list */}
          <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] overflow-hidden">
            <div className="p-1">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductRow
                    key={`${product.id}-${index}`}
                    product={product}
                    index={index}
                  />
                ))
              ) : (
                <div className="p-12 text-center text-[#8c967d] text-sm">
                  No products found matching your filter criteria.
                </div>
              )}
            </div>
          </section>
      </div>
    </ContentShell>
  );
}
