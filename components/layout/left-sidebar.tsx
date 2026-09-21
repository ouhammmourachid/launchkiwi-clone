/**
 * left-sidebar.tsx
 * Left sidebar shown on the home page and browse page.
 * Data is imported from data/site.ts.
 */

import { leftSidebarProducts } from "@/data/site";
import { ProductIcon } from "@/components/ui/product-icon";

export function LeftSidebar() {
  return (
    <aside className="hidden w-[210px] shrink-0 flex-col gap-3 xl:flex">
      {leftSidebarProducts.map((item) => (
        <div
          key={item.name}
          className="rounded-2xl border border-[#22271a] bg-[#141810] p-3.5 transition hover:border-[#343c28]"
        >
          <div className="flex items-start gap-2.5">
            {/* Use the shared ProductIcon with size="sm" for sidebars */}
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} text-sm`}>
              {item.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white leading-tight truncate">{item.name}</h4>
              <p className="mt-1 text-[11px] leading-snug text-[#828c74] line-clamp-2">{item.blurb}</p>
            </div>
          </div>
        </div>
      ))}
    </aside>
  );
}
