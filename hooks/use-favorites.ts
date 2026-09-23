"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth, useRequireAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { addFavorite, listFavoriteProducts, removeFavorite } from "@/lib/api/engagement";
import { getErrorMessage } from "@/lib/pb/errors";
import { queryKeys } from "@/lib/query-keys";

/** The signed-in user's saved products. */
export function useFavoriteProducts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.favorites(user?.id),
    queryFn: () => listFavoriteProducts(user!.id),
    enabled: !!user,
    staleTime: 60 * 1000,
  });
}

export function useFavorite(productId: string) {
  const { user } = useAuth();
  const requireAuth = useRequireAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: favorites } = useFavoriteProducts();

  const mutation = useMutation({
    mutationFn: ({ save, userId }: { save: boolean; userId: string }) =>
      save ? addFavorite(productId, userId) : removeFavorite(productId, userId),
    onSuccess: (_data, { save }) => toast(save ? "Saved to your favorites." : "Removed from favorites."),
    onError: (err) => toast(getErrorMessage(err, "Couldn't update favorites."), "error"),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.favorites(user?.id) }),
  });

  const saved = favorites?.some((p) => p.id === productId) ?? false;
  // Show the pending value immediately (optimistic UI without cache surgery).
  const isSaved = mutation.isPending ? mutation.variables.save : saved;

  const toggle = () => {
    if (!requireAuth() || !user || mutation.isPending) return;
    mutation.mutate({ save: !saved, userId: user.id });
  };

  return { isSaved, toggle, isPending: mutation.isPending };
}
