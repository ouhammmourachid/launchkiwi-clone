/**
 * right-sidebar.tsx
 * Featured products, second half, then spotlight ads
 * (open "Advertise" slots when fewer ads are live).
 * Sticky under the header so it stays visible while the page scrolls.
 */

import { SIDEBAR_AD_SLOTS, SIDEBAR_PRODUCTS } from "@/components/layout/left-sidebar";
import { SidebarAdCard, SidebarAdvertiseSlot, SidebarProductCard } from "@/components/layout/sidebar-product-card";
import { getSpotlightAds } from "@/lib/api/ads";
import { getFeaturedProducts } from "@/lib/api/products";

export async function RightSidebar() {
  const [products, allAds] = await Promise.all([
    getFeaturedProducts(SIDEBAR_PRODUCTS, SIDEBAR_PRODUCTS).catch(() => []),
    getSpotlightAds(),
  ]);
  const ads = allAds.slice(SIDEBAR_AD_SLOTS);

  return (
    <aside className="sticky top-20 hidden w-60 shrink-0 flex-col gap-3 xl:flex" aria-label="More featured products">
      {products.map((product, i) => (
        <SidebarProductCard key={product.id} product={product} index={i} />
      ))}
      {Array.from({ length: SIDEBAR_AD_SLOTS }, (_, i) => {
        const ad = ads[i];
        const index = products.length + i;
        return ad ? <SidebarAdCard key={ad.id} ad={ad} index={index} /> : <SidebarAdvertiseSlot key={`slot-${i}`} index={index} />;
      })}
    </aside>
  );
}
