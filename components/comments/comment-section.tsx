/**
 * comment-section.tsx
 * Product discussion: list, post (signed-in users) and delete own comments.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type FormEvent } from "react";

import { UserAvatar } from "@/components/auth/user-avatar";
import { Button } from "@/components/ui/button";
import { EmptyState, Panel } from "@/components/ui/panel";
import { useAuth } from "@/hooks/use-auth";
import { useComments } from "@/hooks/use-comments";
import { formatDate } from "@/lib/utils/format";
import { commentSchema } from "@/lib/validation/schemas";

const MAX_LENGTH = 1000;

export function CommentSection({ productId }: { productId: string }) {
  const { user, isReady } = useAuth();
  const pathname = usePathname();
  const { data: comments = [], isLoading, isError, add, remove } = useComments(productId);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = commentSchema.safeParse({ content });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError(null);
    add.mutate(parsed.data.content, { onSuccess: () => setContent("") });
  };

  return (
    <Panel className="p-6">
      <h2 className="text-sm font-black uppercase tracking-widest text-dune-200">
        Comments {comments.length > 0 && <span className="text-dune-600">({comments.length})</span>}
      </h2>

      {isReady && user ? (
        <form onSubmit={handleSubmit} className="mt-4" noValidate>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={MAX_LENGTH}
            rows={3}
            aria-label="Write a comment"
            placeholder="Share feedback or ask the maker a question…"
            className="w-full rounded-xl border border-dune-900 bg-dune-990 px-3.5 py-2.5 text-sm text-white placeholder:text-dune-700 outline-none focus:border-sun"
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className={`text-[11px] ${error ? "text-[#f87171]" : "text-dune-600"}`} role={error ? "alert" : undefined}>
              {error ?? `${content.length} / ${MAX_LENGTH}`}
            </span>
            <Button type="submit" size="sm" loading={add.isPending}>
              Post comment
            </Button>
          </div>
        </form>
      ) : (
        isReady && (
          <p className="mt-4 rounded-xl border border-dune-900 bg-dune-950 px-4 py-3 text-xs text-dune-400">
            <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="font-bold text-sun hover:underline">
              Sign in
            </Link>{" "}
            to join the discussion.
          </p>
        )
      )}

      <ul className="mt-5 space-y-4">
        {isLoading && <li className="text-xs text-dune-500">Loading comments…</li>}
        {isError && <li className="text-xs text-[#f87171]">Couldn&apos;t load comments.</li>}
        {!isLoading && !isError && comments.length === 0 && (
          <li>
            <EmptyState title="No comments yet">Be the first to say something nice.</EmptyState>
          </li>
        )}
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3">
            <UserAvatar user={comment.author} size={32} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 text-xs">
                <span className="font-bold text-white">{comment.author.name}</span>
                <span className="text-dune-600">{formatDate(comment.createdAt)}</span>
                {user?.id === comment.author.id && (
                  <button
                    type="button"
                    onClick={() => remove.mutate(comment.id)}
                    disabled={remove.isPending}
                    className="ml-auto text-[11px] font-semibold text-dune-500 hover:text-[#f87171] cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-line break-words text-sm text-dune-100">{comment.content}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
