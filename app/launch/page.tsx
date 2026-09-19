import { ContentShell, SiteShell } from "@/components/site-shell";

const steps = [
  "Add your product URL and basic details.",
  "Share a short description and launch category.",
  "Publish and start collecting feedback and upvotes.",
];

export default function LaunchPage() {
  return (
    <SiteShell>
      <ContentShell>
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#ece7e1] bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6b2c]">Launch</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827] md:text-4xl">Submit your product</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#64748b]">
              Get a free permanent product listing and bring early adopters, builders, and product enthusiasts to your launch.
            </p>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <form className="space-y-4 rounded-3xl border border-[#ece7e1] bg-white p-6 shadow-sm">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">Product URL</label>
                <input type="url" placeholder="https://yourproduct.com" className="w-full rounded-xl border border-[#e7e2dd] bg-[#f8f6f4] px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#ff6b2c]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">Product name</label>
                <input type="text" placeholder="My product" className="w-full rounded-xl border border-[#e7e2dd] bg-[#f8f6f4] px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#ff6b2c]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#111827]">One-line summary</label>
                <textarea rows={4} placeholder="What problem does your product solve?" className="w-full rounded-xl border border-[#e7e2dd] bg-[#f8f6f4] px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-[#ff6b2c]" />
              </div>
              <button type="submit" className="rounded-full bg-[#ff6b2c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#eb5d1f]">
                Publish my launch
              </button>
            </form>

            <aside className="rounded-3xl border border-[#ece7e1] bg-[#fff7f2] p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#111827]">How it works</h2>
              <ul className="mt-4 space-y-3">
                {steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-[#475569]">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ff6b2c] text-xs font-bold text-white">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </ContentShell>
    </SiteShell>
  );
}
