/**
 * announcement-banner.tsx
 * The top sun-amber promotional strip shown on every page.
 */

import { RocketIcon } from "@/components/layout/nav-icons";

export function AnnouncementBanner() {
  return (
    <div className="bg-sun px-4 py-1.5 text-center text-xs font-semibold text-on-sun flex items-center justify-center gap-1.5 text-balance">
      <RocketIcon className="hidden h-3.5 w-3.5 shrink-0 sm:block" />
      <span>Launch free — permanent DR 53 dofollow backlink, verified in minutes.</span>
    </div>
  );
}
