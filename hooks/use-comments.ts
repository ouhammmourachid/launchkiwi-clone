"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { addComment, deleteComment, listComments } from "@/lib/api/engagement";
import { getErrorMessage } from "@/lib/pb/errors";
import { queryKeys } from "@/lib/query-keys";
import type { Comment } from "@/lib/types/models";

export function useComments(productId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const key = queryKeys.comments(productId);

  const query = useQuery({ queryKey: key, queryFn: () => listComments(productId) });

  const add = useMutation({
    mutationFn: (content: string) => addComment(productId, user!.id, content),
    onSuccess: (comment) => queryClient.setQueryData<Comment[]>(key, (current = []) => [comment, ...current]),
    onError: (err) => toast(getErrorMessage(err, "Couldn't post your comment."), "error"),
  });

  const remove = useMutation({
    mutationFn: deleteComment,
    onSuccess: (_data, id) => queryClient.setQueryData<Comment[]>(key, (current = []) => current.filter((c) => c.id !== id)),
    onError: (err) => toast(getErrorMessage(err, "Couldn't delete the comment."), "error"),
  });

  return { ...query, add, remove };
}
