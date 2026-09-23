/**
 * right-sidebar.tsx
 * Featured products, second half, then open ad slots.
 * Sticky under the header so it stays visible while the page scrolls.
 */

import { SIDEBAR_AD_SLOTS, SIDEBAR_PRODUCTS } from "@/components/layout/left-sidebar";
import { SidebarAdvertiseSlot, SidebarProductCard } from "@/components/layout/sidebar-product-card";
import { getFeaturedProducts } from "@/lib/api/products";

export async function RightSidebar() {
  const products = await getFeaturedProducts(SIDEBAR_PRODUCTS, SIDEBAR_PRODUCTS).catch(() => []);

  return (
    <aside className="sticky top-20 hidden w-60 shrink-0 flex-col gap-3 xl:flex" aria-label="More featured products">
      {products.map((product, i) => (
        <SidebarProductCard key={product.id} product={product} index={i} />
      ))}
      {Array.from({ length: SIDEBAR_AD_SLOTS }, (_, i) => (
        <SidebarAdvertiseSlot key={i} index={products.length + i} />
      ))}
    </aside>
  );
}
