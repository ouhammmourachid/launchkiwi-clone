/**
 * upgrade-form.tsx
 * Pick one of your launches and pay for a Premium/Priority upgrade through
 * a hosted Lemon Squeezy checkout.
 */

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { ProductLogo } from "@/components/products/product-logo";
import { Button, buttonClasses } from "@/components/ui/button";
import { Alert, Panel } from "@/components/ui/panel";
import { useAuth } from "@/hooks/use-auth";
import { createCheckout } from "@/lib/api/checkout";
import { listProductsByMaker } from "@/lib/api/products";
import { getErrorMessage } from "@/lib/pb/errors";
import { queryKeys } from "@/lib/query-keys";
import type { PricingPlan } from "@/lib/types/models";

interface UpgradeFormProps {
  plan: PricingPlan;
  priceLabel: string;
  initialProductId?: string;
}

export function UpgradeForm({ plan, priceLabel, initialProductId }: UpgradeFormProps) {
  const { user, isReady } = useAuth();
  const products = useQuery({
    queryKey: queryKeys.myProducts(user?.id),
    queryFn: () => listProductsByMaker(user!.id),
    enabled: !!user,
  });
  const [selected, setSelected] = useState(initialProductId ?? "");
  const productId = selected || products.data?.[0]?.id || "";

  const checkout = useMutation({
    mutationFn: () => createCheckout(plan.slug, productId),
    onSuccess: (url) => window.location.assign(url),
  });

  if (!isReady || (user && products.isLoading)) return <Panel className="h-64 animate-pulse" aria-hidden />;

  if (!user) {
    const next = `/upgrade?plan=${plan.slug}`;
    return (
      <Panel className="p-8 text-center">
        <h2 className="text-lg font-black text-white">Sign in to upgrade a launch</h2>
        <p className="mt-2 text-sm text-dune-300">Upgrades apply to products you&apos;ve launched with your account.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href={`/login?next=${encodeURIComponent(next)}`} className={buttonClasses()}>
            Sign in
          </Link>
          <Link href={`/register?next=${encodeURIComponent(next)}`} className={buttonClasses({ variant: "secondary" })}>
            Create free account
          </Link>
        </div>
      </Panel>
    );
  }

  if (!products.data?.length) {
    return (
      <Panel className="p-8 text-center">
        <h2 className="text-lg font-black text-white">Launch a product first</h2>
        <p className="mt-2 text-sm text-dune-300">Submit your product for free, then come back to upgrade it to {plan.name}.</p>
        <Link href="/launch" className={buttonClasses({ className: "mt-5" })}>
          Launch your product
        </Link>
      </Panel>
    );
  }

  return (
    <Panel className="p-6">
      <fieldset>
        <legend className="text-sm font-black uppercase tracking-widest text-dune-200">Which product?</legend>
        <div className="mt-4 space-y-2">
          {products.data.map((product) => (
            <label
              key={product.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                productId === product.id ? "border-sun bg-dune-925" : "border-dune-900 hover:border-dune-800"
              }`}
            >
              <input
                type="radio"
                name="product"
                value={product.id}
                checked={productId === product.id}
                onChange={() => setSelected(product.id)}
                className="accent-[var(--color-sun)]"
              />
              <ProductLogo name={product.name} logoUrl={product.logoUrl} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-white">{product.name}</span>
                <span className="block truncate text-xs text-dune-400">{product.tagline}</span>
              </span>
              {product.badge && <span className="text-[10px] font-black uppercase tracking-wider text-sun">{product.badge}</span>}
            </label>
          ))}
        </div>
      </fieldset>

      {checkout.isError && (
        <div className="mt-4">
          <Alert>{getErrorMessage(checkout.error, "Couldn't start checkout.")}</Alert>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-dune-500">Secure payment by Lemon Squeezy. One-time charge, no subscription.</p>
        <Button onClick={() => checkout.mutate()} loading={checkout.isPending || checkout.isSuccess} disabled={!productId} className="whitespace-nowrap">
          Pay {priceLabel} — get {plan.name}
        </Button>
      </div>
    </Panel>
  );
}
