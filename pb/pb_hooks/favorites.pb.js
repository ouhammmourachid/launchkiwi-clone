/// <reference path="../pb_data/types.d.ts" />

/**
 * Favorites: the owner is always the caller.
 */

onRecordCreateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    if (!e.auth) throw new UnauthorizedError("Sign in to save products.");
    e.record.set("user", e.auth.id);
  }
  e.next();
}, "favorites");
