import Link from "next/link";

import { ContentShell, SiteShell } from "@/components/site-shell";

const trendingProducts = [
  {
    name: "PageCub",
    tag: "Productivity",
    status: "Priority",
    blurb: "Custom and personalized illustrated kids books, from scratch every time.",
    votes: 7,
    color: "bg-[#c7d760]",
  },
  {
    name: "LinkedIn MCP Server",
    tag: "AI",
    status: "Priority",
    blurb: "Reach MCP connects your real LinkedIn account to Claude, ChatGPT, Cursor or n8n.",
    votes: 6,
    color: "bg-[#f1f1f1]",
  },
  {
    name: "CoRegulateAI",
    tag: "Health Tech",
    status: "Priority",
    blurb: "The personalized operating system for emotional regulation.",
    votes: 9,
    color: "bg-[#c4d0ff]",
  },
  {
    name: "Klip",
    tag: "E-commerce",
    status: "Premium",
    blurb: "Maltas courier for online shops. Book a pickup when your order's ready.",
    votes: 6,
    color: "bg-[#ff7d2a]",
  },
  {
    name: "Personal Black Hole",
    tag: "Free",
    status: "Premium",
    blurb: "Physics-inspired black holes for any web page — Solo, binary and screencaster modes.",
    votes: 14,
    color: "bg-[#f3f4ef]",
  },
  {
    name: "Honeyfield Marketing MCP",
    tag: "AI",
    status: "Premium",
    blurb: "Run Google Ads, GA4 and GTM from your AI chat.",
    votes: 13,
    color: "bg-[#9f6de4]",
  },
  {
    name: "Porn blocked. No OFF switch.",
    tag: "Free",
    status: "Premium",
    blurb: "A tool for locking adult content behind screens or onboarding flows.",
    votes: 18,
    color: "bg-[#b7d65d]",
  },
  {
    name: "HosterSale",
    tag: "Developer Tools",
    status: "Free",
    blurb: "Web hosting company for founders and teams building products.",
    votes: 4,
    color: "bg-[#f5f5f2]",
  },
  {
    name: "Melaya",
    tag: "AI",
    status: "Free",
    blurb: "Build high trust AI agent systems. Give your AI hands.",
    votes: 4,
    color: "bg-[#2c2f32]",
  },
  {
    name: "Words to Worlds",
    tag: "Design",
    status: "Free",
    blurb: "Describe a place in a hundred words; get back a small living world.",
    votes: 4,
    color: "bg-[#3f7cff]",
  },
  {
    name: "Tavi",
    tag: "Health Tech",
    status: "Premium",
    blurb: "Vaccines, meds, weight & vet visits for your cat or dog — private, offline app.",
    votes: 14,
    color: "bg-[#57c8a0]",
  },
  {
    name: "Filex AI",
    tag: "SaaS",
    status: "Free",
    blurb: "Automatically rename, organize, and find every file using AI.",
    votes: 12,
    color: "bg-[#f5d057]",
  },
];

const sideCards = [
  { name: "DrawGenie", blurb: "Create custom AI-generated coloring books starring yo..." },
  { name: "Honeyfield ...", blurb: "Run Google Ads, GA4 and GTM from your AI chat" },
  { name: "LinkedIn MC...", blurb: "Reach MCP connects your real LinkedIn account to..." },
  { name: "PageCub", blurb: "Custom and personalized illustrated kids books, from..." },
  { name: "Klip", blurb: "Malta's courier for online shops. Book a pickup whe..." },
];

function Stat({ value, label, sublabel }: { value: string; label: string; sublabel?: string }) {
  return (
    <div className="border border-white/8 bg-[#161b15] px-4 py-5 text-center sm:px-5">
      <div className="text-3xl font-black tracking-[-0.06em] text-white">{value}</div>
      <div className="mt-1 text-xs text-[#dfe7d2]">{label}</div>
      {sublabel ? <div className="mt-1 text-[10px] text-[#9ea993]">{sublabel}</div> : null}
    </div>
  );
}

export default function HomePage() {
  return (
    <SiteShell>
      <ContentShell>
        <div className="space-y-8 pb-8">
          <section className="rounded-[28px] border border-white/8 bg-[#0f120d] px-6 pb-8 pt-12 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center rounded-full border border-[#b7d65d]/25 bg-[#1a1d17] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfe7d2]">
                Weekly indie product launches
              </span>
              <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-7xl">
                Get your product in front of 107,730+ visitors
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#b7c0aa]">
                Free to submit. Permanent DR 53 backlink. Every launch gets a real, SEO-indexed home — no approval wait.
              </p>

              <form className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/8 bg-[#1a1d17] p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <input
                  type="text"
                  placeholder="https://yourproduct.com"
                  className="flex-1 border-0 bg-transparent px-3 py-2 text-base text-white placeholder:text-[#7d8675] focus:outline-none"
                />
                <button type="submit" className="rounded-xl bg-[#b7d65d] px-5 py-2.5 text-sm font-semibold text-[#0b0d09] transition hover:bg-[#cfe67e]">
                  Submit
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-semibold text-[#dfe7d2]">
                {['Free forever', 'Takes 30 seconds', '358+ products listed'].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <span className="text-[#b7d65d]">✓</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-9 grid gap-0 overflow-hidden rounded-2xl border border-white/8 bg-[#11160f] sm:grid-cols-4">
              <Stat value="11,030" label="Upvotes" />
              <Stat value="DR 53" label="Domain authority" sublabel="Powered by Ahrefs" />
              <Stat value="107,730" label="Monthly visitors" sublabel="Powered by Cloudflare" />
              <Stat value="358+" label="Products submitted" />
            </div>
          </section>

          <section className="rounded-[28px] border border-white/8 bg-[#0f120d] p-0">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3.5 w-3.5 rounded-full bg-[#b7d65d]" />
                <h2 className="text-2xl font-black tracking-[-0.05em] text-white">This Week&apos;s Hunts</h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#aeb8a0]">39 launches this week</span>
            </div>

            <div className="divide-y divide-white/8">
              {trendingProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4 px-5 py-4 text-left">
                  <div className="flex w-9 justify-center text-sm font-semibold text-[#dfe7d2]">{index + 1}</div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${product.color} text-lg font-black text-[#10140e]`}>
                    {product.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xl font-bold text-white">{product.name}</span>
                      {product.status === "Priority" ? (
                        <span className="rounded-full border border-[#b7d65d]/35 bg-[#b7d65d]/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#dfe7d2]">
                          {product.status}
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#dfe7d2]">
                          {product.status}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[15px] text-[#b7c0aa]">{product.blurb}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#8d9687]">
                      <span>{product.tag}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href="/browse" className="rounded-xl border border-white/8 bg-transparent px-4 py-2 text-sm font-semibold text-[#e9efe4] transition hover:bg-white/5">
                      Visit →
                    </Link>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/8 bg-[#11160f] text-sm font-semibold text-white">
                      {product.votes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-white/8 bg-[#0f120d] p-0">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3.5 w-3.5 rounded-full bg-[#b7d65d]" />
                <h2 className="text-2xl font-black tracking-[-0.05em] text-white">Past Week Hunts</h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#aeb8a0]">Launches from last week</span>
            </div>

            <div className="px-5 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                {sideCards.map((card, idx) => (
                  <div key={card.name} className="rounded-2xl border border-white/8 bg-[#1a1d17] p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${idx % 2 === 0 ? "bg-[#b7d65d] text-[#0b0d09]" : "bg-[#d9d9d9] text-[#0b0d09]"} text-[11px] font-black`}>
                          {card.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-base font-semibold text-white">{card.name}</div>
                      </div>
                      <div className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#dfe7d2]">{idx + 1}</div>
                    </div>
                    <p className="text-sm leading-relaxed text-[#b7c0aa]">{card.blurb}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/8 bg-[#0f120d] p-0">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3.5 w-3.5 rounded-full bg-[#b7d65d]" />
                <h2 className="text-2xl font-black tracking-[-0.05em] text-white">Past Week Hunts</h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#aeb8a0]">Launches from last week</span>
            </div>

            <div className="px-5 py-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sideCards.map((card, idx) => (
                  <div key={card.name} className="rounded-2xl border border-white/8 bg-[#1a1d17] p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${idx % 2 === 0 ? "bg-[#b7d65d] text-[#0b0d09]" : "bg-[#d9d9d9] text-[#0b0d09]"} text-[11px] font-black`}>
                          {card.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="text-base font-semibold text-white">{card.name}</div>
                      </div>
                      <div className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#dfe7d2]">{idx + 1}</div>
                    </div>
                    <p className="text-sm leading-relaxed text-[#b7c0aa]">{card.blurb}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/8 bg-[#0f120d] p-0">
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-3.5 w-3.5 rounded-full bg-[#dfe7d2]" />
                <h2 className="text-2xl font-black tracking-[-0.05em] text-white">Past Month Hunts</h2>
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#aeb8a0]">Sorted by upvote count</span>
            </div>

            <div className="divide-y divide-white/8">
              {trendingProducts.slice(0, 6).map((product, index) => (
                <div key={product.name + "-list"} className="flex items-center gap-4 px-5 py-4 text-left">
                  <div className="flex w-9 justify-center text-sm font-semibold text-[#dfe7d2]">{index + 1}</div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${product.color} text-lg font-black text-[#10140e]`}>
                    {product.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xl font-bold text-white">{product.name}</span>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#dfe7d2]">
                        {product.status}
                      </span>
                    </div>
                    <p className="mt-1 text-[15px] text-[#b7c0aa]">{product.blurb}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href="/browse" className="rounded-xl border border-white/8 bg-transparent px-4 py-2 text-sm font-semibold text-[#e9efe4] transition hover:bg-white/5">
                      Visit
                    </Link>
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/8 bg-[#11160f] text-sm font-semibold text-white">
                      {product.votes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ContentShell>
    </SiteShell>
  );
}
