/**
 * Sidebar spotlight ads. Booking, rotation and click tracking live in
 * PocketBase (pb_hooks/ads.pb.js); payment goes through Lemon Squeezy.
 */

import { cache } from "react";

import { getPB } from "@/lib/pb/client";
import type { AdPlan, SpotlightAd } from "@/lib/types/models";
import type { PublicAdRecord } from "@/lib/types/records";
import { displayHost } from "@/lib/utils/format";

export async function listAdPlans(): Promise<AdPlan[]> {
  const items = await getPB().collection("ad_plans").getFullList({ filter: "active = true", sort: "duration_days" });
  const perDay = (p: { price: number; duration_days: number }) => p.price / Math.max(p.duration_days, 1);
  const cheapest = Math.min(...items.map(perDay));
  return items.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    currency: p.currency || "USD",
    durationDays: p.duration_days,
    perDay: Math.round(perDay(p) * 100) / 100,
    description: p.description.replace(/<[^>]*>/g, ""),
    features: p.features ?? [],
    bestValue: items.length > 1 && perDay(p) === cheapest,
  }));
}

function toSpotlightAd(record: PublicAdRecord): SpotlightAd {
  const pb = getPB();
  return {
    id: record.id,
    name: record.product_name,
    tagline: record.tagline,
    host: displayHost(record.website_url),
    logoUrl: record.logo ? pb.files.getURL(record, record.logo) : null,
    clickUrl: pb.buildURL(`/api/ads/${record.id}/click`),
  };
}

/** Sidebar spotlight slots filled by paid ads (2 per sidebar). */
export const SPOTLIGHT_SLOTS = 4;

/**
 * Up to SPOTLIGHT_SLOTS different live ads in random order (counts impressions).
 * Cached per request, so both sidebars and the mobile grid share one draw and
 * never show the same ad twice.
 */
export const getSpotlightAds = cache(async (): Promise<SpotlightAd[]> => {
  try {
    const { items } = await getPB().send<{ items: PublicAdRecord[] }>("/api/ads/spotlight", {
      query: { limit: SPOTLIGHT_SLOTS },
      cache: "no-store",
    });
    return items.map(toSpotlightAd);
  } catch {
    return [];
  }
});

/** Advertisers recently in the rotation (live or finished), newest first. */
export async function listRecentSpotlights(): Promise<SpotlightAd[]> {
  const { items } = await getPB().send<{ items: PublicAdRecord[] }>("/api/ads/recent", { cache: "no-store" });
  return items.map(toSpotlightAd);
}

export interface AdBooking {
  plan: string;
  productName: string;
  websiteUrl: string;
  tagline: string;
  email: string;
  logo: File;
}

/** Creates the booking and returns the hosted Lemon Squeezy checkout URL. */
export async function createAdCheckout(booking: AdBooking): Promise<string> {
  const body = new FormData();
  body.set("plan", booking.plan);
  body.set("product_name", booking.productName);
  body.set("website_url", booking.websiteUrl);
  body.set("tagline", booking.tagline);
  body.set("email", booking.email);
  body.set("logo", booking.logo);
  const { url } = await getPB().send<{ url: string }>("/api/ads/checkout", { method: "POST", body });
  return url;
}
