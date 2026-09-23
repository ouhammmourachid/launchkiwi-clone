/**
 * advertise-content.tsx — interactive body of the /advertise page
 * Rebuilt to match the LaunchDunes dark-theme advertise design with:
 * - Hero with "ADVERTISE" badge and headline
 * - Stats bar (DR 53, 107k visitors, ~$0.28 CPM, 358+ listed)
 * - 30-day and 90-day spotlight plan cards
 * - Interactive booking form with duration selection & logo upload
 * - Spotlight rotation chips
 * - 3-step process overview
 * - "Why advertise on LaunchDunes" 4-card grid
 */

"use client";

import { useState } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M11.5 1a.5.5 0 01.5.5v2.586l1.854-1.854a.5.5 0 01.707.707L12.707 4.793 14.5 6.586a.5.5 0 01-.707.707L12 5.414V8a.5.5 0 01-1 0V2a.5.5 0 01.5-.5z" />
      <path d="M1 4.5A1.5 1.5 0 012.5 3h4.78l3.414-2.276A1 1 0 0112 1.572v10.856a1 1 0 01-1.306.948L7.28 11H2.5A1.5 1.5 0 011 9.5v-5zM2.5 4a.5.5 0 00-.5.5v5a.5.5 0 00.5.5H7a.5.5 0 01.277.083L11 12.56V1.44L7.277 3.917A.5.5 0 017 4H2.5z" />
      <path d="M4.5 12a1.5 1.5 0 011.5 1.5V14a1.5 1.5 0 01-3 0v-.5A1.5 1.5 0 014.5 12z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4 flex-shrink-0"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CloudUploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
      />
    </svg>
  );
}

// ─── Component Data ───────────────────────────────────────────────────────────

const spotlightRotation = [
  { name: "ReviewTurbo", icon: "⚡" },
  { name: "DrawGenie", icon: "✏️" },
  { name: "bidflip.lol", icon: "🚀" },
  { name: "LaunchBuck", icon: "🍃" },
  { name: "HotOnlinedeals", icon: "🔥" },
];

const whyAdvertise = [
  {
    icon: (
      <svg className="w-4 h-4 text-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "No listing needed",
    description: "Run a spotlight without submitting to the directory. Add your details, pay once, go live.",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Live in minutes",
    description: "No editorial review, no waiting around. Your card appears the moment payment clears.",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Flat, honest pricing",
    description: "One price for the whole run. No CPM, no bidding, no auto-renewal — you know the cost up front.",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Real people, not bots",
    description: "Organic visitors from search and word of mouth. No incentivised clicks, no traffic exchanges.",
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AdvertiseContent() {
  const [selectedDuration, setSelectedDuration] = useState<"30" | "90">("30");
  const [productName, setProductName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [tagline, setTagline] = useState("");
  const [email, setEmail] = useState("");
  const [logoName, setLogoName] = useState("");

  const scrollToForm = (duration: "30" | "90") => {
    setSelectedDuration(duration);
    const formElement = document.getElementById("booking-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Paid ad checkout isn't implemented yet — the form is a preview only.
  const handleSubmit = (e: React.FormEvent) => e.preventDefault();

  return (
      <div className="space-y-8 pb-12">

        {/* ── Hero Section ── */}
        <section className="pt-10 pb-4 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sun/40 bg-sun/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sun">
            <MegaphoneIcon />
            Advertise
          </span>

          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-dune-50 md:text-5xl lg:text-[3.2rem]">
            Top of the feed.
            <br />
            Every visitor.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-dune-300 max-w-lg mx-auto">
            A spotlight slot at the top of the homepage — no directory listing required.
            Pick a duration, pay once, and it&apos;s live today.
          </p>
        </section>

        {/* ── Stats Bar ── */}
        <div className="rounded-xl border border-white/10 bg-dune-925 px-6 py-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 text-center">
            {[
              { value: "DR 53", label: "DOMAIN RATING" },
              { value: "107,730", label: "MONTHLY VISITORS" },
              { value: "~$0.28", label: "EST. CPM (30-DAY)" },
              { value: "358+", label: "PRODUCTS LISTED" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-dune-50">
                  {stat.value}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-dune-300">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pricing / Plan Options ── */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto items-stretch">
          
          {/* 30 Days Card */}
          <div
            className={`relative flex flex-col justify-between rounded-xl border p-6 transition-all ${
              selectedDuration === "30"
                ? "border-sun/60 bg-dune-925 shadow-[0_0_40px_rgba(242,163,58,0.08)]"
                : "border-white/10 bg-dune-925"
            }`}
          >
            {selectedDuration === "30" && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-sun px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-on-sun">
                  SELECTED
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-dune-50">30 days</span>
                <span className="rounded-full bg-sun/15 px-2.5 py-0.5 text-[11px] font-semibold text-sun">
                  $1.00/day
                </span>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-black tracking-tight text-dune-50">$30</span>
                <span className="mb-1 text-xs text-dune-300">one-time</span>
              </div>

              <ul className="mt-6 space-y-3">
                {[
                  "Top-of-feed spotlight for a full 30 days",
                  "No directory listing required — just your logo & link",
                  "Live today — no approval wait",
                  "A full month of consistent visibility",
                  "$1.00/day — one flat rate, no bidding",
                  "One-time payment, no subscription, no auto-renewal",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-dune-50">
                    <span className="mt-0.5 text-sun">
                      <CheckIcon />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => scrollToForm("30")}
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-sun-deep hover:bg-sun px-4 py-3 text-sm font-bold text-dune-50 transition-colors shadow-md"
            >
              Book 30 days &rarr;
            </button>
          </div>

          {/* 90 Days Card */}
          <div
            className={`relative flex flex-col justify-between rounded-xl border p-6 transition-all ${
              selectedDuration === "90"
                ? "border-sun/60 bg-dune-925 shadow-[0_0_40px_rgba(242,163,58,0.08)]"
                : "border-white/10 bg-dune-925"
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center rounded-full bg-sun px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-on-sun">
                BEST VALUE
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-dune-50">90 days</span>
                <span className="rounded-full bg-sun/15 px-2.5 py-0.5 text-[11px] font-semibold text-sun">
                  $0.88/day
                </span>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-4xl font-black tracking-tight text-dune-50">$79</span>
                <span className="mb-1 text-xs text-dune-300">one-time</span>
              </div>

              <ul className="mt-6 space-y-3">
                {[
                  "Top-of-feed spotlight for a full 90 days",
                  "No directory listing required — just your logo & link",
                  "Live today — no approval wait",
                  "Nearly a full quarter of consistent visibility",
                  "$0.88/day — our lowest rate, 12% cheaper per day than the 30-day plan",
                  "One-time payment, no subscription, no auto-renewal",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-dune-50">
                    <span className="mt-0.5 text-sun">
                      <CheckIcon />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => scrollToForm("90")}
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-sun-deep hover:bg-sun px-4 py-3 text-sm font-bold text-dune-50 transition-colors shadow-md"
            >
              Book 90 days &rarr;
            </button>
          </div>

        </div>

        {/* ── Booking Form Section ── */}
        <div id="booking-form" className="max-w-4xl mx-auto rounded-xl border border-white/10 bg-dune-925 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step 1: Choose Duration */}
              <div>
                <label className="text-xs font-bold uppercase tracking-[0.15em] text-dune-300">
                  1. CHOOSE A DURATION
                </label>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedDuration("30")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                      selectedDuration === "30"
                        ? "border-sun bg-sun/10 text-dune-50"
                        : "border-white/10 bg-dune-970 text-dune-300 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xl font-bold text-sun">$30</span>
                    <span className="text-xs font-semibold mt-1">30 days</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDuration("90")}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${
                      selectedDuration === "90"
                        ? "border-sun bg-sun/10 text-dune-50"
                        : "border-white/10 bg-dune-970 text-dune-300 hover:border-white/20"
                    }`}
                  >
                    <span className="text-xl font-bold text-sun">$79</span>
                    <span className="text-xs font-semibold mt-1">90 days</span>
                  </button>
                </div>
                <p className="mt-2 text-xs text-dune-300">
                  Starts today and runs for the window you pick.
                </p>
              </div>

              {/* Step 2: Your Product */}
              <div className="space-y-4 pt-2">
                <label className="text-xs font-bold uppercase tracking-[0.15em] text-dune-300">
                  2. YOUR PRODUCT
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-dune-50 mb-1.5">
                      Product name <span className="text-sun">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Product name"
                      className="w-full rounded-lg border border-white/10 bg-dune-970 px-3.5 py-2.5 text-sm text-dune-50 placeholder-dune-300/50 focus:border-sun focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-dune-50 mb-1.5">
                      Website URL <span className="text-sun">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="yourproduct.com"
                      className="w-full rounded-lg border border-white/10 bg-dune-970 px-3.5 py-2.5 text-sm text-dune-50 placeholder-dune-300/50 focus:border-sun focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-dune-50 mb-1.5">
                    Tagline <span className="text-sun">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="One line describing your product"
                    className="w-full rounded-lg border border-white/10 bg-dune-970 px-3.5 py-2.5 text-sm text-dune-50 placeholder-dune-300/50 focus:border-sun focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-dune-50 mb-1.5">
                      Contact email <span className="text-sun">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="For your receipt and booking confirmation"
                      className="w-full rounded-lg border border-white/10 bg-dune-970 px-3.5 py-2.5 text-sm text-dune-50 placeholder-dune-300/50 focus:border-sun focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-dune-50 mb-1.5">
                      Logo <span className="text-sun">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer flex items-center justify-between rounded-lg border border-white/10 bg-dune-970 px-3.5 py-2.5 text-sm text-dune-300 hover:border-white/20">
                        <span className="truncate">
                          {logoName || "Upload logo"}
                        </span>
                        <CloudUploadIcon />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setLogoName(e.target.files[0].name);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled
                className="w-full rounded-lg bg-sun-deep py-3 text-sm font-bold text-dune-50 shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Online checkout coming soon
              </button>
              <p className="text-center text-xs text-dune-300">
                Want the {selectedDuration}-day spotlight now? Email{" "}
                <a href="mailto:hello@launchdunes.com" className="text-sun underline hover:text-dune-50">
                  hello@launchdunes.com
                </a>
                .
              </p>

          </form>
        </div>

        {/* ── Spotlight Rotation Chips ── */}
        <div className="pt-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dune-300">
            RECENTLY IN THE SPOTLIGHT ROTATION
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {spotlightRotation.map((item) => (
              <div
                key={item.name}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-dune-925 px-3.5 py-1.5 text-xs font-semibold text-dune-50"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3-Step Process ── */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Pick a plan",
              text: "30 or 90 days — one flat price, no bidding or CPM auctions.",
            },
            {
              step: "2",
              title: "Add your product",
              text: "Name, link, logo, and a one-line tagline. No listing or account required.",
            },
            {
              step: "3",
              title: "You're live",
              text: "Pay once and your spot is at the top of the feed within minutes — no approval wait.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-white/10 bg-dune-925 p-6 space-y-3"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sun/15 text-xs font-bold text-sun">
                {item.step}
              </span>
              <h3 className="text-base font-bold text-dune-50">{item.title}</h3>
              <p className="text-xs leading-relaxed text-dune-300">{item.text}</p>
            </div>
          ))}
        </div>

        {/* ── Why Advertise Grid ── */}
        <div className="pt-6 text-center">
          <h2 className="text-2xl font-black tracking-tight text-dune-50">
            Why advertise on LaunchDunes
          </h2>
          
          <div className="mt-6 grid gap-4 sm:grid-cols-2 text-left">
            {whyAdvertise.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-dune-925 p-5"
              >
                <div className="mt-0.5 rounded-lg bg-sun/10 p-2 text-sun flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-dune-50">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-dune-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
  );
}

