import PocketBase from "pocketbase";

import type { TypedPocketBase } from "@/lib/types/records";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL;

function createClient(): TypedPocketBase {
  if (!PB_URL) throw new Error("NEXT_PUBLIC_PB_URL is not set (see .env.local).");
  const pb = new PocketBase(PB_URL) as TypedPocketBase;
  // Concurrent identical requests (e.g. two lists of products) must not cancel each other.
  pb.autoCancellation(false);
  return pb;
}

let browserClient: TypedPocketBase | undefined;

/**
 * Returns a PocketBase client.
 *
 * - Browser: one shared instance; the SDK persists auth in localStorage.
 * - Server: a fresh instance per call, so auth state can never leak between
 *   requests. Server code only reads public data.
 */
export function getPB(): TypedPocketBase {
  if (typeof window === "undefined") return createClient();
  browserClient ??= createClient();
  return browserClient;
}
