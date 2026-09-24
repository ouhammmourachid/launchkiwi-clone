/// <reference path="../pb_data/types.d.ts" />

/**
 * Shared helpers for the pb_hooks handlers.
 *
 * PocketBase runs every handler in an isolated JS runtime, so handlers cannot
 * close over module-level values. Each handler must `require()` this file.
 */

/** Superusers and users flagged `is_admin` bypass user-level restrictions. */
function isAdmin(e) {
  if (e.hasSuperuserAuth && e.hasSuperuserAuth()) return true;
  return !!(e.auth && e.auth.getBool("is_admin"));
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Returns `base` or `base-2`, `base-3`… — whichever is free in `collection`. */
function uniqueSlug(app, collection, base) {
  const root = base || "item";
  for (let i = 1; i < 1000; i++) {
    const candidate = i === 1 ? root : root + "-" + i;
    try {
      app.findFirstRecordByFilter(collection, "slug = {:slug}", { slug: candidate });
    } catch (_) {
      return candidate; // not found → free
    }
  }
  return root + "-" + $security.randomString(6).toLowerCase();
}

/** Atomically moves a product's upvote counters by `delta` (never below 0). */
function bumpUpvotes(app, productId, delta) {
  app
    .db()
    .newQuery("UPDATE products SET upvotes = MAX(COALESCE(upvotes, 0) + {:delta}, 0) WHERE id = {:id}")
    .bind({ id: productId, delta: delta })
    .execute();

  app
    .db()
    .newQuery(
      "UPDATE launch_entries SET week_upvotes = MAX(COALESCE(week_upvotes, 0) + {:delta}, 0) " +
        "WHERE product = {:id} AND launch_week IN (SELECT id FROM launch_weeks WHERE is_current = TRUE)",
    )
    .bind({ id: productId, delta: delta })
    .execute();
}

/** Guest votes allowed per product from one IP (a household or office can share one). */
const MAX_GUEST_VOTES_PER_IP = 3;

/** The guest's browser id from `X-Visitor-Id`, or "" when missing/malformed. */
function visitorId(e) {
  const value = String(e.requestInfo().headers["x_visitor_id"] || "").trim();
  return /^[A-Za-z0-9-]{16,64}$/.test(value) ? value : "";
}

function currentLaunchWeek(app) {
  try {
    return app.findFirstRecordByFilter("launch_weeks", "is_current = true");
  } catch (_) {
    return null;
  }
}

/** Free launches go live in a daily queue; paid plans skip it. */
const FREE_LAUNCHES_PER_DAY = 3;

/** "2026-09-24 00:00:00.000Z" for the UTC day `offset` days from today. */
function utcDay(offset) {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().replace("T", " ");
}

/** The first day (from tomorrow) with a free queue slot left. */
function nextFreeLaunchDate(app) {
  for (let offset = 1; offset < 3650; offset++) {
    const taken = app.countRecords(
      "products",
      $dbx.exp("launch_date >= {:from} AND launch_date < {:to} AND priority_level = 0 AND submission_type = 'self_submitted'", {
        from: utcDay(offset),
        to: utcDay(offset + 1),
      }),
    );
    if (taken < FREE_LAUNCHES_PER_DAY) return new DateTime(utcDay(offset));
  }
  return new DateTime(utcDay(3650));
}

// ── Launch lifecycle ─────────────────────────────────────────────────────
//
// Free:     created `pending` (hidden) → maker adds our badge to their site →
//           verified → published into the free queue with a dofollow link.
// Premium / Priority: the paid webhook publishes immediately, no badge needed.

/** Public site origin used in badge links (pb/.env SITE_URL, falling back to APP_URL). */
function siteUrl() {
  return String($os.getenv("SITE_URL") || $os.getenv("APP_URL") || "http://localhost:3000")
    .trim()
    .replace(/\/+$/, "");
}

/** Hosts we refuse to fetch during badge checks (loopback, private and link-local ranges). */
function isPrivateHost(host) {
  const h = String(host || "").toLowerCase().replace(/^\[|\]$/g, "");
  if (!h || h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h.includes(":")) return h === "::1" || /^(fc|fd|fe80)/.test(h);
  const m = h.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return false;
  const a = +m[1], b = +m[2];
  return a === 0 || a === 10 || a === 127 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
}

/**
 * Looks for our badge on the product's website. The badge counts when the
 * homepage links to the product's page on our site or carries its badge token.
 * Returns `{ ok, reason, html }` — never throws.
 */
function checkBadge(product) {
  const url = product.getString("website_url");
  const host = (url.match(/^https?:\/\/([^\/?#:]+|\[[^\]]+\])/i) || [])[1];
  if (isPrivateHost(host)) return { ok: false, reason: "This website address can't be checked.", html: "" };

  let res;
  try {
    res = $http.send({
      url: url,
      method: "GET",
      timeout: 15,
      headers: { "User-Agent": "LaunchDunesBadgeBot/1.0 (+" + siteUrl() + ")", Accept: "text/html" },
    });
  } catch (err) {
    return { ok: false, reason: "We couldn't reach your website. Is it online?", html: "" };
  }
  if (res.statusCode >= 400) return { ok: false, reason: "Your website answered with HTTP " + res.statusCode + ".", html: "" };

  const html = toString(res.body);
  const token = product.getString("badge_token");
  const productPath = "/p/" + product.getString("slug");
  const siteHost = siteUrl().replace(/^https?:\/\//, "");
  const linksToUs = html.toLowerCase().includes((siteHost + productPath).toLowerCase());
  if (linksToUs || (token && html.includes(token))) return { ok: true, reason: "", html: "" };
  return {
    ok: false,
    reason: "We couldn't find the badge on " + url + ". Make sure it's on your homepage and deployed.",
    html: html.slice(0, 2000),
  };
}

/** Appends a row to `badge_verifications` (audit trail + throttling). */
function logBadgeCheck(app, product, result) {
  const row = new Record(app.findCollectionByNameOrId("badge_verifications"));
  row.set("product", product.id);
  row.set("token", product.getString("badge_token") || "-");
  row.set("verification_url", product.getString("website_url"));
  row.set("status", result.ok ? "verified" : "failed");
  row.set("checked_at", new DateTime());
  row.set("failure_reason", result.reason || "");
  row.set("detected_html", result.html || "");
  app.save(row);
}

/**
 * Makes a hidden launch public on `launchDate` (caller saves the product) and
 * books its launch-week entry and submission. Safe to call on a product that
 * is already published — it only fills what's missing.
 */
function publishProduct(app, product, launchDate, plan) {
  const now = new DateTime();
  const wasPublished = product.getString("status") === "published";
  product.set("status", "published");
  if (product.getDateTime("approved_at").isZero()) product.set("approved_at", now);
  if (!wasPublished || product.getDateTime("launch_date").isZero()) {
    product.set("launch_date", launchDate);
    product.set("published_at", launchDate);
  }

  try {
    const submission = app.findFirstRecordByFilter("submissions", "product = {:p}", { p: product.id });
    submission.set("status", "approved");
    submission.set("approved_at", now);
    if (plan) submission.set("plan", plan);
    const week = currentLaunchWeek(app);
    if (week && !submission.getString("launch_week")) {
      submission.set("launch_week", week.id);
      if (app.countRecords("launch_entries", $dbx.hashExp({ product: product.id, launch_week: week.id })) === 0) {
        const entry = new Record(app.findCollectionByNameOrId("launch_entries"));
        entry.set("launch_week", week.id);
        entry.set("product", product.id);
        entry.set("week_upvotes", 0);
        app.save(entry);
      }
    }
    app.save(submission);
  } catch (_) {
    /* seeded products have no submission */
  }
}

/** Fields only admins may set on a product (counters, moderation, paid perks). */
const PROTECTED_PRODUCT_FIELDS = [
  // Identity: the name, URL and slug are fixed once submitted.
  "name",
  "website_url",
  "slug",
  "maker",
  "status",
  "submission_type",
  "upvotes",
  "views",
  "clicks",
  "claimed",
  "verified",
  "featured",
  "featured_until",
  "priority_level",
  "dofollow_enabled",
  "instant_approved",
  "badge_token",
  "maker_email",
  "badge_verified",
  "badge_verified_at",
  "rejection_reason",
  "published_at",
  "launch_date",
  "submitted_at",
  "approved_at",
  "last_reviewed_at",
];

module.exports = {
  isAdmin,
  slugify,
  uniqueSlug,
  bumpUpvotes,
  currentLaunchWeek,
  nextFreeLaunchDate,
  visitorId,
  siteUrl,
  checkBadge,
  logBadgeCheck,
  publishProduct,
  MAX_GUEST_VOTES_PER_IP,
  PROTECTED_PRODUCT_FIELDS,
};
