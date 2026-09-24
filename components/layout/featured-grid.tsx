/**
 * featured-grid.tsx
 * The sidebars' featured products for screens too narrow for sidebars (< xl):
 * a 2-up (3-up on tablets) grid of the same cards, topped up with an ad slot.
 */

import { SidebarAdvertiseSlot, SidebarProductCard } from "@/components/layout/sidebar-product-card";
import { getFeaturedProducts } from "@/lib/api/products";

// 6 fills whole rows at both 2 and 3 columns.
const GRID_SLOTS = 6;
const MAX_PRODUCTS = GRID_SLOTS - 1; // always leave room to advertise

export async function FeaturedGrid() {
  const products = await getFeaturedProducts(MAX_PRODUCTS).catch(() => []);
  if (products.length === 0) return null;

  return (
    <section aria-label="Featured products" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:hidden">
      {products.map((product, i) => (
        <SidebarProductCard key={product.id} product={product} index={i} />
      ))}
      {Array.from({ length: GRID_SLOTS - products.length }, (_, i) => (
        <SidebarAdvertiseSlot key={i} index={products.length + i} />
      ))}
    </section>
  );
}
