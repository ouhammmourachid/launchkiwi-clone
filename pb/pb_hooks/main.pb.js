/// <reference path="../pb_data/types.d.ts" />

/**
 * Server-side business rules the collection API rules can't express.
 * Every handler requires utils.js itself (PocketBase isolates handlers).
 */

// ── Products ──────────────────────────────────────────────────────────────

// Free self-serve launch: force safe defaults so users can't publish
// themselves as featured/priority or forge counters.
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
  r.set("status", "published");
  r.set("submission_type", "self_submitted");
  r.set("claimed", true);
  r.set("verified", false);
  r.set("featured", false);
  r.set("featured_until", "");
  r.set("priority_level", 0);
  r.set("dofollow_enabled", false);
  r.set("instant_approved", false);
  r.set("badge_verified", false);
  r.set("upvotes", 0);
  r.set("views", 0);
  r.set("clicks", 0);
  r.set("submitted_at", now);
  r.set("approved_at", now);
  r.set("published_at", now);
  r.set("launch_date", now);

  e.next();

  // Bookkeeping after the product exists; never fail the user's request over it.
  try {
    const submissions = e.app.findCollectionByNameOrId("submissions");
    const submission = new Record(submissions);
    submission.set("product", r.id);
    submission.set("submitted_by", e.auth.id);
    submission.set("contact_email", e.auth.email());
    submission.set("status", "approved");
    submission.set("plan", "free");
    submission.set("approved_at", now);

    const week = u.currentLaunchWeek(e.app);
    if (week) {
      submission.set("launch_week", week.id);
      const entry = new Record(e.app.findCollectionByNameOrId("launch_entries"));
      entry.set("launch_week", week.id);
      entry.set("product", r.id);
      entry.set("week_upvotes", 0);
      e.app.save(entry);
    }
    e.app.save(submission);
  } catch (err) {
    e.app.logger().error("product submission bookkeeping failed", "product", r.id, "error", String(err));
  }
}, "products");

// Makers may edit their listing copy, but not moderation fields or counters.
onRecordUpdateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    const original = e.record.original();
    u.PROTECTED_PRODUCT_FIELDS.forEach((field) => e.record.set(field, original.get(field)));
  }
  e.next();
}, "products");

// ── Votes ─────────────────────────────────────────────────────────────────

onRecordCreateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    if (!e.auth) throw new UnauthorizedError("Sign in to upvote.");
    e.record.set("user", e.auth.id);
    e.record.set("visitor_hash", "");
  }
  e.record.set("voted_at", new DateTime());
  e.next();
}, "votes");

onRecordAfterCreateSuccess((e) => {
  const u = require(`${__hooks}/utils.js`);
  u.bumpUpvotes(e.app, e.record.getString("product"), 1);
  e.next();
}, "votes");

onRecordAfterDeleteSuccess((e) => {
  const u = require(`${__hooks}/utils.js`);
  u.bumpUpvotes(e.app, e.record.getString("product"), -1);
  e.next();
}, "votes");

// ── Favorites & comments: owner is always the caller ─────────────────────

onRecordCreateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    if (!e.auth) throw new UnauthorizedError("Sign in to save products.");
    e.record.set("user", e.auth.id);
  }
  e.next();
}, "favorites");

onRecordCreateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    if (!e.auth) throw new UnauthorizedError("Sign in to comment.");
    e.record.set("author", e.auth.id);
    e.record.set("content", e.record.getString("content").trim());
  }
  e.next();
}, "comments");

// ── Reviews: user-submitted reviews go to moderation ─────────────────────

onRecordCreateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    if (!e.auth) throw new UnauthorizedError("Sign in to write a review.");
    e.record.set("author", e.auth.id);
    e.record.set("status", "pending");
    e.record.set("is_verified_user", false);
    e.record.set("published_at", "");
  }
  e.next();
}, "reviews");

// Published reviews are rendered as HTML, so only admins may publish/edit status.
onRecordUpdateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    const original = e.record.original();
    ["author", "product", "status", "is_verified_user", "published_at"].forEach((field) =>
      e.record.set(field, original.get(field)),
    );
    // Any edit by the author sends the review back to moderation.
    e.record.set("status", "pending");
  }
  e.next();
}, "reviews");

// ── Newsletter ────────────────────────────────────────────────────────────

// Idempotent subscribe: re-subscribing an existing email succeeds quietly
// instead of leaking a "value must be unique" error.
onRecordCreateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  const email = e.record.getString("email").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BadRequestError("Please enter a valid email address.");
  }

  let existing = null;
  try {
    existing = e.app.findFirstRecordByFilter("subscribers", "email = {:email}", { email: email });
  } catch (_) {
    /* new subscriber */
  }
  if (existing) {
    if (!existing.getBool("active")) {
      existing.set("active", true);
      existing.set("unsubscribed_at", "");
      e.app.save(existing);
    }
    return e.json(200, { id: existing.id, email: email, active: true });
  }

  e.record.set("email", email);
  if (!u.isAdmin(e)) {
    e.record.set("verified", false);
    e.record.set("active", true);
    e.record.set("unsubscribed_at", "");
    e.record.set("source", e.record.getString("source") || "website");
  }
  e.record.set("subscribed_at", new DateTime());
  e.record.set("unsubscribe_token", $security.randomString(32));
  e.next();
}, "subscribers");
