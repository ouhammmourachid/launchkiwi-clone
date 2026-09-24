/// <reference path="../pb_data/types.d.ts" />

/**
 * Newsletter subscriptions.
 */

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
