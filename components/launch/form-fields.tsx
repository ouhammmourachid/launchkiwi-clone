/**
 * form-fields.tsx
 * Field building blocks shared by the launch form and the launch editor:
 * labels, inline errors, image uploads, and the pricing / category pickers.
 */

"use client";

import { useId, useState, type ChangeEvent, type ReactNode } from "react";

import type { CategoryOption } from "@/lib/types/models";
import { LAUNCH_PRICING_MODELS, LOGO_MAX_BYTES, MAX_CATEGORIES } from "@/lib/validation/schemas";

export const INPUT =
  "w-full rounded-xl border bg-dune-990 px-3.5 py-3 text-sm text-white placeholder:text-dune-700 outline-none transition focus:border-sun";
export const border = (error?: string) => (error ? "border-[#7f2d26]" : "border-dune-900");

export function Label({ htmlFor, children, hint, required }: { htmlFor?: string; children: ReactNode; hint?: ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-dune-50">
      <span>
        {children}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </span>
      {hint && <span className="text-[11px] font-normal text-dune-500">{hint}</span>}
    </label>
  );
}

export function FieldError({ id, children }: { id?: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-[11px] font-medium text-danger">
      {children}
    </p>
  );
}

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

interface UploadBoxProps {
  label: string;
  hint: string;
  cta: string;
  subCta?: string;
  accept: string[];
  file: File | null;
  /** Returns whether the file was accepted. */
  onFile: (file: File | null) => boolean;
  error?: string;
  square?: boolean;
  required?: boolean;
  /** Image already on the product, previewed until a new file is picked. */
  currentUrl?: string | null;
}

export function UploadBox({ label, hint, cta, subCta, accept, file, onFile, error, square, required = true, currentUrl }: UploadBoxProps) {
  const id = useId();
  const [preview, setPreview] = useState<string | null>(null);
  const shown = preview ?? currentUrl ?? null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    const accepted = onFile(next);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(accepted && next ? URL.createObjectURL(next) : null);
  };

  return (
    <div>
      <Label htmlFor={id} hint={hint} required={required}>
        {label}
      </Label>
      <label
        htmlFor={id}
        className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-5 text-center transition hover:border-sun hover:bg-dune-940 focus-within:border-sun ${
          error ? "border-[#7f2d26]" : "border-dune-850"
        }`}
      >
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL or PocketBase file preview
          <img src={shown} alt="" className={`${square ? "h-16 w-16 rounded-xl" : "h-24 w-full max-w-60 rounded-lg"} object-cover`} />
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 text-sm text-dune-300">
              <UploadIcon />
              {cta}
            </span>
            {subCta && <span className="text-[11px] text-dune-600">{subCta}</span>}
          </>
        )}
        {file ? (
          <span className="max-w-full truncate text-[11px] text-dune-500">{file.name} · change</span>
        ) : (
          currentUrl && <span className="text-[11px] text-dune-500">Click to replace</span>
        )}
        <input id={id} type="file" accept={accept.join(",")} className="sr-only" aria-invalid={!!error} onChange={handleChange} />
      </label>
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function checkImage(file: File | null, types: string[]): string | undefined {
  if (!file) return undefined;
  if (!types.includes(file.type)) return `Use a ${types.map((t) => t.split("/")[1].replace("+xml", "").toUpperCase()).join(", ")} image.`;
  if (file.size > LOGO_MAX_BYTES) return "Image must be under 2 MB.";
  return undefined;
}

type LaunchPricing = (typeof LAUNCH_PRICING_MODELS)[number];

export function PricingPicker({ value, onChange }: { value: string; onChange: (model: LaunchPricing) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-dune-50">Pricing Model</legend>
      <div className="grid grid-cols-3 gap-3">
        {LAUNCH_PRICING_MODELS.map((model) => (
          <button
            key={model}
            type="button"
            aria-pressed={value === model}
            onClick={() => onChange(model)}
            className={`rounded-xl border py-2.5 text-sm font-semibold transition ${
              value === model ? "border-sun bg-sun/15 text-sun" : "border-dune-900 bg-dune-990 text-dune-100 hover:border-dune-750"
            }`}
          >
            {model}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

interface CategoryPickerProps {
  categories: CategoryOption[];
  selected: string[];
  onToggle: (id: string) => void;
  error?: string;
  className?: string;
}

export function CategoryPicker({ categories, selected, onToggle, error, className = "" }: CategoryPickerProps) {
  return (
    <fieldset className={className}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <legend className="text-sm font-semibold text-dune-50">
          Select Categories (1–{MAX_CATEGORIES} tags)<span className="ml-0.5 text-danger">*</span>
        </legend>
        <span className="text-[11px] font-semibold text-dune-500">
          {selected.length}/{MAX_CATEGORIES} chosen
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isSelected = selected.includes(c.id);
          const full = !isSelected && selected.length >= MAX_CATEGORIES;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={isSelected}
              disabled={full}
              onClick={() => onToggle(c.id)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                isSelected ? "border-sun bg-sun text-on-sun" : "border-dune-900 bg-dune-990 text-dune-200 hover:border-dune-750"
              }`}
            >
              {isSelected && "✓ "}
              {c.name}
            </button>
          );
        })}
      </div>
      <FieldError>{error}</FieldError>
    </fieldset>
  );
}
