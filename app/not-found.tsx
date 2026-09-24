import Link from "next/link";

import { ContentShell } from "@/components/layout/content-shell";
import { DunesMark } from "@/components/layout/nav-icons";
import { buttonClasses } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function NotFound() {
  return (
    <ContentShell>
      <Panel className="px-6 py-16 text-center">
        <DunesMark className="mx-auto h-14 w-14" />
        <h1 className="mt-4 text-2xl font-black tracking-tight text-white">Page not found</h1>
        <p className="mt-2 text-sm text-dune-300">This launch may have been removed, or the link is wrong.</p>
        <Link href="/browse" className={buttonClasses({ className: "mt-6" })}>
          Browse products
        </Link>
      </Panel>
    </ContentShell>
  );
}
