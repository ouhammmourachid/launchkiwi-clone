/**
 * content-shell.tsx
 * Wraps page content with optional left and right sidebars.
 * Sidebars are only shown on "/" and "/browse".
 */

"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";

interface ContentShellProps {
  children: ReactNode;
}

export function ContentShell({ children }: ContentShellProps) {
  const pathname = usePathname();
  const showSidebars = pathname === "/" || pathname === "/browse";

  return (
    <div className="mx-auto flex max-w-[1480px] items-start justify-center gap-4 px-4 py-5">
      {showSidebars && <LeftSidebar />}
      <div className={`w-full flex-1 ${showSidebars ? "max-w-[920px]" : "max-w-[900px] mx-auto"}`}>
        {children}
      </div>
      {showSidebars && <RightSidebar />}
    </div>
  );
}
