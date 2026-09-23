/**
 * pagination.tsx
 * Previous / next links that keep the current filters in the URL.
 */

import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}

export function Pagination({ page, totalPages, params }: PaginationProps) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return qs ? `?${qs}` : "?";
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3 text-xs text-dune-400">
      {page > 1 ? (
        <Link href={href(page - 1)} className={buttonClasses({ variant: "secondary", size: "sm" })}>
          ← Previous
        </Link>
      ) : (
        <span className={buttonClasses({ variant: "secondary", size: "sm", className: "pointer-events-none opacity-40" })}>← Previous</span>
      )}
      <span>
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={buttonClasses({ variant: "secondary", size: "sm" })}>
          Next →
        </Link>
      ) : (
        <span className={buttonClasses({ variant: "secondary", size: "sm", className: "pointer-events-none opacity-40" })}>Next →</span>
      )}
    </nav>
  );
}
