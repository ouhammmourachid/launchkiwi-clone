"use client";

import Link from "next/link";

import { ContentShell, SiteShell } from "@/components/site-shell";
import { pastMonthHunts, pastWeekHunts, Product, thisWeeksHunts } from "@/data/site";

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

export default function HomePage() {
  return (
    <SiteShell>
      <ContentShell>
        <div className="space-y-6 pb-12">
          {/* Main Hero Card Container */}
          <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] p-6 sm:p-10 text-center shadow-lg">
            <span className="inline-block rounded-full border border-[#2b3120] bg-[#1a1e13] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#a6b194]">
              WEEKLY INDIE PRODUCT LAUNCHES
            </span>

            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] max-w-2xl mx-auto">
              Get your product in front of 107,730+ visitors
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-[#9aa48c] max-w-xl mx-auto leading-relaxed">
              Free to submit. Permanent DR 53 backlink. Every launch gets a real, SEO-indexed home — no approval wait.
            </p>

            {/* Submission Form */}
            <form className="mt-7 flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto rounded-xl border border-[#22271a] bg-[#0a0c07] p-1.5 shadow-inner" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="https://yourproduct.com"
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-[#5d6550] outline-none flex-1"
              />
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 rounded-lg bg-[#86ba28] px-4 py-2 text-xs font-bold text-[#0a0d06] transition hover:bg-[#96cc2e] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>🚀</span>
                <span>Submit</span>
              </button>
            </form>

            {/* Checkmark Features */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[11px] font-medium text-[#9aa48c]">
              <span className="flex items-center gap-1"><span className="text-[#86ba28]">✓</span> Free forever</span>
              <span className="flex items-center gap-1"><span className="text-[#86ba28]">✓</span> Takes 30 seconds</span>
              <span className="flex items-center gap-1"><span className="text-[#86ba28]">✓</span> 358+ products listed</span>
            </div>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 rounded-2xl border border-[#22271a] bg-[#0a0c07] overflow-hidden divide-x divide-y sm:divide-y-0 divide-[#22271a]">
              <div className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-black text-white">11,030</div>
                <div className="text-[11px] font-medium text-[#8c967d] mt-0.5">Upvotes</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-black text-white">DR 53</div>
                <div className="text-[11px] font-medium text-[#8c967d] mt-0.5">Domain authority</div>
                <div className="text-[9px] text-[#5e6652] mt-0.5">Powered by Ahrefs</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-black text-white">107,730</div>
                <div className="text-[11px] font-medium text-[#8c967d] mt-0.5">Monthly visitors</div>
                <div className="text-[9px] text-[#5e6652] mt-0.5">Powered by Cloudflare</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-xl sm:text-2xl font-black text-white">358 +</div>
                <div className="text-[11px] font-medium text-[#8c967d] mt-0.5">Products submitted</div>
              </div>
            </div>
          </section>

          {/* Section 1: This Week's Hunts */}
          <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#22271a] px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#86ba28]"></span>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">This Week&apos;s Hunts</h2>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7d8770]">
                39 launches this week
              </span>
            </div>

            <div className="p-1">
              {thisWeeksHunts.map((product, index) => (
                <ProductRow key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>

          {/* Interstitial Button 1 */}
          <div className="text-center py-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#272d1d] bg-[#161910] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#1f2417] cursor-pointer"
            >
              <span>View older projects</span>
              <span>→</span>
            </button>
          </div>

          {/* Section 2: Past Month Hunts */}
          <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#22271a] px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#86ba28]"></span>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">Past Month Hunts</h2>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7d8770]">
                Sorted by upvote count
              </span>
            </div>

            <div className="p-1">
              {pastMonthHunts.map((product, index) => (
                <ProductRow key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>

          {/* Interstitial Button 2 */}
          <div className="text-center py-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#272d1d] bg-[#161910] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#1f2417] cursor-pointer"
            >
              <span>View more</span>
              <span>→</span>
            </button>
          </div>

          {/* Section 3: Past Week Hunts */}
          <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#22271a] px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#86ba28]"></span>
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">Past Week Hunts</h2>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7d8770]">
                Launches from last week
              </span>
            </div>

            <div className="p-1">
              {pastWeekHunts.map((product, index) => (
                <ProductRow key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        </div>
      </ContentShell>
    </SiteShell>
  );
}

