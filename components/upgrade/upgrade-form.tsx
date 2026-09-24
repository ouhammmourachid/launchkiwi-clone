/**
 * upgrade-form.tsx
 * Pick one of your launches, then Premium or Priority, and pay through a
 * hosted Lemon Squeezy checkout.
 */

"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { PlanCard } from "@/components/pricing/plan-card";
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
  /** Paid plans only. */
  plans: PricingPlan[];
  initialProductId?: string;
}

export function UpgradeForm({ plans, initialProductId }: UpgradeFormProps) {
  const { user, isReady } = useAuth();
  const products = useQuery({
    queryKey: queryKeys.myProducts(user?.id),
    queryFn: () => listProductsByMaker(user!.id),
    enabled: !!user,
  });
  const [selected, setSelected] = useState(initialProductId ?? "");
  const productId = selected || products.data?.[0]?.id || "";

  const checkout = useMutation({
    mutationFn: (planSlug: string) => createCheckout(planSlug, productId),
    onSuccess: (url) => window.location.assign(url),
  });
  const busy = checkout.isPending || checkout.isSuccess;

  if (!isReady || (user && products.isLoading)) return <Panel className="h-64 animate-pulse" aria-hidden />;

  const hasProducts = !!products.data?.length;
  const loginHref = `/login?next=${encodeURIComponent(initialProductId ? `/upgrade?product=${initialProductId}` : "/upgrade")}`;

  const action = (plan: PricingPlan) => {
    const className = "w-full";
    if (!user) {
      return (
        <Link href={loginHref} className={buttonClasses({ className })}>
          Get {plan.name}
        </Link>
      );
    }
    if (!hasProducts) {
      return (
        <Link href={`/launch?plan=${plan.slug}`} className={buttonClasses({ className })}>
          Get {plan.name}
        </Link>
      );
    }
    return (
      <Button
        onClick={() => checkout.mutate(plan.slug)}
        loading={busy && checkout.variables === plan.slug}
        disabled={!productId || busy}
        className={className}
      >
        Get {plan.name}
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      {!user && (
        <Alert>Sign in to upgrade a launch — upgrades apply to products you&apos;ve launched with your account.</Alert>
      )}

      {user && hasProducts && products.data!.length > 1 && (
        <Panel className="p-6">
          <fieldset>
            <legend className="text-sm font-black uppercase tracking-widest text-dune-200">Which product?</legend>
            <div className="mt-4 space-y-2">
              {products.data!.map((product) => (
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
        </Panel>
      )}

      {user && hasProducts && products.data!.length === 1 && (
        <p className="text-sm text-dune-300">
          Upgrading <span className="font-bold text-white">{products.data![0].name}</span>
        </p>
      )}

      {checkout.isError && <Alert>{getErrorMessage(checkout.error, "Couldn't start checkout.")}</Alert>}

      <div className="grid gap-4 md:grid-cols-2">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} action={action(plan)} />
        ))}
      </div>

      <p className="text-center text-[11px] text-dune-500">Secure payment by Lemon Squeezy. One-time charge, no subscription.</p>
    </div>
  );
}
