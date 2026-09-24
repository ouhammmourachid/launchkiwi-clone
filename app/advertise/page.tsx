/**
 * app/advertise/page.tsx — Book a sidebar spotlight ad.
 * Plans, the rotation chips and the product count come from PocketBase;
 * /advertise?booked=1 is where Lemon Squeezy sends buyers after paying.
 */

import type { Metadata } from "next";
import { connection } from "next/server";

import { AdvertiseContent } from "@/components/advertise/advertise-content";
import { ContentShell } from "@/components/layout/content-shell";
import { listAdPlans, listRecentSpotlights } from "@/lib/api/ads";
import { getSiteStats } from "@/lib/api/catalog";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Put your product in the LaunchDunes sidebar spotlight.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdvertisePage({ searchParams }: { searchParams: SearchParams }) {
  await connection();
  const { booked } = await searchParams;
  const [plans, recent, stats] = await Promise.all([
    listAdPlans(),
    listRecentSpotlights().catch(() => []),
    getSiteStats().catch(() => null),
  ]);

  return (
    <ContentShell>
      <AdvertiseContent plans={plans} recent={recent} productsListed={stats?.products ?? null} booked={booked === "1"} />
    </ContentShell>
  );
}
