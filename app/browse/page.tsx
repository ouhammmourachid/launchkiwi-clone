"use client";

import { useState } from "react";
import Link from "next/link";

import { ContentShell, SiteShell } from "@/components/site-shell";
import { pastMonthHunts, pastWeekHunts, Product, thisWeeksHunts } from "@/data/site";

const categories = [
  { name: "All", count: 279 },
  { name: "AI", count: 119 },
  { name: "Developer Tools", count: 62 },
  { name: "SaaS", count: 109 },
  { name: "APIs", count: 21 },
  { name: "Productivity", count: 94 },
  { name: "Design", count: 17 },
  { name: "AR/VR", count: 0 },
  { name: "Marketing", count: 48 },
  { name: "Health Tech", count: 13 },
  { name: "E-commerce", count: 11 },
  { name: "Hardware", count: 5 },
  { name: "Robotics", count: 0 },
  { name: "SEO", count: 17 },
  { name: "UI/UX", count: 14 },
  { name: "Other", count: 38 },
];

const priceFilters = ["All", "Free", "Freemium", "Paid"];

const allProducts: Product[] = [
  ...thisWeeksHunts,
  ...pastMonthHunts,
  ...pastWeekHunts,
];

function ProductIcon({ type }: { type: string }) {
  switch (type) {
    case "bear":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fffbeb] border border-[#fef3c7] shadow-sm">
          <span className="text-xl">🐻</span>
        </div>
      );
    case "linkedin":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0f172a] border border-[#334155] text-white">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </div>
      );
    case "coregulate":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#f472b6] to-[#c084fc] border border-[#fbcfe8] text-white font-bold text-xs">
          <span className="text-lg">🌸</span>
        </div>
      );
    case "kwip":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ea580c] font-black text-white text-xs tracking-tighter">
          kwip
        </div>
      );
    case "blackhole":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#18181b] border border-[#3f3f46]">
          <div className="h-5 w-5 rounded-full border-2 border-white/80 bg-black"></div>
        </div>
      );
    case "honeyfield":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7c3aed] text-white">
          <span className="text-base font-black">⬡</span>
        </div>
      );
    case "blocker":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0d9488] text-white">
          <span className="text-lg">🔘</span>
        </div>
      );
    case "mmw":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#052e16] border border-[#14532d] font-black text-[#4ade80] text-xs">
          MMW
        </div>
      );
    case "cheapfax":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e2e8f0] text-slate-800">
          <span className="text-lg">📠</span>
        </div>
      );
    case "flightfinder":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0284c7] text-white">
          <span className="text-lg">✈️</span>
        </div>
      );
    case "jerncloud":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0f172a] border border-[#f97316]/50 text-[#f97316]">
          <span className="text-xl font-bold">»</span>
        </div>
      );
    case "u4ria":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#042f2e] border border-[#115e59] text-[#2dd4bf]">
          <span className="text-lg">🧘</span>
        </div>
      );
    case "mirotalk":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black border border-white/20 text-white font-black text-[9px] text-center leading-tight">
          MiroTalk
        </div>
      );
    case "hostersale":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ffffff] border border-slate-300 text-slate-900 font-bold text-[9px] text-center">
          HosterSale
        </div>
      );
    case "melaya":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0f172a] border border-[#38bdf8] text-[#38bdf8]">
          <span className="text-lg">🧊</span>
        </div>
      );
    case "wordstoworlds":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15803d] text-white">
          <span className="text-lg">🌍</span>
        </div>
      );
    case "tavi":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#14b8a6] text-white font-bold text-xl">
          t
        </div>
      );
    case "filexai":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0284c7] text-white">
          <span className="text-lg">📁</span>
        </div>
      );
    case "imaginode":
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#16a34a] text-white">
          <span className="text-lg">🔥</span>
        </div>
      );
    default:
      return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#86ba28] text-[#0a0d06] font-bold text-sm">
          LK
        </div>
      );
  }
}

function ProductRow({ product, index }: { product: Product; index: number }) {
  const isTopRank = index < 3;
  return (
    <div
      className={`group flex items-center justify-between gap-4 p-4 text-left transition ${
        product.highlighted
          ? "border-2 border-[#ca8a04] bg-[#161a0f] rounded-xl my-1 shadow-[0_0_15px_rgba(202,138,4,0.15)]"
          : "border-b border-[#1c2014] hover:bg-[#161a10]"
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Rank Number */}
        <span className={`w-5 text-center text-sm font-bold shrink-0 ${isTopRank ? "text-[#ca8a04]" : "text-[#727c65]"}`}>
          {index + 1}
        </span>

        {/* Product Logo Icon */}
        <ProductIcon type={product.iconType} />

        {/* Content Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-none group-hover:text-[#86ba28] transition">
              {product.name}
            </h3>

            {/* Badge Tag */}
            {product.badge === "PRIORITY" && (
              <span className="inline-flex items-center gap-1 rounded bg-[#282310] border border-[#483e18] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#eab308]">
                📌 PRIORITY
              </span>
            )}
            {product.badge === "PREMIUM" && (
              <span className="inline-flex items-center gap-1 rounded bg-[#232014] border border-[#3e3920] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#d4af37]">
                ⭐ PREMIUM
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-[#9aa48c] leading-snug line-clamp-1">{product.description}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-[#656e58] font-medium">
            {product.tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-1.5">
                {tag}
                {i < product.tags.length - 1 && <span className="text-[#3b4330]">•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a
          href={product.linkUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#262c1c] bg-[#141810] px-3 py-1.5 text-xs font-semibold text-[#a6b194] transition hover:border-[#3c452c] hover:text-white"
        >
          <span>Visit</span>
          <span className="text-[10px]">↗</span>
        </a>

        {/* Upvote Button */}
        <button
          type="button"
          className="flex h-10 min-w-[42px] flex-col items-center justify-center rounded-xl border border-[#2b3120] bg-[#161a10] px-2.5 text-xs font-bold text-white transition hover:border-[#86ba28] hover:text-[#86ba28] cursor-pointer"
        >
          <span className="text-[10px] leading-none">▲</span>
          <span className="leading-tight">{product.votes}</span>
        </button>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest Launched 🚀");

  // Filter products based on search, category, and price
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" ||
      product.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase());

    const matchesPrice =
      selectedPrice === "All" ||
      product.tags.some((tag) => tag.toLowerCase() === selectedPrice.toLowerCase());

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <SiteShell>
      <ContentShell>
        <div className="space-y-6 pb-12">
          {/* Filter Container */}
          <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] p-6 shadow-lg">
            {/* Row 1: Title & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🚀</span>
                  <h1 className="text-2xl font-black text-white tracking-tight">Browse Products</h1>
                </div>
                <p className="mt-1 text-xs text-[#8c967d]">Search and filter our global product index.</p>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#656e58]">SORT:</span>
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

            {/* Row 2: Search Input Box */}
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

            {/* Row 3: Category Filters */}
            <div className="mt-5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#727c65] mb-2.5">
                <span>Y</span>
                <span>CATEGORY</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? "bg-[#86ba28] text-[#0a0d06] font-bold"
                          : "bg-[#13170e] border border-[#23291c] text-[#a6b194] hover:border-[#38412b] hover:text-white"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] ${isActive ? "text-[#0a0d06]/70" : "text-[#656e58]"}`}>
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Row 4: Price Filters */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#727c65]">PRICE:</span>
              <div className="flex items-center gap-1.5">
                {priceFilters.map((price) => {
                  const isActive = selectedPrice === price;
                  return (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setSelectedPrice(price)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? "bg-[#86ba28] text-[#0a0d06] font-bold"
                          : "bg-[#13170e] border border-[#23291c] text-[#a6b194] hover:border-[#38412b] hover:text-white"
                      }`}
                    >
                      {price}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Product List Section */}
          <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] overflow-hidden">
            <div className="p-1">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <ProductRow key={product.id + "-" + index} product={product} index={index} />
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
    </SiteShell>
  );
}

