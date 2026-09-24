/**
 * account-ui.tsx
 * Small pieces shared by the account dashboard and the launch editor:
 * section headings, empty states and the launch status pill.
 */

import type { ReactNode } from "react";

import type { MyLaunch } from "@/lib/types/models";
import { formatDate } from "@/lib/utils/format";

/** Same heading rhythm as the home page launch sections. */
export function SectionHeading({ id, title, meta, dot = "bg-sun" }: { id: string; title: string; meta?: string; dot?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-dune-900 pb-2">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden />
        <h2 id={id} className="font-display text-lg font-extrabold text-white">
          {title}
        </h2>
      </div>
      {meta && <span className="font-mono text-[11px] tabular-nums text-dune-500">{meta}</span>}
    </div>
  );
}

export function EmptyList({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dune-900 bg-dune-970 px-6 py-12 text-center">
      <p className="text-sm font-semibold text-dune-400">{title}</p>
      {children && <div className="mt-2 text-xs text-dune-400">{children}</div>}
    </div>
  );
}

// Launch status

type Tone = "live" | "attention" | "neutral" | "danger";

const TONES: Record<Tone, string> = {
  live: "border-sun/40 bg-sun/10 text-sun",
  attention: "border-sun/30 bg-transparent text-sun-bright",
  neutral: "border-dune-850 bg-dune-925 text-dune-300",
  danger: "border-[#5c2320] bg-[#2a1210] text-[#fca5a5] light:border-[#f5c2bd] light:bg-[#fdecea] light:text-[#b42318]",
};

export function launchStatus(launch: MyLaunch): { label: string; tone: Tone } {
  const date = launch.launchDate ? formatDate(launch.launchDate) : "";
  const upcoming = !!launch.launchDate && new Date(launch.launchDate.replace(" ", "T")) > new Date();

  if (launch.needsBadge) return { label: "Awaiting badge", tone: "attention" };
  switch (launch.status) {
    case "published":
      return upcoming ? { label: `Launches ${date}`, tone: "neutral" } : { label: "Live", tone: "live" };
    case "pending":
      return date ? { label: `Queued · ${date}`, tone: "neutral" } : { label: "In review", tone: "neutral" };
    case "draft":
      return { label: "Draft", tone: "neutral" };
    case "rejected":
      return { label: "Rejected", tone: "danger" };
    case "suspended":
      return { label: "Suspended", tone: "danger" };
    case "archived":
      return { label: "Archived", tone: "neutral" };
  }
}

export function StatusPill({ launch }: { launch: MyLaunch }) {
  const status = launchStatus(launch);
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${TONES[status.tone]}`}>{status.label}</span>
  );
}
