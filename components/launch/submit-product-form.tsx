/**
 * submit-product-form.tsx
 * Free self-serve launch form. Requires sign-in; validation mirrors the
 * server-side rules so most mistakes are caught before the request.
 */

"use client";

import Link from "next/link";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button, buttonClasses } from "@/components/ui/button";
import { SelectField, TextAreaField, TextField } from "@/components/ui/form-field";
import { Alert, Panel } from "@/components/ui/panel";
import { useAuth } from "@/hooks/use-auth";
import { useSubmitProduct } from "@/hooks/use-submit-product";
import { getErrorMessage } from "@/lib/pb/errors";
import type { CategoryOption } from "@/lib/types/models";
import { PRICING_MODELS } from "@/lib/types/records";
import {
  fieldErrors,
  LOGO_MAX_BYTES,
  LOGO_MIME_TYPES,
  productSubmitSchema,
  type ProductSubmitInput,
} from "@/lib/validation/schemas";

type FormState = Record<keyof ProductSubmitInput, string>;
type Errors = Partial<Record<keyof ProductSubmitInput | "logo", string>>;

interface SubmitProductFormProps {
  categories: CategoryOption[];
  initialUrl?: string;
}

export function SubmitProductForm({ categories, initialUrl = "" }: SubmitProductFormProps) {
  const { user, isReady } = useAuth();
  const submit = useSubmitProduct();
  const [values, setValues] = useState<FormState>({
    websiteUrl: initialUrl,
    name: "",
    tagline: "",
    description: "",
    category: "",
    pricing: "Free",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const update = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const handleLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    let error: string | undefined;
    if (file && !LOGO_MIME_TYPES.includes(file.type)) error = "Use a PNG, JPG, WebP or SVG image.";
    else if (file && file.size > LOGO_MAX_BYTES) error = "Logo must be under 2 MB.";
    setErrors((errs) => ({ ...errs, logo: error }));
    setLogo(error ? null : file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = productSubmitSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }
    submit.mutate({ input: parsed.data, logo });
  };

  if (!isReady) return <Panel className="h-96 animate-pulse" aria-hidden />;

  if (!user) {
    const next = `/launch${initialUrl ? `?url=${encodeURIComponent(initialUrl)}` : ""}`;
    return (
      <Panel className="p-8 text-center">
        <h2 className="text-lg font-black text-white">Sign in to launch your product</h2>
        <p className="mt-2 text-sm text-dune-300">A free account lets you submit launches, upvote and comment.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href={`/register?next=${encodeURIComponent(next)}`} className={buttonClasses()}>
            Create free account
          </Link>
          <Link href={`/login?next=${encodeURIComponent(next)}`} className={buttonClasses({ variant: "secondary" })}>
            Sign in
          </Link>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {submit.isError && <Alert>{getErrorMessage(submit.error, "Couldn't submit your product.")}</Alert>}

        <TextField label="Product URL" type="url" value={values.websiteUrl} onChange={update("websiteUrl")} placeholder="https://yourproduct.com" error={errors.websiteUrl} required />
        <TextField label="Product name" value={values.name} onChange={update("name")} placeholder="My product" maxLength={80} error={errors.name} required />
        <TextField
          label="Tagline"
          value={values.tagline}
          onChange={update("tagline")}
          placeholder="What does it do, in one line?"
          maxLength={180}
          error={errors.tagline}
          hint={`${values.tagline.length} / 180`}
          required
        />
        <TextAreaField
          label="Description"
          rows={6}
          value={values.description}
          onChange={update("description")}
          placeholder="What problem does it solve, and who is it for?"
          maxLength={5000}
          error={errors.description}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Category" value={values.category} onChange={update("category")} error={errors.category} required>
            <option value="">Choose a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
          <SelectField label="Pricing" value={values.pricing} onChange={update("pricing")} error={errors.pricing}>
            {PRICING_MODELS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </SelectField>
        </div>

        <TextField
          label="Logo (optional)"
          type="file"
          accept={LOGO_MIME_TYPES.join(",")}
          onChange={handleLogo}
          error={errors.logo}
          hint="Square PNG, JPG, WebP or SVG, up to 2 MB."
          className="w-full rounded-xl border border-dune-900 bg-dune-990 px-3.5 py-2 text-xs text-dune-300 file:mr-3 file:rounded-full file:border-0 file:bg-dune-900 file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
        />

        <Button type="submit" loading={submit.isPending} className="w-full sm:w-auto">
          🚀 Publish my launch
        </Button>
      </form>
    </Panel>
  );
}
