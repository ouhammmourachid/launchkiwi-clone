/**
 * launch-section.tsx
 * A home page launch section: dot + title header, a divided list of ProductRows,
 * and a "View more" pill that reveals the next launches in place.
 */

"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { ChevronDownIcon } from "@/components/layout/nav-icons";
import { ProductRow } from "@/components/products/product-row";
import { listLaunchSection, type LaunchSection as Section } from "@/lib/api/products";
import type { Paginated, ProductSummary } from "@/lib/types/models";

// Server-rendered sections hold 10 rows; each click adds 5. Keep the initial
// size a multiple of PAGE_SIZE so page offsets line up.
const PAGE_SIZE = 5;

const DOTS = {
  live: "bg-sun animate-pulse",
  recent: "bg-sun opacity-65",
  past: "bg-dune-600",
} as const;

interface LaunchSectionProps {
  section: Section;
  title: string;
  subtitle: string;
  dot: keyof typeof DOTS;
  initial: Paginated<ProductSummary>;
  moreLabel: string;
  emptyTitle: string;
  emptyContent?: ReactNode;
  /** Shown once the section has nothing more to reveal. */
  exhaustedLink?: { href: string; label: string };
}

export function LaunchSection({
  section,
  title,
  subtitle,
  dot,
  initial,
  moreLabel,
  emptyTitle,
  emptyContent,
  exhaustedLink,
}: LaunchSectionProps) {
  const [products, setProducts] = useState(initial.items);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasMore = products.length < initial.totalItems;

  const loadMore = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const next = await listLaunchSection(section, Math.floor(products.length / PAGE_SIZE) + 1, PAGE_SIZE);
      setProducts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...next.items.filter((p) => !seen.has(p.id))];
      });
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const pill =
    "inline-flex items-center gap-1.5 rounded-full border border-dune-850 bg-dune-940 px-4 py-2 text-xs font-semibold text-dune-300 transition-colors hover:bg-sun/10 hover:text-sun";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-dune-900 pb-2">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${DOTS[dot]}`} />
          <h2 className="font-display text-lg font-extrabold text-white">{title}</h2>
        </div>
        <span className="font-mono text-[11px] text-dune-500">{subtitle}</span>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dune-900 bg-dune-970 px-6 py-12 text-center">
          <p className="text-sm font-semibold text-dune-400">{emptyTitle}</p>
          {emptyContent && <div className="mt-2 text-xs text-dune-400">{emptyContent}</div>}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="divide-y divide-dune-900 overflow-hidden rounded-2xl border border-dune-900 bg-dune-970">
            {products.map((product, index) => (
              <ProductRow key={product.id} product={product} index={index} />
            ))}
          </div>

          {hasMore ? (
            <div className="pt-2 text-center">
              <button type="button" onClick={loadMore} disabled={loading} className={`${pill} cursor-pointer disabled:cursor-wait disabled:opacity-60`}>
                {loading ? "Loading…" : failed ? "Couldn't load — try again" : moreLabel}
                {!loading && <ChevronDownIcon />}
              </button>
            </div>
          ) : (
            exhaustedLink && (
              <div className="pt-2 text-center">
                <Link href={exhaustedLink.href} className={pill}>
                  {exhaustedLink.label} →
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}
