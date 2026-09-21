/**
 * right-sidebar.tsx
 * Right sidebar shown on the home page and browse page.
 * Data is imported from data/site.ts.
 */

import Link from "next/link";
import { rightSidebarProducts } from "@/data/site";
import { MegaphoneIcon } from "@/components/layout/nav-icons";

export function RightSidebar() {
  return (
    <aside className="hidden w-[210px] shrink-0 flex-col gap-3 xl:flex">
      {rightSidebarProducts.map((item) =>
        item.isAd ? (
          <Link
            key="ad-slot"
            href="/advertise"
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2d3522] bg-[#141810] p-4 text-center transition hover:border-[#86ba28]"
          >
            <MegaphoneIcon />
            <span className="mt-1.5 text-xs font-bold text-white">Advertise</span>
            <span className="text-[10px] text-[#828c74]">Book this slot</span>
          </Link>
        ) : (
          <div
            key={item.name}
            className="rounded-2xl border border-[#22271a] bg-[#141810] p-3.5 transition hover:border-[#343c28]"
          >
            <div className="flex items-start gap-2.5">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} text-sm text-white`}>
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white leading-tight truncate">{item.name}</h4>
                <p className="mt-1 text-[11px] leading-snug text-[#828c74] line-clamp-2">{item.blurb}</p>
              </div>
            </div>
          </div>
        )
      )}
    </aside>
  );
}
