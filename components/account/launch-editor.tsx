/**
 * launch-editor.tsx
 * A maker's edit page for one of their launches. Name and URL are locked once
 * submitted (the products update hook enforces it); everything else is editable.
 * Launches still waiting on their badge show the verification steps first.
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, type FormEvent } from "react";

import { EmptyList, SectionHeading, StatusPill } from "@/components/account/account-ui";
import { BadgeVerification } from "@/components/account/badge-verification";
import { border, CategoryPicker, checkImage, FieldError, INPUT, Label, PricingPicker, UploadBox } from "@/components/launch/form-fields";
import { RichTextEditor } from "@/components/launch/rich-text-editor";
import { LockIcon } from "@/components/layout/nav-icons";
import { ProductLogo } from "@/components/products/product-logo";
import { Button, buttonClasses } from "@/components/ui/button";
import { Alert, Panel } from "@/components/ui/panel";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getMyLaunch, updateLaunch } from "@/lib/api/products";
import { getErrorMessage } from "@/lib/pb/errors";
import { queryKeys } from "@/lib/query-keys";
import type { CategoryOption, EditableLaunch } from "@/lib/types/models";
import { displayHost } from "@/lib/utils/format";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  fieldErrors,
  LOGO_MIME_TYPES,
  MAX_CATEGORIES,
  productEditSchema,
  SCREENSHOT_MIME_TYPES,
  TAGLINE_MAX,
  type ProductEditInput,
} from "@/lib/validation/schemas";

type Errors = Partial<Record<keyof ProductEditInput | "logo" | "screenshot", string>>;

interface LaunchEditorProps {
  launchId: string;
  categories: CategoryOption[];
  tagIdsBySlug: Record<string, string>;
}

export function LaunchEditor({ launchId, categories, tagIdsBySlug }: LaunchEditorProps) {
  const { user, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) router.replace(`/login?next=/account/launches/${launchId}`);
  }, [isReady, user, router, launchId]);

  const launch = useQuery({
    queryKey: queryKeys.myLaunch(launchId),
    queryFn: () => getMyLaunch(launchId, user!.id),
    enabled: !!user,
  });

  if (!user || launch.isLoading) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-dune-940" aria-busy aria-label="Loading launch" />;
  }

  if (launch.isError || !launch.data) {
    return (
      <div className="space-y-4 py-6">
        <BackLink />
        {launch.isError ? (
          <Alert>{getErrorMessage(launch.error, "We couldn't load this launch. Refresh the page to try again.")}</Alert>
        ) : (
          <EmptyList title="We couldn't find that launch">It may have been removed, or it belongs to another account.</EmptyList>
        )}
      </div>
    );
  }

  const data = launch.data;

  return (
    <div className="space-y-10 pb-16">
      <header className="pt-4">
        <BackLink />
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="shrink-0 rounded-[22px] bg-dune-940 p-1.5 ring-1 ring-dune-850">
              <ProductLogo name={data.name} logoUrl={data.logoUrl} size="row" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-black tracking-tight text-white sm:text-3xl">Edit {data.name}</h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-dune-500">
                <StatusPill launch={data} />
                <span>{displayHost(data.websiteUrl)}</span>
              </div>
            </div>
          </div>
          {data.status === "published" && (
            <Link href={`/p/${data.slug}`} className={buttonClasses({ variant: "secondary", className: "shrink-0 self-start rounded-xl sm:self-auto" })}>
              View live page ↗
            </Link>
          )}
        </div>
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-dune-850 to-transparent" aria-hidden />
      </header>

      {data.needsBadge && (
        <section aria-labelledby="attention-heading" className="space-y-4">
          <SectionHeading id="attention-heading" title="Needs your attention" meta="Hidden until verified" dot="bg-sun animate-pulse" />
          <BadgeVerification launch={data} userId={user.id} />
        </section>
      )}

      <section aria-labelledby="details-heading" className="space-y-4">
        <SectionHeading id="details-heading" title="Launch details" />
        {/* Keyed by id so the form re-seeds if the maker navigates between launches. */}
        <EditLaunchForm key={data.id} launch={data} categories={categories} tagIdsBySlug={tagIdsBySlug} userId={user.id} />
      </section>
    </div>
  );
}

function BackLink() {
  return (
    <Link href="/account" className="inline-flex items-center gap-1 text-xs font-semibold text-dune-400 transition-colors hover:text-sun">
      ← My launches
    </Link>
  );
}

/** Categories on the product: the primary one first, then any tag that mirrors a category. */
function initialCategories(launch: EditableLaunch, categories: CategoryOption[]): string[] {
  const idBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  const known = new Set(categories.map((c) => c.id));
  const picked = [launch.categoryId, ...launch.tagRefs.map((t) => idBySlug.get(t.slug))].filter(
    (id): id is string => !!id && known.has(id),
  );
  return [...new Set(picked)].slice(0, MAX_CATEGORIES);
}

interface EditLaunchFormProps {
  launch: EditableLaunch;
  categories: CategoryOption[];
  tagIdsBySlug: Record<string, string>;
  userId: string;
}

function EditLaunchForm({ launch, categories, tagIdsBySlug, userId }: EditLaunchFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const ids = { name: useId(), url: useId(), tagline: useId(), description: useId() };

  const [values, setValues] = useState<ProductEditInput>(() => ({
    tagline: launch.tagline,
    description: launch.descriptionHtml,
    categories: initialCategories(launch, categories),
    pricing: launch.pricing ?? "Free",
  }));
  const [logo, setLogo] = useState<File | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const save = useMutation({
    mutationFn: (input: ProductEditInput) =>
      updateLaunch(
        launch,
        input,
        { logo, screenshot },
        {
          picked: input.categories.map((id) => categories.find((c) => c.id === id)?.slug ?? "").filter(Boolean),
          all: categories.map((c) => c.slug),
        },
        tagIdsBySlug,
      ),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.myLaunch(launch.id), updated);
      void queryClient.invalidateQueries({ queryKey: queryKeys.myProducts(userId) });
      setLogo(null);
      setScreenshot(null);
      toast(`${launch.name} is updated.`);
    },
  });

  const set = <K extends keyof ProductEditInput>(field: K, value: ProductEditInput[K]) => {
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = productEditSchema.safeParse(values);
    setErrors(parsed.success ? {} : fieldErrors(parsed.error));
    if (parsed.success) save.mutate(parsed.data);
  };

  return (
    <Panel className="">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-6 p-6 md:p-8">
          {/* Identity is fixed once submitted — shown for reference only. */}
          <div className="grid gap-5 sm:grid-cols-2">
            <LockedField id={ids.name} label="Project Name" value={launch.name} />
            <LockedField id={ids.url} label="Website URL" value={launch.websiteUrl} />
          </div>
          <p className="-mt-3 flex items-center gap-1.5 text-[11px] text-dune-500">
            <LockIcon className="h-3 w-3" />
            The name and URL can&apos;t be changed after launch. Need to fix one? Contact us.
          </p>

          <div className="border-t border-dune-900 pt-6">
            <Label htmlFor={ids.tagline} required>
              Tagline
            </Label>
            <textarea
              id={ids.tagline}
              rows={2}
              value={values.tagline}
              onChange={(e) => set("tagline", e.target.value.replace(/\n/g, " "))}
              maxLength={TAGLINE_MAX}
              aria-invalid={!!errors.tagline}
              className={`${INPUT} resize-none ${border(errors.tagline)}`}
            />
            <div className="mt-1.5 flex justify-between gap-4">
              <FieldError>{errors.tagline}</FieldError>
              <span className="ml-auto text-[11px] tabular-nums text-dune-600">
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
              currentUrl={launch.logoUrl}
              required={false}
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
              currentUrl={launch.screenshotUrl}
              required={false}
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

        <div className="flex flex-col-reverse gap-3 rounded-b-[24px] border-t border-dune-850 bg-dune-925/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="min-w-0 flex-1">
            {save.isError && <Alert>{getErrorMessage(save.error, "Couldn't save your changes.")}</Alert>}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link href="/account" className={buttonClasses({ variant: "secondary", className: "rounded-xl" })}>
              Cancel
            </Link>
            <Button type="submit" loading={save.isPending} className="rounded-xl">
              Save changes
            </Button>
          </div>
        </div>
      </form>
    </Panel>
  );
}

function LockedField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <input id={id} value={value} readOnly aria-readonly className={`${INPUT} cursor-default border-dune-900 pr-10 text-dune-300 focus:border-dune-850`} />
        <LockIcon className="pointer-events-none absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-dune-600" />
      </div>
    </div>
  );
}
