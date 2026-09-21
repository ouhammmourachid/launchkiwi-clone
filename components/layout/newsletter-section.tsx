/**
 * newsletter-section.tsx
 * Email subscription section shown at the bottom of every page.
 */

"use client";

export function NewsletterSection() {
  return (
    <section className="border-t border-[#1b1f14] bg-[#0a0c07] px-4 py-16 text-center text-white">
      <div className="mx-auto max-w-2xl">
        <span className="inline-block rounded-full border border-[#282e1e] bg-[#15190e] px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#a6b194]">
          STAY UPDATED
        </span>
        <h3 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
          Get weekly indie project launches directly in your inbox.
        </h3>
        <p className="mt-3 text-xs sm:text-sm text-[#9aa48c] leading-relaxed">
          Subscribe to receive curated lists of the most successful SaaS products, developer tools, and community favourites.
        </p>
        <form
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="your.email@domain.com"
            className="w-full rounded-xl border border-[#23291b] bg-[#141810] px-4 py-2.5 text-xs text-white placeholder:text-[#5e6652] outline-none focus:border-[#86ba28]"
          />
          <button
            type="submit"
            className="w-full sm:w-auto shrink-0 rounded-xl bg-[#86ba28] px-5 py-2.5 text-xs font-bold text-[#0a0d06] transition hover:bg-[#96cc2e] cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
