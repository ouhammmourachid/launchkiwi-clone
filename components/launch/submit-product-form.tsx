/**
 * submit-product-form.tsx
 * The launch form: product details on the left, launch tier + date on the
 * right. Free launches join the queue; paid tiers continue to checkout.
 * Validation mirrors the server-side rules so most mistakes are caught early.
 */

"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

import { border, CategoryPicker, checkImage, FieldError, INPUT, Label, PricingPicker, UploadBox } from "@/components/launch/form-fields";
import { RichTextEditor } from "@/components/launch/rich-text-editor";
import { Button, buttonClasses } from "@/components/ui/button";
import { Alert } from "@/components/ui/panel";
import { useAuth } from "@/hooks/use-auth";
import { useSubmitProduct } from "@/hooks/use-submit-product";
import { getErrorMessage } from "@/lib/pb/errors";
import type { CategoryOption, PricingPlan } from "@/lib/types/models";
import { formatPlanPrice } from "@/lib/utils/format";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  fieldErrors,
  LOGO_MIME_TYPES,
  MAX_CATEGORIES,
  productSubmitSchema,
  SCREENSHOT_MIME_TYPES,
  TAGLINE_MAX,
  type ProductSubmitInput,
} from "@/lib/validation/schemas";

type Errors = Partial<Record<keyof ProductSubmitInput | "logo" | "screenshot" | "autofill", string>>;

interface SubmitProductFormProps {
  categories: CategoryOption[];
  plans: PricingPlan[];
  tagIdsBySlug: Record<string, string>;
  /** When the next free queue slot opens (PocketBase date), if known. */
  nextFreeDate: string | null;
  initialUrl?: string;
  initialPlan?: string;
}

const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Today as "YYYY-MM-DD" in the visitor's timezone (what <input type=date> uses). */
function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

export function SubmitProductForm({ categories, plans, tagIdsBySlug, nextFreeDate, initialUrl = "", initialPlan }: SubmitProductFormProps) {
  const { user, isReady } = useAuth();
  const submit = useSubmitProduct();
  const ids = { url: useId(), name: useId(), tagline: useId(), description: useId() };

  const [values, setValues] = useState<ProductSubmitInput>({
    websiteUrl: initialUrl,
    name: "",
    tagline: "",
    description: "",
    categories: [],
    pricing: "Free",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [autofilling, setAutofilling] = useState(false);

  const freePlan = plans.find((p) => p.price === 0);
  const [planSlug, setPlanSlug] = useState(
    plans.some((p) => p.slug === initialPlan) ? initialPlan! : (freePlan ?? plans[0])?.slug ?? "",
  );
  const plan = plans.find((p) => p.slug === planSlug);
  const isPaid = !!plan && plan.price > 0;

  const [today] = useState(todayIso);
  const [launchDate, setLaunchDate] = useState(today);
  const queueLabel = nextFreeDate ? shortDate.format(new Date(nextFreeDate.replace(" ", "T"))) : null;

  const set = <K extends keyof ProductSubmitInput>(field: K, value: ProductSubmitInput[K]) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const toggleCategory = (id: string) => {
    const selected = values.categories.includes(id);
    if (!selected && values.categories.length >= MAX_CATEGORIES) return;
    set("categories", selected ? values.categories.filter((c) => c !== id) : [...values.categories, id]);
  };

  const pickFile = (field: "logo" | "screenshot", types: string[], setter: (f: File | null) => void) => (file: File | null) => {
    const error = checkImage(file, types);
    setErrors((errs) => ({ ...errs, [field]: error }));
    setter(error ? null : file);
    return !error;
  };

  const autofill = async () => {
    const url = values.websiteUrl.trim();
    if (!/^https?:\/\/\S+\.\S+/i.test(url)) {
      setErrors((errs) => ({ ...errs, websiteUrl: "Enter a full URL first, e.g. https://yourproduct.com" }));
      return;
    }
    setAutofilling(true);
    setErrors((errs) => ({ ...errs, websiteUrl: undefined, autofill: undefined }));
    try {
      const res = await fetch(`/api/autofill?url=${encodeURIComponent(url)}`);
      const data: { name?: string; tagline?: string; description?: string; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error);
      setValues((v) => ({
        ...v,
        name: v.name || (data.name ?? "").slice(0, 80),
        tagline: v.tagline || (data.tagline ?? "").slice(0, TAGLINE_MAX),
        description: v.description || (data.description ? `<p>${data.description.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>` : ""),
      }));
    } catch (err) {
      setErrors((errs) => ({ ...errs, autofill: err instanceof Error && err.message ? err.message : "Couldn't read that website." }));
    } finally {
      setAutofilling(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = productSubmitSchema.safeParse(values);
    const next: Errors = parsed.success ? {} : fieldErrors(parsed.error);
    if (!logo) next.logo = errors.logo ?? "Upload your product logo.";
    if (!screenshot) next.screenshot = errors.screenshot ?? "Upload a preview screenshot.";
    setErrors(next);
    if (!parsed.success || !logo || !screenshot || !plan) return;

    submit.mutate({
      input: parsed.data,
      files: { logo, screenshot },
      categorySlugs: parsed.data.categories.map((id) => categories.find((c) => c.id === id)?.slug ?? "").filter(Boolean),
      tagIdsBySlug,
      paidPlan: isPaid ? plan.slug : null,
      launchDate: launchDate < today ? today : launchDate,
    });
  };

  const signInNext = `/launch${values.websiteUrl ? `?url=${encodeURIComponent(values.websiteUrl)}` : ""}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 p-6 md:p-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      {/* ── Product details ─────────────────────────────────────────────── */}
      <div className="min-w-0 space-y-6">
        <div>
          <Label htmlFor={ids.url} required>
            Website URL
          </Label>
          <div className="flex gap-3">
            <div className="relative min-w-0 flex-1">
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dune-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
                <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
              </svg>
              <input
                id={ids.url}
                type="url"
                value={values.websiteUrl}
                onChange={(e) => set("websiteUrl", e.target.value)}
                placeholder="https://yourproduct.com"
                aria-invalid={!!errors.websiteUrl}
                className={`${INPUT} pl-10 ${border(errors.websiteUrl)}`}
              />
            </div>
            <Button type="button" variant="secondary" onClick={autofill} loading={autofilling} className="shrink-0 rounded-xl border-sun/60 text-sun hover:bg-dune-925">
              {!autofilling && (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M10 3.5 11.6 8a2 2 0 0 0 1.3 1.3l4.6 1.6-4.6 1.6a2 2 0 0 0-1.3 1.3L10 18.4l-1.6-4.6a2 2 0 0 0-1.3-1.3L2.5 10.9l4.6-1.6A2 2 0 0 0 8.4 8zM19 3v4M17 5h4M18 16v4M16 18h4" />
                </svg>
              )}
              Autofill
            </Button>
          </div>
          <FieldError>{errors.websiteUrl ?? errors.autofill}</FieldError>
        </div>

        <div>
          <Label htmlFor={ids.name} required>
            Project Name
          </Label>
          <input
            id={ids.name}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="e.g. SEObeast, BuildPassport"
            maxLength={80}
            aria-invalid={!!errors.name}
            className={`${INPUT} ${border(errors.name)}`}
          />
          <FieldError>{errors.name}</FieldError>
        </div>

        <div>
          <Label htmlFor={ids.tagline} required>
            Tagline
          </Label>
          <textarea
            id={ids.tagline}
            rows={3}
            value={values.tagline}
            onChange={(e) => set("tagline", e.target.value.replace(/\n/g, " "))}
            placeholder="e.g. Rank in Google. Cited by AI. On autopilot."
            maxLength={TAGLINE_MAX}
            aria-invalid={!!errors.tagline}
            className={`${INPUT} resize-none ${border(errors.tagline)}`}
          />
          <div className="mt-1.5 flex justify-between gap-4">
            <FieldError>{errors.tagline}</FieldError>
            <span className="ml-auto text-[11px] text-dune-600">
              {values.tagline.length}/{TAGLINE_MAX}
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor={ids.description} required>
            Description
          </Label>
          <RichTextEditor
            id={ids.description}
            value={values.description}
            onChange={(html) => set("description", html)}
            placeholder="Describe your product — what it does, who it's for, and what makes it different…"
            min={DESCRIPTION_MIN}
            max={DESCRIPTION_MAX}
            invalid={!!errors.description}
          />
          <FieldError>{errors.description}</FieldError>
        </div>

        <PricingPicker value={values.pricing} onChange={(model) => set("pricing", model)} />

        <div className="grid gap-5 border-t border-dune-900 pt-6 sm:grid-cols-2">
          <UploadBox
            label="Product Logo"
            hint="Square · PNG/JPG/SVG · max 2 MB"
            cta="Upload logo"
            accept={LOGO_MIME_TYPES}
            file={logo}
            onFile={pickFile("logo", LOGO_MIME_TYPES, setLogo)}
            error={errors.logo}
            square
          />
          <UploadBox
            label="Preview Screenshot"
            hint="1200×630 · max 2 MB"
            cta="Upload preview screenshot"
            subCta="PNG, JPG or WebP"
            accept={SCREENSHOT_MIME_TYPES}
            file={screenshot}
            onFile={pickFile("screenshot", SCREENSHOT_MIME_TYPES, setScreenshot)}
            error={errors.screenshot}
          />
        </div>

        <CategoryPicker
          categories={categories}
          selected={values.categories}
          onToggle={toggleCategory}
          error={errors.categories}
          className="border-t border-dune-900 pt-6"
        />
      </div>

      {/* ── Launch tier ─────────────────────────────────────────────────── */}
      <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-dune-50">Choose your launch tier</legend>
          <div className="space-y-3">
            {plans.map((p) => (
              <TierCard key={p.id} plan={p} selected={p.slug === planSlug} onSelect={() => setPlanSlug(p.slug)} queueLabel={queueLabel} />
            ))}
          </div>
        </fieldset>

        <div className="pt-2">
          <Label htmlFor="launch-date">Launch date</Label>
          <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${isPaid ? "border-dune-900 bg-dune-990" : "border-dune-900 bg-dune-940"}`}>
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-dune-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
              <rect x="3" y="4.5" width="18" height="17" rx="2" />
              <path d="M16 2.5v4M8 2.5v4M3 10h18" />
            </svg>
            {isPaid ? (
              <input
                id="launch-date"
                type="date"
                min={today}
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value || today)}
                className="min-w-0 flex-1 bg-transparent text-base font-semibold text-white outline-none [color-scheme:dark] light:[color-scheme:light]"
              />
            ) : (
              <span id="launch-date" className="flex-1 text-base font-semibold text-dune-300">
                {queueLabel ?? "Next open slot"}
              </span>
            )}
            {isPaid && launchDate <= today ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                <BoltIcon />
                Instant
              </span>
            ) : (
              <span className="text-xs font-bold text-dune-500">{isPaid ? "Scheduled" : "Queued"}</span>
            )}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-dune-500">
            {isPaid
              ? "Paid tiers skip the queue entirely — pick today to go live instantly, or a later date to schedule it."
              : "Free launches go live on the next open queue slot once our badge is verified on your site. Upgrade anytime to skip the wait."}
          </p>
        </div>

        <div className="space-y-3 border-t border-dune-900 pt-4">
          {submit.isError && <Alert>{getErrorMessage(submit.error, "Couldn't submit your product.")}</Alert>}

          {isReady && !user ? (
            <div className="rounded-xl border border-dune-850 bg-dune-940 p-4 text-center">
              <p className="text-sm font-bold text-white">Sign in to launch</p>
              <p className="mt-1 text-xs text-dune-400">A free account lets you submit launches, upvote and comment.</p>
              <div className="mt-3 flex justify-center">
                <Link href={`/login?next=${encodeURIComponent(signInNext)}`} className={buttonClasses({ size: "sm" })}>
                  Sign in or create an account
                </Link>
              </div>
            </div>
          ) : (
            <Button type="submit" loading={submit.isPending || (submit.isSuccess && isPaid)} disabled={!isReady} className="w-full rounded-xl py-3">
              {isPaid && plan ? `Continue to payment · ${formatPlanPrice(plan)}` : "Launch for free"}
            </Button>
          )}
          {isPaid && <p className="text-center text-[11px] text-dune-500">Secure one-time payment by Lemon Squeezy. No subscription.</p>}
        </div>
      </aside>
    </form>
  );
}

function TierCard({ plan, selected, onSelect, queueLabel }: { plan: PricingPlan; selected: boolean; onSelect: () => void; queueLabel: string | null }) {
  const isFree = plan.price === 0;
  const best = plan.highlighted;
  const features = isFree ? plan.features.filter((f) => !/queue/i.test(f)) : plan.features;

  const tone = selected
    ? `border-sun ring-2 ring-sun/30 ${best ? "bg-sun/10" : "bg-dune-925"}`
    : `border-dune-850 hover:border-dune-750 ${best ? "bg-sun/5" : "bg-dune-990"}`;

  return (
    <label className={`relative block cursor-pointer rounded-2xl border p-4 transition ${tone}`}>
      <input type="radio" name="tier" value={plan.slug} checked={selected} onChange={onSelect} className="sr-only" />
      {best && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-sun px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-on-sun">
          Best value
        </span>
      )}
      <div className="flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-2 text-base font-bold text-white">
          <span
            aria-hidden
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full border-2 ${selected ? "border-sun" : "border-dune-700"}`}
          >
            {selected && <span className="h-1.5 w-1.5 rounded-full bg-sun" />}
          </span>
          {plan.name}
        </span>
        <span className={`text-lg font-black ${best ? "text-sun" : "text-dune-200"}`}>{formatPlanPrice(plan)}</span>
      </div>
      <p className="mt-1 text-sm text-dune-300">{plan.description}</p>
      {!isFree && (
        <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
          <BoltIcon />
          Live instantly
        </p>
      )}
      <ul className={`mt-3 space-y-1 border-t pt-3 text-[13px] border-dune-900 ${best ? "text-sun" : "text-dune-200"}`}>
        {features.map((f) => (
          <li key={f}>✓ {f}</li>
        ))}
        {isFree && <li className="text-dune-400">~ Queue based launch{queueLabel ? ` (next available: ${queueLabel})` : ""}</li>}
      </ul>
    </label>
  );
}
