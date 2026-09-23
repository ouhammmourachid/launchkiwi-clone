/**
 * upvote-button.tsx
 * Toggleable upvote with optimistic count. Signed-out users are sent to /login.
 */

"use client";

import { useUpvote } from "@/hooks/use-upvote";

interface UpvoteButtonProps {
  productId: string;
  productName: string;
  upvotes: number;
  size?: "md" | "lg";
}

export function UpvoteButton({ productId, productName, upvotes, size = "md" }: UpvoteButtonProps) {
  const { count, voted, toggle, isPending } = useUpvote(productId, upvotes);

  const dims = size === "lg" ? "h-14 min-w-[64px] px-4 text-base" : "h-10 min-w-[42px] px-2.5 text-xs";
  const state = voted
    ? "border-[#86ba28] bg-[#86ba28] text-[#0a0d06]"
    : "border-[#2b3120] bg-[#161a10] text-white hover:border-[#86ba28] hover:text-[#86ba28]";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={voted}
      aria-label={`${voted ? "Remove upvote from" : "Upvote"} ${productName} (${count} upvotes)`}
      className={`flex flex-col items-center justify-center rounded-xl border font-bold transition cursor-pointer disabled:cursor-wait ${dims} ${state}`}
    >
      <span className="text-[10px] leading-none">▲</span>
      <span className="leading-tight tabular-nums">{count}</span>
    </button>
  );
}
