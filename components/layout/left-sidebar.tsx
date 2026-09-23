/**
 * left-sidebar.tsx
 * Featured (paid placement) products, first half, then open ad slots.
 * Sticky under the header so it stays visible while the page scrolls.
 */

import { SidebarAdvertiseSlot, SidebarProductCard } from "@/components/layout/sidebar-product-card";
import { getFeaturedProducts } from "@/lib/api/products";

export const SIDEBAR_PRODUCTS = 3;
export const SIDEBAR_AD_SLOTS = 2;

export async function LeftSidebar() {
  const products = await getFeaturedProducts(SIDEBAR_PRODUCTS).catch(() => []);

  return (
    <aside className="sticky top-20 hidden w-48 shrink-0 flex-col gap-3 xl:flex" aria-label="Featured products">
      {products.map((product, i) => (
        <SidebarProductCard key={product.id} product={product} index={i} />
      ))}
      {Array.from({ length: SIDEBAR_AD_SLOTS }, (_, i) => (
        <SidebarAdvertiseSlot key={i} index={products.length + i} />
      ))}
    </aside>
  );
}
