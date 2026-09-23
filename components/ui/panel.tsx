/**
 * panel.tsx
 * The rounded dark card used for every content section, plus the
 * standard empty-state and alert blocks that live inside panels.
 */

import type { HTMLAttributes, ReactNode } from "react";

export function Panel({ className = "", children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={`rounded-[24px] border border-dune-850 bg-dune-940 shadow-lg ${className}`} {...props}>
      {children}
    </section>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-sm font-bold text-white">{title}</p>
      {children && <div className="mt-2 text-xs text-dune-400">{children}</div>}
    </div>
  );
}

export function Alert({ tone = "error", children }: { tone?: "error" | "success"; children: ReactNode }) {
  const styles =
    tone === "error" ? "border-[#5c2320] bg-[#2a1210] text-[#fca5a5]" : "border-dune-800 bg-dune-900 text-sun-bright";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-xs font-medium ${styles}`}>
      {children}
    </div>
  );
}
