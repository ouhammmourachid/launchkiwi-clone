#!/usr/bin/env node
/**
 * Seeds PocketBase with test data scraped from launchkiwi.com
 * (see scripts/scrape-launchkiwi.mjs) plus demo users, launch weeks,
 * pricing plans and comments.
 *
 * Idempotent: records are upserted by their unique key (slug/email), and
 * existing products keep their live upvote counts.
 *
 * Usage: npm run seed   (reads NEXT_PUBLIC_PB_URL + PB_ADMIN_* from .env.local)
 */

import { readFile } from "node:fs/promises";
import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL ?? "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;

const DEMO_PASSWORD = "launchkiwi-demo";
const DEMO_USERS = [
  { email: "demo@launchkiwi.local", name: "Demo Maker" },
  { email: "ada@launchkiwi.local", name: "Ada Lovelace" },
  { email: "linus@launchkiwi.local", name: "Linus Park" },
  { email: "grace@launchkiwi.local", name: "Grace Hopper" },
];
const EDITOR = { email: "editor@launchkiwi.local", name: "LaunchKiwi Editorial", is_admin: true };

const PRICING_PLANS = [
  {
    slug: "free", name: "Free", price: 0, description: "Join the queue, earn your way up.",
    features: ["Permanent listing on LaunchDunes", "Badge verification required", "Dofollow backlink", "Queue-based launch"],
    badge_required: true, instant_approval: false, dofollow: true, featured: false, pin_days: 0, priority_level: 0,
  },
  {
    slug: "premium", name: "Premium", price: 15, description: "Skip the wait, get seen today.",
    features: ["Instant approval — no badge required", "Guaranteed placement, skip the queue", "Dofollow link from day one", "Up to 5× more clicks", "Featured badge on listing", "Pinned to top for 7 days"],
    badge_required: false, instant_approval: true, dofollow: true, featured: true, pin_days: 7, priority_level: 1,
  },
  {
    slug: "priority", name: "Priority", price: 24, description: "Maximum visibility, longest runway.",
    features: ["Everything in Premium", "Priority spot in related picks", "Priority badge above Featured", "Pinned to top for 14 days", "Up to 15× more clicks", "SEO-optimised review page with extra dofollow backlink"],
    badge_required: false, instant_approval: true, dofollow: true, featured: true, pin_days: 14, priority_level: 2,
  },
];

const SAMPLE_COMMENTS = [
  "Congrats on the launch! The onboarding felt really smooth.",
  "Upvoted — this solves a real pain point for me.",
  "Clean landing page. Is there a public roadmap?",
  "Tried it this morning, works great. Any plans for an API?",
];

const slugify = (s) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const pbDate = (d) => d.toISOString().replace("T", " ");

/** Monday 00:00 UTC of the week containing `d`. */
function weekStart(d) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  x.setUTCDate(x.getUTCDate() - ((x.getUTCDay() + 6) % 7));
  return x;
}

async function upsert(pb, collection, filter, params, data) {
  const col = pb.collection(collection);
  try {
    const existing = await col.getFirstListItem(pb.filter(filter, params));
    return { record: await col.update(existing.id, data), created: false };
  } catch (err) {
    if (err?.status !== 404) throw err;
    return { record: await col.create(data), created: true };
  }
}

async function downloadLogo(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const type = res.headers.get("content-type")?.split(";")[0] ?? "image/png";
    const name = url.split("/").pop();
    return new File([await res.arrayBuffer()], name, { type });
  } catch {
    return null;
  }
}

async function main() {
  if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
    throw new Error("PB_ADMIN_EMAIL / PB_ADMIN_PASSWORD must be set (see .env.local).");
  }
  const { products, reviews } = JSON.parse(await readFile("pb/seed/launchkiwi.json", "utf8"));

  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);
  await pb.collection("_superusers").authWithPassword(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD);
  console.log(`Seeding ${PB_URL}`);

  // Users ────────────────────────────────────────────────────────────────
  const users = {};
  for (const u of [EDITOR, ...DEMO_USERS]) {
    const { record } = await upsert(pb, "users", "email = {:email}", { email: u.email }, {
      ...u,
      password: DEMO_PASSWORD,
      passwordConfirm: DEMO_PASSWORD,
      verified: true,
      emailVisibility: false,
    });
    users[u.email] = record;
  }
  console.log(`  users: ${Object.keys(users).length}`);

  // Categories & tags ────────────────────────────────────────────────────
  const categoryIds = {};
  const categoryNames = [...new Set(products.map((p) => p.category))].sort();
  for (const [i, name] of categoryNames.entries()) {
    const slug = slugify(name);
    const { record } = await upsert(pb, "categories", "slug = {:slug}", { slug }, { name, slug, sort_order: i, active: true });
    categoryIds[name] = record.id;
  }
  const tagIds = {};
  for (const name of [...new Set(products.flatMap((p) => p.tags))].sort()) {
    const slug = slugify(name);
    const { record } = await upsert(pb, "tags", "slug = {:slug}", { slug }, { name, slug });
    tagIds[name] = record.id;
  }
  console.log(`  categories: ${categoryNames.length}, tags: ${Object.keys(tagIds).length}`);

  // Launch weeks: current + 5 previous ──────────────────────────────────
  const now = new Date();
  const weeks = [];
  for (let i = 0; i < 6; i++) {
    const start = weekStart(now);
    start.setUTCDate(start.getUTCDate() - 7 * i);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    end.setUTCSeconds(-1);
    const slug = `week-${start.toISOString().slice(0, 10)}`;
    const { record } = await upsert(pb, "launch_weeks", "slug = {:slug}", { slug }, {
      slug,
      name: `Week of ${start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}`,
      starts_at: pbDate(start),
      ends_at: pbDate(end),
      status: i === 0 ? "active" : "closed",
      is_current: i === 0,
      max_featured: 5,
    });
    weeks.push({ record, start, end });
  }
  const weekFor = (date) => weeks.find((w) => date >= w.start && date <= w.end);

  // Products ─────────────────────────────────────────────────────────────
  const productIds = {};
  let createdCount = 0;
  for (const [i, p] of products.entries()) {
    const parsed = p.published ? new Date(`${p.published} 12:00 UTC`) : null;
    const launched = parsed && !Number.isNaN(parsed.getTime()) ? parsed : new Date(now.getTime() - (i % 30) * 86400000);
    const priority = p.badge === "PRIORITY" ? 2 : p.badge === "PREMIUM" ? 1 : 0;
    const data = {
      name: p.name,
      slug: p.slug,
      tagline: p.tagline.slice(0, 180),
      description: p.description,
      website_url: p.website_url,
      category: categoryIds[p.category],
      tags: p.tags.map((t) => tagIds[t]).filter(Boolean),
      pricing_model: p.pricing_model,
      status: "published",
      submission_type: "admin_added",
      maker: users[DEMO_USERS[0].email].id,
      featured: priority > 0,
      priority_level: priority,
      verified: true,
      dofollow_enabled: true,
      published_at: pbDate(launched),
      launch_date: pbDate(launched),
      submitted_at: pbDate(launched),
      approved_at: pbDate(launched),
    };

    let record;
    try {
      record = await pb.collection("products").getFirstListItem(pb.filter("slug = {:slug}", { slug: p.slug }));
      record = await pb.collection("products").update(record.id, data); // keep live upvotes
    } catch (err) {
      if (err?.status !== 404) throw err;
      const logo = await downloadLogo(p.logo_url);
      record = await pb.collection("products").create({ ...data, upvotes: p.upvotes, ...(logo ? { logo } : {}) });
      createdCount++;
    }
    productIds[p.slug] = record.id;

    const week = weekFor(launched);
    if (week) {
      await upsert(pb, "launch_entries", "launch_week = {:w} && product = {:p}", { w: week.record.id, p: record.id }, {
        launch_week: week.record.id,
        product: record.id,
        week_upvotes: record.upvotes,
        featured: priority > 0,
      });
    }
    process.stdout.write(`\r  products: ${i + 1}/${products.length}`);
  }
  console.log(` (${createdCount} new)`);

  // Editorial reviews ────────────────────────────────────────────────────
  for (const r of reviews) {
    const product = productIds[r.product_slug];
    if (!product) continue;
    await upsert(pb, "reviews", "product = {:p} && author = {:a}", { p: product, a: users[EDITOR.email].id }, {
      product,
      author: users[EDITOR.email].id,
      title: r.title,
      rating: r.rating,
      content: r.content || `<p>${r.title}</p>`,
      takeaways: r.takeaways ?? [],
      scores: r.scores ?? [],
      best_for: r.best_for ?? "",
      not_ideal_for: r.not_ideal_for ?? "",
      pros: r.pros ?? [],
      cons: r.cons ?? [],
      verdict: r.verdict ?? "",
      status: "published",
      is_verified_user: true,
      published_at: pbDate(new Date(r.published_at)),
    });
  }
  console.log(`  reviews: ${reviews.length}`);

  // Comments (only when a product has none, so re-runs don't duplicate) ──
  const commenters = DEMO_USERS.slice(1).map((u) => users[u.email].id);
  let commentCount = 0;
  for (const [i, slug] of Object.keys(productIds).slice(0, 12).entries()) {
    const product = productIds[slug];
    const existing = await pb.collection("comments").getList(1, 1, { filter: pb.filter("product = {:p}", { p: product }) });
    if (existing.totalItems > 0) continue;
    for (let j = 0; j < 2; j++) {
      await pb.collection("comments").create({
        product,
        author: commenters[(i + j) % commenters.length],
        content: SAMPLE_COMMENTS[(i + j) % SAMPLE_COMMENTS.length],
      });
      commentCount++;
    }
  }
  console.log(`  comments: ${commentCount} new`);

  // Plans ────────────────────────────────────────────────────────────────
  for (const plan of PRICING_PLANS) {
    await upsert(pb, "pricing_plans", "slug = {:slug}", { slug: plan.slug }, { ...plan, currency: "USD", duration_days: 0, active: true });
  }
  // Ad plans (spotlight-30 / spotlight-90) are created by pb_migrations/1790100008_advertising.js.
  console.log(`  pricing plans: ${PRICING_PLANS.length}`);

  // Users sign in with an emailed one-time code; without SMTP the code prints in the PocketBase console.
  console.log(`\nDone. Demo login: ${DEMO_USERS[0].email} (sign-in code appears in the PocketBase console)`);
}

main().catch((err) => {
  console.error("\nSeed failed:", err?.response ?? err);
  process.exit(1);
});
