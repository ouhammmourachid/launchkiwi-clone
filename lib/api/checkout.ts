/**
 * Paid listing upgrades. Payments live entirely in PocketBase
 * (pb_hooks/payments.pb.js): it creates the Lemon Squeezy checkout, holds the
 * keys and fulfils orders from the webhook. The frontend only asks for a
 * checkout URL and redirects to it.
 */

import { getPB } from "@/lib/pb/client";

/**
 * Returns the hosted Lemon Squeezy checkout URL for upgrading `productId` to
 * `planSlug`. `launchDate` ("YYYY-MM-DD") schedules a still-queued launch.
 */
export async function createCheckout(planSlug: string, productId: string, launchDate?: string): Promise<string> {
  const { url } = await getPB().send<{ url: string }>("/api/checkout", {
    method: "POST",
    body: { plan: planSlug, product: productId, launch_date: launchDate ?? "" },
  });
  return url;
}
