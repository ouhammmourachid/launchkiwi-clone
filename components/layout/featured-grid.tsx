/**
 * featured-grid.tsx
 * The sidebars' featured products for screens too narrow for sidebars (< xl):
 * a 2-up (3-up on tablets) grid of the same cards, topped up with spotlight
 * ads or an open ad slot.
 */

import { SidebarAdCard, SidebarAdvertiseSlot, SidebarProductCard } from "@/components/layout/sidebar-product-card";
import { getSpotlightAds } from "@/lib/api/ads";
import { getFeaturedProducts } from "@/lib/api/products";

// 6 fills whole rows at both 2 and 3 columns.
const GRID_SLOTS = 6;
const MAX_PRODUCTS = GRID_SLOTS - 1; // always leave room to advertise

export async function FeaturedGrid() {
  const [products, ads] = await Promise.all([getFeaturedProducts(MAX_PRODUCTS).catch(() => []), getSpotlightAds()]);
  if (products.length === 0 && ads.length === 0) return null;

  return (
    <section aria-label="Featured products" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:hidden">
      {products.map((product, i) => (
        <SidebarProductCard key={product.id} product={product} index={i} />
      ))}
      {Array.from({ length: GRID_SLOTS - products.length }, (_, i) => {
        const ad = ads[i];
        const index = products.length + i;
        return ad ? <SidebarAdCard key={ad.id} ad={ad} index={index} /> : <SidebarAdvertiseSlot key={`slot-${i}`} index={index} />;
      })}
    </section>
  );
}
