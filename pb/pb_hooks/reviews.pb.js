/// <reference path="../pb_data/types.d.ts" />

/**
 * Reviews: user-submitted reviews go to moderation.
 */

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
