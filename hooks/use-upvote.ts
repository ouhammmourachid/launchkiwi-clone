"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth, useRequireAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { addVote, listVotedProductIds, removeVote } from "@/lib/api/engagement";
import { getUpvoteCount } from "@/lib/api/products";
import { getErrorMessage } from "@/lib/pb/errors";
import { queryKeys } from "@/lib/query-keys";

/** The signed-in user's voted product ids — one request shared by every button. */
function useVotedIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: queryKeys.votes(user?.id),
    queryFn: () => listVotedProductIds(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Upvote state for one product. `serverCount` comes from the server render;
 * once the user votes, the fresh count lives in the query cache so every
 * button showing this product stays in sync.
 */
export function useUpvote(productId: string, serverCount: number) {
  const { user } = useAuth();
  const requireAuth = useRequireAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const votesKey = queryKeys.votes(user?.id);
  const countKey = queryKeys.upvoteCount(productId);

  const { data: votedIds } = useVotedIds();
  const { data: cachedCount } = useQuery({
    queryKey: countKey,
    queryFn: () => getUpvoteCount(productId),
    enabled: false, // only ever populated by the mutation below
  });

  const mutation = useMutation({
    mutationFn: ({ vote, userId }: { vote: boolean; userId: string }) =>
      vote ? addVote(productId, userId) : removeVote(productId, userId),
    onMutate: async ({ vote }) => {
      await queryClient.cancelQueries({ queryKey: votesKey });
      const previousIds = queryClient.getQueryData<string[]>(votesKey) ?? [];
      const previousCount = queryClient.getQueryData<number>(countKey) ?? serverCount;
      queryClient.setQueryData<string[]>(votesKey, vote ? [...previousIds, productId] : previousIds.filter((id) => id !== productId));
      queryClient.setQueryData<number>(countKey, Math.max(previousCount + (vote ? 1 : -1), 0));
      return { previousIds, previousCount };
    },
    onError: (err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(votesKey, context.previousIds);
        queryClient.setQueryData(countKey, context.previousCount);
      }
      toast(getErrorMessage(err, "Couldn't save your vote."), "error");
    },
    onSettled: async () => {
      try {
        queryClient.setQueryData(countKey, await getUpvoteCount(productId));
      } finally {
        void queryClient.invalidateQueries({ queryKey: votesKey });
      }
    },
  });

  const voted = votedIds?.includes(productId) ?? false;

  const toggle = () => {
    if (!requireAuth() || !user || mutation.isPending) return;
    mutation.mutate({ vote: !voted, userId: user.id });
  };

  return { count: cachedCount ?? serverCount, voted, toggle, isPending: mutation.isPending };
}
