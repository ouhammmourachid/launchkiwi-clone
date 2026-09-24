/**
 * GET /api/autofill?url=https://… — reads a site's <title> and meta
 * description so the launch form can prefill name, tagline and description.
 * Only public http(s) hosts are fetched (no localhost / private networks).
 */

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const MAX_BYTES = 512 * 1024;
const MAX_REDIRECTS = 3;

function isPrivateAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    if (v.startsWith("::ffff:")) return isPrivateAddress(v.slice(7));
    return v === "::" || v === "::1" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80");
  }
  const [a, b] = ip.split(".").map(Number);
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

async function assertPublicUrl(raw: string): Promise<URL> {
  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Only http(s) URLs are supported.");
  const addresses = await lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some((a) => isPrivateAddress(a.address))) throw new Error("That host can't be fetched.");
  return url;
}

async function fetchHtml(raw: string): Promise<string> {
  let url = await assertPublicUrl(raw);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(8000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; LaunchDunesBot/1.0)", accept: "text/html" },
    });
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      url = await assertPublicUrl(new URL(location, url).toString());
      continue;
    }
    if (!res.ok || !res.body) throw new Error(`The site responded with ${res.status}.`);

    const reader = res.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (size < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.length;
    }
    void reader.cancel();
    return new TextDecoder().decode(Buffer.concat(chunks));
  }
  throw new Error("Too many redirects.");
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", "#39": "'", "#x27": "'", nbsp: " " };
const decode = (s: string) => s.replace(/&(#?\w+);/g, (m, e: string) => ENTITIES[e.toLowerCase()] ?? m).replace(/\s+/g, " ").trim();

function meta(html: string, key: string): string {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = tag.match(/\b(?:name|property)\s*=\s*["']([^"']+)["']/i)?.[1];
    if (name?.toLowerCase() === key) return decode(tag.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] ?? "");
  }
  return "";
}

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get("url") ?? "";
  try {
    const html = await fetchHtml(target);
    const title = meta(html, "og:title") || decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const siteName = meta(html, "og:site_name");
    const description = meta(html, "description") || meta(html, "og:description") || meta(html, "twitter:description");
    // "Acme — Do things faster" → name "Acme", tagline "Do things faster"
    const [head, ...rest] = title.split(/\s+[|—–:-]\s+/);
    const name = siteName || head || "";
    const tagline = rest.filter((part) => part.toLowerCase() !== name.toLowerCase()).join(" — ");
    return Response.json({
      name,
      tagline: tagline || description,
      description,
    });
  } catch (err) {
    const message = err instanceof Error && err.name !== "TypeError" ? err.message : "Couldn't reach that website.";
    return Response.json({ error: message }, { status: 422 });
  }
}
