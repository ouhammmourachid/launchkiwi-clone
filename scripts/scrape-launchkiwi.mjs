#!/usr/bin/env node
/**
 * Scrapes a sample of public product + review data from launchkiwi.com and
 * writes it to pb/seed/launchkiwi.json. The seed script (scripts/seed.mjs)
 * reads that file, so scraping only needs to run once.
 *
 * Usage: node scripts/scrape-launchkiwi.mjs [--limit 60]
 *
 * Test data only — requests are sequential with a small delay to be polite.
 */

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = "https://launchkiwi.com";
const OUT_FILE = path.resolve("pb/seed/launchkiwi.json");
const DELAY_MS = 350;
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg > -1 ? Number(process.argv[limitArg + 1]) : 60;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (launchkiwi-clone seed)" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

/** Visible text of a page, one trimmed line per text node. */
function textLines(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "")
      .replace(/<[^>]+>/g, "\n"),
  )
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function jsonLd(html) {
  const out = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      out.push(JSON.parse(m[1]));
    } catch {
      /* ignore malformed blocks */
    }
  }
  return out;
}

const after = (lines, label, from = 0) => {
  const i = lines.indexOf(label, from);
  return i > -1 ? lines[i + 1] : undefined;
};

function parseProduct(slug, html) {
  const ld = jsonLd(html).find((d) => d["@type"] === "SoftwareApplication");
  if (!ld) return null;
  const lines = textLines(html);

  const nameIdx = lines.indexOf(ld.name, lines.indexOf(ld.name) + 1); // header occurrence
  const badgeCandidate = lines[nameIdx + 1];
  const badge = ["Priority", "Premium"].includes(badgeCandidate) ? badgeCandidate.toUpperCase() : null;
  const upvoteIdx = lines.indexOf("▲", nameIdx);
  const tagline = decode(
    html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? lines[upvoteIdx - 1] ?? "",
  ).replace(/\s+/g, " ");

  const detailsIdx = lines.indexOf("Details");
  const categoriesIdx = lines.indexOf("Categories", detailsIdx);
  const stopIdx = lines.findIndex((l, i) => i > categoriesIdx && (l === "Featured" || l === "More Products"));
  const tags = categoriesIdx > -1 ? lines.slice(categoriesIdx + 1, stopIdx > -1 ? stopIdx : categoriesIdx + 6) : [];

  // The product's own logo lives in the same storage folder as its OG image.
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? "";
  const folder = ogImage.match(/og-images\/([0-9a-f-]{36})\//)?.[1];
  const logoUrl = folder
    ? html.match(new RegExp(`https://[^"\\\\]+/logos/${folder}/[^"\\\\?]+`))?.[0] ?? null
    : null;

  return {
    slug,
    name: ld.name,
    tagline,
    description: ld.description || `<p>${tagline}</p>`,
    website_url: ld.url,
    category: ld.applicationCategory || after(lines, "Category", detailsIdx) || "Other",
    tags,
    pricing_model: after(lines, "Pricing", detailsIdx) ?? "Free",
    published: after(lines, "Published", detailsIdx) ?? null,
    upvotes: Number(lines[upvoteIdx + 1]) || 0,
    badge,
    logo_url: logoUrl,
  };
}

function parseReview(slug, html) {
  const ld = jsonLd(html).find((d) => d["@type"] === "Review");
  if (!ld) return null;
  const lines = textLines(html);
  const start = lines.indexOf("What it does");
  const end = lines.indexOf("Key features / how it works");
  const takeawaysStart = lines.indexOf("Key takeaways");
  const takeaways = takeawaysStart > -1 ? lines.slice(takeawaysStart + 1, start) : [];
  const body = start > -1 ? lines.slice(start + 1, end > start ? end : start + 3) : [];
  const content = [
    takeaways.length ? `<h3>Key takeaways</h3><ul>${takeaways.map((t) => `<li>${t}</li>`).join("")}</ul>` : "",
    body.length ? `<h3>What it does</h3>${body.map((p) => `<p>${p}</p>`).join("")}` : "",
  ].join("");

  return {
    product_slug: slug,
    title: ld.headline,
    rating: Number(ld.reviewRating?.ratingValue) || null,
    published_at: ld.datePublished,
    content,
  };
}

async function main() {
  console.log(`Fetching sitemap…`);
  const sitemap = await getHtml(`${BASE}/sitemap.xml`);
  const productSlugs = [...sitemap.matchAll(/<loc>https:\/\/launchkiwi\.com\/p\/([^<]+)<\/loc>/g)].map((m) => m[1]);

  const reviewsHtml = await getHtml(`${BASE}/reviews`);
  const reviewSlugs = [...new Set([...reviewsHtml.matchAll(/href="\/p\/([^"/]+)\/review"/g)].map((m) => m[1]))];

  // Reviewed products first so every review has a product to attach to.
  const slugs = [...new Set([...reviewSlugs, ...productSlugs])].slice(0, Math.max(LIMIT, reviewSlugs.length));

  const products = [];
  for (const [i, slug] of slugs.entries()) {
    try {
      const p = parseProduct(slug, await getHtml(`${BASE}/p/${slug}`));
      if (p) products.push(p);
      process.stdout.write(`\rproducts ${i + 1}/${slugs.length}`);
    } catch (err) {
      console.warn(`\n  skip ${slug}: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }
  console.log();

  const reviews = [];
  for (const slug of reviewSlugs) {
    try {
      const r = parseReview(slug, await getHtml(`${BASE}/p/${slug}/review`));
      if (r) reviews.push(r);
    } catch (err) {
      console.warn(`  skip review ${slug}: ${err.message}`);
    }
    await sleep(DELAY_MS);
  }

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify({ scraped_at: new Date().toISOString(), products, reviews }, null, 2));
  console.log(`Wrote ${products.length} products and ${reviews.length} reviews to ${path.relative(process.cwd(), OUT_FILE)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
