import Link from "next/link";

import { ContentShell, SiteShell } from "@/components/site-shell";

const packages = [
  { name: "Hero spot", price: "$299", text: "A premium top-of-page placement for your product or service." },
  { name: "Sidebar ad", price: "$129", text: "Reach the traffic that already cares about indie launches and new products." },
  { name: "Newsletter placement", price: "$199", text: "Get in front of highly engaged readers in the weekly launch digest." },
];

export default function AdvertisePage() {
  return (
    <SiteShell>
      <ContentShell>
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#ece7e1] bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6b2c]">Advertise</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827] md:text-4xl">Put your launch in front of builders</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#64748b]">
              LaunchKiwi brings together indie founders, product enthusiasts, and early adopters actively discovering new tools and products.
            </p>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            {packages.map((pkg) => (
              <div key={pkg.name} className="rounded-2xl border border-[#ece7e1] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-[#111827]">{pkg.name}</h2>
                  <span className="text-lg font-black text-[#ff6b2c]">{pkg.price}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#64748b]">{pkg.text}</p>
                <Link href="/contact" className="mt-6 inline-flex rounded-full bg-[#ff6b2c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#eb5d1f]">
                  Book a slot
                </Link>
              </div>
            ))}
          </div>
        </div>
      </ContentShell>
    </SiteShell>
  );
}
