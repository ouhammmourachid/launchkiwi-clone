/**
 * favorite-button.tsx
 * Save / unsave a product to the signed-in user's favorites.
 */

"use client";

import { useFavorite } from "@/hooks/use-favorites";

export function FavoriteButton({ productId }: { productId: string }) {
  const { isSaved, toggle, isPending } = useFavorite(productId);

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={isSaved}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition cursor-pointer disabled:cursor-wait ${
        isSaved
          ? "border-[#ca8a04] bg-[#282310] text-[#eab308] light:bg-[#fdf3d0] light:text-[#a16207]"
          : "border-dune-850 bg-dune-925 text-dune-100 hover:border-dune-750 hover:text-white"
      }`}
    >
      <span aria-hidden>{isSaved ? "★" : "☆"}</span>
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
