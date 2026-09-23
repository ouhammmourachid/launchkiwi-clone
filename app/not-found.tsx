import Link from "next/link";

import { ContentShell } from "@/components/layout/content-shell";
import { buttonClasses } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function NotFound() {
  return (
    <ContentShell>
      <Panel className="px-6 py-16 text-center">
        <p className="text-5xl">🥝</p>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-white">Page not found</h1>
        <p className="mt-2 text-sm text-[#9aa48c]">This launch may have been removed, or the link is wrong.</p>
        <Link href="/browse" className={buttonClasses({ className: "mt-6" })}>
          Browse products
        </Link>
      </Panel>
    </ContentShell>
  );
}
