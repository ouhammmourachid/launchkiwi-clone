import { ContentShell, SiteShell } from "@/components/site-shell";

const reviews = [
  { title: "Best AI tooling for indie builders", text: "From automation workflows to UI experiments, these products are shipping real value and growing fast." },
  { title: "SaaS launch stack for founders", text: "A curated list of best-in-class products helping founders launch, iterate, and stabilize their motion." },
  { title: "Productivity tools worth trying", text: "A practical blend of lightweight workflows, collaborative tools, and editor upgrades for remote teams." },
];

export default function ReviewsPage() {
  return (
    <SiteShell>
      <ContentShell>
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#ece7e1] bg-white p-6 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6b2c]">Insights</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827] md:text-4xl">Reviews</h1>
          </section>

          <div className="grid gap-4">
            {reviews.map((review) => (
              <article key={review.title} className="rounded-2xl border border-[#ece7e1] bg-white p-5 shadow-sm">
                <h2 className="text-xl font-bold text-[#111827]">{review.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#64748b]">{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </ContentShell>
    </SiteShell>
  );
}
