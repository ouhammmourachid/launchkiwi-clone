/**
 * card-title.tsx
 * Small uppercase card heading with a sun accent bar, used on product detail cards.
 */

import type { ReactNode } from "react";

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white">
      <span className="h-4 w-[3px] shrink-0 rounded-full bg-sun" aria-hidden />
      {children}
    </h2>
  );
}
