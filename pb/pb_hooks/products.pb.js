/// <reference path="../pb_data/types.d.ts" />

/**
 * Products: self-serve submissions, maker edits and the launch queue.
 * Every handler requires utils.js itself (PocketBase isolates handlers).
 */

// Self-serve launch: force safe defaults so users can't publish themselves
// as featured/priority or forge counters. Every launch starts hidden
// (`pending`) until the maker earns it: a free launch by verifying our badge
// on their site (POST /api/products/{id}/verify-badge in badge.pb.js), a paid one through the
// Lemon Squeezy webhook (payments.pb.js).
onRecordCreateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (u.isAdmin(e)) return e.next();
  if (!e.auth) throw new UnauthorizedError("Sign in to submit a product.");

  const r = e.record;
  const url = r.getString("website_url").trim();
  if (!/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(url)) {
    throw new BadRequestError("Please enter a valid website URL (https://…).");
  }
  try {
    e.app.findFirstRecordByFilter("products", "website_url = {:url}", { url: url });
    throw new BadRequestError("This product is already listed.");
  } catch (err) {
    if (err instanceof BadRequestError) throw err; // not-found is the happy path
  }

  const now = new DateTime();
  r.set("website_url", url);
  r.set("slug", u.uniqueSlug(e.app, "products", u.slugify(r.getString("slug") || r.getString("name"))));
  r.set("maker", e.auth.id);
  r.set("maker_email", e.auth.email());
  r.set("status", "pending");
  r.set("submission_type", "self_submitted");
  r.set("claimed", true);
  r.set("verified", false);
  r.set("featured", false);
  r.set("featured_until", "");
  r.set("priority_level", 0);
  r.set("dofollow_enabled", false);
  r.set("instant_approved", false);
  r.set("badge_token", "ld_" + $security.randomString(24));
  r.set("badge_verified", false);
  r.set("badge_verified_at", "");
  r.set("upvotes", 0);
  r.set("views", 0);
  r.set("clicks", 0);
  r.set("submitted_at", now);
  r.set("approved_at", "");
  // No date yet: a free launch takes the next queue slot once its badge is verified.
  r.set("published_at", "");
  r.set("launch_date", "");

  e.next();

  // Bookkeeping after the product exists; never fail the user's request over it.
  try {
    const submission = new Record(e.app.findCollectionByNameOrId("submissions"));
    submission.set("product", r.id);
    submission.set("submitted_by", e.auth.id);
    submission.set("contact_email", e.auth.email());
    submission.set("status", "needs_badge");
    submission.set("plan", "free");
    submission.set("badge_required", true);
    submission.set("instant_approval", false);
    e.app.save(submission);
  } catch (err) {
    e.app.logger().error("product submission bookkeeping failed", "product", r.id, "error", String(err));
  }
}, "products");

// Next free queue slot, shown on the launch form.
routerAdd("GET", "/api/launch-queue", (e) => {
  const u = require(`${__hooks}/utils.js`);
  return e.json(200, { nextFreeDate: u.nextFreeLaunchDate(e.app).string() });
});

// Makers may edit their listing copy, but not moderation fields or counters.
onRecordUpdateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    const original = e.record.original();
    u.PROTECTED_PRODUCT_FIELDS.forEach((field) => e.record.set(field, original.get(field)));
  }
  e.next();
}, "products");
