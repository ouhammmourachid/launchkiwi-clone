/**
 * browse-filters.tsx
 * Search box, sort select and category / pricing chips for /browse.
 * Every change rewrites the URL; the server page re-renders the results.
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { RocketIcon, SearchIcon } from "@/components/layout/nav-icons";
import { PRICE_FILTERS, PRODUCT_SORTS, type ProductSort } from "@/lib/catalog-options";
import type { CategoryOption } from "@/lib/types/models";
import type { PricingModel } from "@/lib/types/records";

const SEARCH_DEBOUNCE_MS = 350;

interface Current {
  search?: string;
  category?: string;
  pricing?: PricingModel;
  sort: ProductSort;
}

interface BrowseFiltersProps {
  categories: CategoryOption[];
  totalItems: number;
  current: Current;
}

export function BrowseFilters({ categories, totalItems, current }: BrowseFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(current.search ?? "");
  const [syncedSearch, setSyncedSearch] = useState(current.search);

  // The URL changed from elsewhere (e.g. the header search): adopt it, unless
  // the user has typed something newer that hasn't been pushed yet.
  if (current.search !== syncedSearch) {
    setSyncedSearch(current.search);
    if (search.trim() === (syncedSearch ?? "")) setSearch(current.search ?? "");
  }

  const navigate = (patch: Partial<Record<"q" | "category" | "pricing" | "sort", string | undefined>>) => {
    const next = new URLSearchParams();
    const merged = { q: current.search, category: current.category, pricing: current.pricing, sort: current.sort, ...patch };
    for (const [key, value] of Object.entries(merged)) {
      if (value && !(key === "sort" && value === "new")) next.set(key, value);
    }
    // Any filter change resets pagination.
    const query = next.toString();
    startTransition(() => router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  };

  // Debounced search-as-you-type.
  useEffect(() => {
    if (search === (current.search ?? "")) return;
    const timer = setTimeout(() => navigate({ q: search || undefined }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navigate is recreated each render; only the text matters
  }, [search]);

  return (
    <section className="rounded-[24px] border border-dune-850 bg-dune-940 p-4 shadow-lg sm:p-6" aria-busy={isPending}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <RocketIcon className="h-5 w-5 text-sun" />
            <h1 className="text-2xl font-black text-white tracking-tight">Browse Products</h1>
          </div>
          <p className="mt-1 text-xs text-dune-400">
            {isPending ? "Updating…" : `${totalItems} product${totalItems === 1 ? "" : "s"} found.`}
          </p>
        </div>

        <label className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-dune-600">SORT:</span>
          <select
            value={current.sort}
            onChange={(e) => navigate({ sort: e.target.value })}
            className="rounded-full border border-dune-850 bg-dune-970 px-3 py-1.5 text-xs font-semibold text-white outline-none focus:border-sun cursor-pointer"
          >
            {Object.entries(PRODUCT_SORTS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative mt-5">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dune-600">
          <SearchIcon />
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products"
          placeholder="Search names, taglines, categories, tags..."
          className="w-full rounded-xl border border-dune-900 bg-dune-990 py-3 pl-10 pr-4 text-xs text-white placeholder:text-dune-700 outline-none focus:border-sun transition shadow-inner"
        />
      </div>

      <div className="mt-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-dune-500 mb-2.5">CATEGORY</div>
        {/* One swipeable row on phones (bleeding to the panel edge), wrapping from sm up. */}
        <div className="-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
          <FilterChip label="All" active={!current.category} onClick={() => navigate({ category: undefined })} />
          {categories.map((cat) => (
            <FilterChip
              key={cat.slug}
              label={cat.name}
              count={cat.count}
              active={current.category === cat.slug}
              onClick={() => navigate({ category: cat.slug })}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-dune-500">PRICE:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip label="All" active={!current.pricing} onClick={() => navigate({ pricing: undefined })} />
          {PRICE_FILTERS.map((price) => (
            <FilterChip key={price} label={price} active={current.pricing === price} onClick={() => navigate({ pricing: price })} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer sm:py-1 ${
        active
          ? "bg-sun text-on-sun font-bold"
          : "bg-dune-940 border border-dune-850 text-dune-200 hover:border-dune-750 hover:text-white"
      }`}
    >
      <span>{label}</span>
      {count !== undefined && <span className={`text-[10px] ${active ? "text-on-sun/70" : "text-dune-600"}`}>{count}</span>}
    </button>
  );
}
