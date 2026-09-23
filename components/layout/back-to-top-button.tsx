/**
 * back-to-top-button.tsx
 * Small client island so the footer can stay a Server Component.
 */

"use client";

import { ArrowUpIcon } from "@/components/layout/nav-icons";

export function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="ml-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#22271a] bg-[#141810] text-[#9aa48c] transition hover:bg-[#1a2015] hover:text-white cursor-pointer"
    >
      <ArrowUpIcon />
    </button>
  );
}
