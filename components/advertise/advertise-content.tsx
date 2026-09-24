/**
 * advertise-content.tsx — interactive body of the /advertise page (sidebar spotlight ads)
 * - Hero, stats bar (products listed is live; CPM is derived from the plan)
 * - Spotlight plan cards and booking form, from the `ad_plans` collection
 * - Booking uploads the logo and pays through a Lemon Squeezy checkout
 *   (POST /api/ads/checkout in pb_hooks/ads.pb.js); no account needed
 * - "Recently in the spotlight rotation" chips from real bookings
 * - 3-step process and "Why advertise" grid
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { checkImage, UploadBox } from "@/components/launch/form-fields";
import { ProductLogo } from "@/components/products/product-logo";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-field";
import { Alert } from "@/components/ui/panel";
import { marketingStats } from "@/data/site";
import { useAuth } from "@/hooks/use-auth";
import { createAdCheckout } from "@/lib/api/ads";
import { getErrorMessage } from "@/lib/pb/errors";
import type { AdPlan, SpotlightAd } from "@/lib/types/models";
import { adBookingSchema, fieldErrors, LOGO_MIME_TYPES, type AdBookingInput } from "@/lib/validation/schemas";
import { formatNumber } from "@/lib/utils/format";

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

// ─── Component Data ───────────────────────────────────────────────────────────

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



const MONTHLY_VISITORS = Number(marketingStats.find((s) => s.label === "Monthly visitors")?.value.replace(/\D/g, "")) || 0;
/** PocketBase's default file size limit for the ad logo. */
const AD_LOGO_MAX_BYTES = 5 * 1024 * 1024;

const money = (value: number) => `$${Number.isInteger(value) ? value : value.toFixed(2)}`;

type FieldKey = keyof AdBookingInput | "logo";

// ─── Main Page ────────────────────────────────────────────────────────────────

interface AdvertiseContentProps {
  plans: AdPlan[];
  recent: SpotlightAd[];
  productsListed: number | null;
  /** Back from a paid checkout. */
  booked: boolean;
}

export function AdvertiseContent({ plans, recent, productsListed, booked }: AdvertiseContentProps) {
  const { user } = useAuth();
  const [planSlug, setPlanSlug] = useState(plans[0]?.slug ?? "");
  const [productName, setProductName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [tagline, setTagline] = useState("");
  // null until edited, so signed-in advertisers default to their account email.
  const [emailInput, setEmailInput] = useState<string | null>(null);
  const email = emailInput ?? user?.email ?? "";
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});

  const plan = plans.find((p) => p.slug === planSlug) ?? plans[0];
  const shortest = plans[0];
  const cpm = shortest && MONTHLY_VISITORS ? shortest.price / ((MONTHLY_VISITORS * shortest.durationDays) / 30 / 1000) : null;

  const checkout = useMutation({
    mutationFn: createAdCheckout,
    onSuccess: (url) => window.location.assign(url),
  });
  const busy = checkout.isPending || checkout.isSuccess;

  const choosePlan = (slug: string, scroll = false) => {
    setPlanSlug(slug);
    if (scroll) document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogo = (file: File | null) => {
    const error = checkImage(file, LOGO_MIME_TYPES) ?? (file && file.size > AD_LOGO_MAX_BYTES ? "Keep the logo under 5 MB." : undefined);
    setErrors((prev) => ({ ...prev, logo: error }));
    setLogo(error ? null : file);
    return !error;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!plan || busy) return;
    const parsed = adBookingSchema.safeParse({ productName, websiteUrl, tagline, email });
    const next: Partial<Record<FieldKey, string>> = parsed.success ? {} : fieldErrors(parsed.error);
    if (!logo) next.logo = errors.logo ?? "Upload your logo.";
    setErrors(next);
    if (!parsed.success || !logo) return;
    checkout.mutate({ plan: plan.slug, logo, ...parsed.data });
  };

  const stats = [
    ...marketingStats.map((s) => ({ value: s.value, label: s.label === "Domain authority" ? "DOMAIN RATING" : s.label.toUpperCase() })),
    ...(cpm ? [{ value: `~$${cpm.toFixed(2)}`, label: `EST. CPM (${shortest.durationDays}-DAY)` }] : []),
    ...(productsListed ? [{ value: `${formatNumber(productsListed)}+`, label: "PRODUCTS LISTED" }] : []),
  ];

  return (
      <div className="space-y-8 pb-12">

        {booked && (
          <Alert tone="success">
            Payment received — thank you! Your spotlight goes live as soon as Lemon Squeezy confirms the order, usually within a
            minute. A receipt is on its way to your inbox.
          </Alert>
        )}

        {/* ── Hero Section ── */}
        <section className="pt-10 pb-4 text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sun/40 bg-sun/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sun">
            <MegaphoneIcon />
            Advertise
          </span>

          <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-dune-50 md:text-5xl lg:text-[3.2rem]">
            In the spotlight.
            <br />
            Every visitor.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-dune-300 max-w-lg mx-auto">
            A spotlight card in the left and right sidebars of the homepage and browse pages — no directory listing required.
            Pick a duration, pay once, and it&apos;s live today.
          </p>
        </section>

        {/* ── Stats Bar ── */}
        <div className="rounded-xl border border-white/10 bg-dune-925 px-6 py-5">
          <div className={`grid grid-cols-2 gap-4 text-center ${stats.length > 3 ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
            {stats.map((stat) => (
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
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col justify-between rounded-xl border p-6 transition-all ${
                p.slug === plan?.slug ? "border-sun/60 bg-dune-925" : "border-white/10 bg-dune-925"
              }`}
            >
              {(p.slug === plan?.slug || p.bestValue) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-sun px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-on-sun">
                    {p.bestValue ? "BEST VALUE" : "SELECTED"}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-dune-50">{p.durationDays} days</span>
                  <span className="rounded-full bg-sun/15 px-2.5 py-0.5 text-[11px] font-semibold text-sun">
                    ${p.perDay.toFixed(2)}/day
                  </span>
                </div>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-black tracking-tight text-dune-50">{money(p.price)}</span>
                  <span className="mb-1 text-xs text-dune-300">one-time</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {p.features.map((feature) => (
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
                type="button"
                onClick={() => choosePlan(p.slug, true)}
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-sun-deep hover:bg-sun px-4 py-3 text-sm font-bold text-dune-50 transition-colors cursor-pointer"
              >
                Book {p.durationDays} days &rarr;
              </button>
            </div>
          ))}
        </div>

        {/* ── Booking Form Section ── */}
        <div id="booking-form" className="max-w-4xl mx-auto rounded-xl border border-white/10 bg-dune-925 p-6 sm:p-8">
          {plans.length === 0 ? (
            <p className="text-center text-sm text-dune-300">Spotlight bookings are paused right now. Please check back soon.</p>
          ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* Step 1: Choose Duration */}
              <fieldset>
                <legend className="text-xs font-bold uppercase tracking-[0.15em] text-dune-300">
                  1. CHOOSE A DURATION
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  {plans.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={p.slug === plan?.slug}
                      onClick={() => choosePlan(p.slug)}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all cursor-pointer ${
                        p.slug === plan?.slug
                          ? "border-sun bg-sun/10 text-dune-50"
                          : "border-white/10 bg-dune-970 text-dune-300 hover:border-white/20"
                      }`}
                    >
                      <span className="text-xl font-bold text-sun">{money(p.price)}</span>
                      <span className="text-xs font-semibold mt-1">{p.durationDays} days</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-dune-300">
                  Starts as soon as payment clears and runs for the window you pick.
                </p>
              </fieldset>

              {/* Step 2: Your Product */}
              <fieldset className="space-y-4 pt-2">
                <legend className="text-xs font-bold uppercase tracking-[0.15em] text-dune-300">
                  2. YOUR PRODUCT
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Product name *"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Product name"
                    maxLength={80}
                    error={errors.productName}
                  />
                  <TextField
                    label="Website URL *"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="yourproduct.com"
                    inputMode="url"
                    autoComplete="url"
                    error={errors.websiteUrl}
                  />
                </div>

                <TextField
                  label="Tagline *"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="One line describing your product"
                  maxLength={140}
                  error={errors.tagline}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField
                    label="Contact email *"
                    type="email"
                    value={email}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="you@yourproduct.com"
                    autoComplete="email"
                    hint="For your receipt and booking confirmation."
                    error={errors.email}
                  />
                  <UploadBox
                    label="Logo"
                    hint="Square, PNG/JPG/WebP/SVG"
                    cta="Upload logo"
                    accept={LOGO_MIME_TYPES}
                    file={logo}
                    onFile={handleLogo}
                    error={errors.logo}
                    square
                  />
                </div>
              </fieldset>

              {checkout.isError && <Alert>{getErrorMessage(checkout.error, "Couldn't start checkout.")}</Alert>}

              {/* Submit Button */}
              <Button type="submit" loading={busy} className="w-full rounded-lg py-3">
                {plan ? `Pay ${money(plan.price)} — book ${plan.durationDays} days` : "Book your spotlight"}
              </Button>
              <p className="text-center text-xs text-dune-300">
                Secure payment by Lemon Squeezy. One-time charge, no subscription, no account needed.
              </p>

          </form>
          )}
        </div>

        {/* ── Spotlight Rotation Chips ── */}
        {recent.length > 0 && (
          <div className="pt-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dune-300">
              RECENTLY IN THE SPOTLIGHT ROTATION
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              {recent.map((item) => (
                <a
                  key={item.id}
                  href={item.clickUrl}
                  target="_blank"
                  rel="sponsored noopener"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-dune-925 px-3.5 py-1.5 text-xs font-semibold text-dune-50 transition hover:border-sun/40"
                >
                  <ProductLogo name={item.name} logoUrl={item.logoUrl} size="xs" />
                  <span>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── 3-Step Process ── */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Pick a plan",
              text: `${plans.map((p) => p.durationDays).join(" or ")} days — one flat price, no bidding or CPM auctions.`,
            },
            {
              step: "2",
              title: "Add your product",
              text: "Name, link, logo, and a one-line tagline. No listing or account required.",
            },
            {
              step: "3",
              title: "You're live",
              text: "Pay once and your card is in the sidebar spotlight within minutes — no approval wait.",
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
