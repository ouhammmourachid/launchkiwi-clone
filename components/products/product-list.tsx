/**
 * product-list.tsx
 * A full section card: green-dot header + list of ProductRows.
 * Used on the home, browse and account pages.
 */

import type { ReactNode } from "react";

import { ProductRow } from "@/components/products/product-row";
import { EmptyState, Panel } from "@/components/ui/panel";
import { SectionHeader } from "@/components/ui/section-header";
import type { ProductSummary } from "@/lib/types/models";

interface ProductListProps {
  title?: string;
  subtitle?: string;
  products: ProductSummary[];
  emptyTitle?: string;
  emptyContent?: ReactNode;
  /** Rank offset for paginated lists (page 2 starts at 21). */
  startIndex?: number;
  showRank?: boolean;
}

export function ProductList({
  title,
  subtitle = "",
  products,
  emptyTitle = "No launches yet",
  emptyContent,
  startIndex = 0,
  showRank = true,
}: ProductListProps) {
  return (
    <Panel className="overflow-hidden shadow-none">
      {title && <SectionHeader title={title} subtitle={subtitle} />}
      <div className="p-1">
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductRow key={product.id} product={product} index={startIndex + index} showRank={showRank} />
          ))
        ) : (
          <EmptyState title={emptyTitle}>{emptyContent}</EmptyState>
        )}
      </div>
    </Panel>
  );
}
