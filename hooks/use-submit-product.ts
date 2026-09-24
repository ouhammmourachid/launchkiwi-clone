"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { createCheckout } from "@/lib/api/checkout";
import { submitProduct } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";
import type { ProductSubmitInput } from "@/lib/validation/schemas";

export interface LaunchRequest {
  input: ProductSubmitInput;
  files: { logo: File; screenshot: File };
  categorySlugs: string[];
  tagIdsBySlug: Record<string, string>;
  /** Paid plan slug, or null for the free queue. */
  paidPlan: string | null;
  /** "YYYY-MM-DD" chosen for a paid launch. */
  launchDate: string;
}

/**
 * Creates the product (hidden until its badge is verified), then — for a paid tier —
 * hands off to the Lemon Squeezy checkout, whose webhook applies the plan.
 */
export function useSubmitProduct() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: LaunchRequest) => {
      const product = await submitProduct(req.input, req.files, req.categorySlugs, req.tagIdsBySlug);
      void queryClient.invalidateQueries({ queryKey: queryKeys.myProducts(user?.id) });
      if (!req.paidPlan) return { product, checkoutUrl: null };
      try {
        return { product, checkoutUrl: await createCheckout(req.paidPlan, product.id, req.launchDate) };
      } catch (err) {
        // The launch exists (a hidden free launch) — let the maker pay from /upgrade later.
        toast(`${product.name} is saved as a free launch. Verify the badge or upgrade it from your account.`);
        router.push(`/upgrade?plan=${req.paidPlan}&product=${product.id}`);
        throw err;
      }
    },
    onSuccess: ({ product, checkoutUrl }) => {
      if (checkoutUrl) {
        window.location.assign(checkoutUrl);
        return;
      }
      toast(`🚀 ${product.name} is submitted! Add the badge to your site to go live.`);
      router.push("/account");
    },
  });
}
