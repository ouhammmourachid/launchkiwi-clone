"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { submitProduct } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";
import type { ProductSubmitInput } from "@/lib/validation/schemas";

export function useSubmitProduct() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ input, logo }: { input: ProductSubmitInput; logo: File | null }) => submitProduct(input, logo),
    onSuccess: (product) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.myProducts(user?.id) });
      toast(`🚀 ${product.name} is live!`);
      router.push(`/p/${product.slug}`);
    },
  });
}
