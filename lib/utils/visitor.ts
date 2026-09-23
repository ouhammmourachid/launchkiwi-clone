/**
 * Anonymous browser identity for guest upvotes. A random id is kept in
 * localStorage and sent as `X-Visitor-Id`; PocketBase rules only ever match a
 * guest's own votes by it, so it works like a bearer token for those votes.
 */

const STORAGE_KEY = "visitor-id";

let memoryId: string | undefined;

function randomId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // randomUUID needs a secure context (https/localhost); fall back for LAN dev.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Browser-only. Falls back to a per-tab id when storage is blocked. */
export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    memoryId ??= randomId();
    return memoryId;
  }
}

export const visitorHeaders = () => ({ "X-Visitor-Id": getVisitorId() });
