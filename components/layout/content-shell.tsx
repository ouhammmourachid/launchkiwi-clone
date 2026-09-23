/**
 * content-shell.tsx
 * Wraps page content with optional left and right sidebars.
 * Pages opt in with `withSidebars` (home and browse do).
 */

import type { ReactNode } from "react";

import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";

interface ContentShellProps {
  children: ReactNode;
  withSidebars?: boolean;
}

export function ContentShell({ children, withSidebars = false }: ContentShellProps) {
  return (
    <div className="mx-auto flex max-w-[1480px] items-start justify-center gap-6 px-4 py-5">
      {withSidebars && <LeftSidebar />}
      <div className={`w-full min-w-0 flex-1 ${withSidebars ? "max-w-[920px]" : "max-w-[900px] mx-auto"}`}>{children}</div>
      {withSidebars && <RightSidebar />}
    </div>
  );
}
