/**
 * panel.tsx
 * The rounded dark card used for every content section, plus the
 * standard empty-state and alert blocks that live inside panels.
 */

import type { HTMLAttributes, ReactNode } from "react";

export function Panel({ className = "", children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`rounded-[24px] border border-[#22271a] bg-[#13160e] shadow-lg ${className}`} {...props}>
      {children}
    </section>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-sm font-bold text-white">{title}</p>
      {children && <div className="mt-2 text-xs text-[#8c967d]">{children}</div>}
    </div>
  );
}

export function Alert({ tone = "error", children }: { tone?: "error" | "success"; children: ReactNode }) {
  const styles =
    tone === "error" ? "border-[#5c2320] bg-[#2a1210] text-[#fca5a5]" : "border-[#2b3120] bg-[#1a1e13] text-[#c5e38a]";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-xs font-medium ${styles}`}>
      {children}
    </div>
  );
}
