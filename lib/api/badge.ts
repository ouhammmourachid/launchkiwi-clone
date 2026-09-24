/**
 * Launch badge verification. Free launches stay hidden until the maker embeds
 * our badge on their homepage; PocketBase (pb_hooks/badge.pb.js) fetches the
 * site, and on success publishes the launch with a dofollow link.
 */

import { getPB } from "@/lib/pb/client";

export type BadgeCheckResult =
  | { verified: true; status: string; launchDate: string }
  | { verified: false; reason: string };

export interface BadgeInfo {
  token: string;
  verified: boolean;
  verifiedAt: string;
}

/** The launch's badge token (a hidden field only its maker can read). */
export function getBadgeInfo(productId: string): Promise<BadgeInfo> {
  return getPB().send<BadgeInfo>(`/api/products/${encodeURIComponent(productId)}/badge`, { method: "GET" });
}

export function verifyBadge(productId: string): Promise<BadgeCheckResult> {
  return getPB().send<BadgeCheckResult>(`/api/products/${encodeURIComponent(productId)}/verify-badge`, { method: "POST" });
}

/** HTML the maker pastes on their site. The token lets us match it even behind another domain. */
export function badgeSnippet(origin: string, slug: string, token: string): string {
  return (
    `<a href="${origin}/p/${slug}?ref=badge" target="_blank" data-launch-badge="${token}">` +
    `<img src="${origin}/badge.svg" alt="Featured on LaunchDunes" width="236" height="60" /></a>`
  );
}
