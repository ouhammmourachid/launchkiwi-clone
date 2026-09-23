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

/** Fields only admins may set on a product (counters, moderation, paid perks). */
const PROTECTED_PRODUCT_FIELDS = [
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
  visitorId,
  MAX_GUEST_VOTES_PER_IP,
  PROTECTED_PRODUCT_FIELDS,
};
