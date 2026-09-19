import Link from "next/link";

import { ContentShell, SiteShell } from "@/components/site-shell";

const products = [
  { name: "PromptPilot", tag: "AI workflow", upvotes: 1842, summary: "Test prompts, collaborate with teammates, and ship better automations." },
  { name: "Northstar CRM", tag: "SaaS", upvotes: 1432, summary: "A modern pipeline builder for founders selling to technical buyers." },
  { name: "MiroBoard Lite", tag: "Productivity", upvotes: 1218, summary: "Whiteboard fast with collaborative planning templates and meeting notes." },
  { name: "Aster Mail", tag: "Marketing", upvotes: 973, summary: "Email outreach workflows built with human personalization and AI research." },
  { name: "QuietDesk", tag: "Tooling", upvotes: 882, summary: "A focused workspace for async product teams and lightweight project planning." },
  { name: "Signal Forge", tag: "Developer tools", upvotes: 765, summary: "Visualise API traffic, test payloads, and monitor product health in one place." },
];

export default function BrowsePage() {
  return (
    <SiteShell>
      <ContentShell>
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#ece7e1] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6b2c]">Discover</p>
                <h1 className="mt-2 text-3xl font-black text-[#111827] md:text-4xl">Browse products</h1>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-[#ece7e1] bg-[#f7f5f3] px-3 py-2 text-sm text-[#64748b]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#ff6b2c]" />
                Updated daily
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <Link key={product.name} href="/launch" className="rounded-2xl border border-[#ece7e1] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <span className="rounded-full bg-[#fff4ef] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#ff6b2c]">
                    {product.tag}
                  </span>
                  <span className="text-sm font-semibold text-[#111827]">{product.upvotes}</span>
                </div>
                <h2 className="text-xl font-bold text-[#111827]">{product.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{product.summary}</p>
              </Link>
            ))}
          </section>
        </div>
      </ContentShell>
    </SiteShell>
  );
}
