/**
 * product-list.tsx
 * A full section card: green-dot header + list of ProductRows.
 * Used on the home page and browse page.
 */

import type { Product } from "@/data/site";
import { SectionHeader } from "@/components/ui/section-header";
import { ProductRow } from "@/components/products/product-row";

interface ProductListProps {
  title: string;
  subtitle: string;
  products: Product[];
}

export function ProductList({ title, subtitle, products }: ProductListProps) {
  return (
    <section className="rounded-[24px] border border-[#22271a] bg-[#13160e] overflow-hidden">
      <SectionHeader title={title} subtitle={subtitle} />
      <div className="p-1">
        {products.map((product, index) => (
          <ProductRow key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
