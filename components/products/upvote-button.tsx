/**
 * upvote-button.tsx
 * Toggleable upvote with optimistic count. Works signed out too: guest votes
 * are tied to this browser.
 */

"use client";

import { ChevronUpIcon } from "@/components/layout/nav-icons";
import { useUpvote } from "@/hooks/use-upvote";

interface UpvoteButtonProps {
  productId: string;
  productName: string;
  upvotes: number;
  size?: "md" | "lg";
}

export function UpvoteButton({ productId, productName, upvotes, size = "md" }: UpvoteButtonProps) {
  const { count, voted, toggle, isPending } = useUpvote(productId, upvotes);

  const dims = size === "lg" ? "h-14 min-w-[64px] rounded-xl px-4 text-base" : "h-11 min-w-11 rounded-lg px-1.5 text-[11px]";
  const state = voted
    ? "border-sun bg-sun text-on-sun"
    : "border-dune-800 bg-dune-925 text-white hover:border-sun hover:text-sun";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={voted}
      aria-label={`${voted ? "Remove upvote from" : "Upvote"} ${productName} (${count} upvotes)`}
      className={`flex shrink-0 flex-col items-center justify-center border font-bold transition cursor-pointer disabled:cursor-wait ${dims} ${state}`}
    >
      <ChevronUpIcon className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      <span className="leading-none tabular-nums">{count}</span>
    </button>
  );
}
