/// <reference path="../pb_data/types.d.ts" />

/**
 * Comments: members post instantly, guests go to moderation.
 */

onRecordCreateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  const r = e.record;
  r.set("content", r.getString("content").trim());
  if (u.isAdmin(e)) {
    if (!r.getString("status")) r.set("status", "approved");
  } else if (e.auth) {
    r.set("author", e.auth.id);
    r.set("author_name", "");
    r.set("status", "approved");
  } else {
    const name = r.getString("author_name").trim().replace(/\s+/g, " ");
    if (name.length < 2) throw new BadRequestError("Please enter your name.");
    r.set("author", "");
    r.set("author_name", name.slice(0, 50));
    r.set("status", "pending");
  }
  e.next();
}, "comments");

// Authors may edit their wording, but not the moderation status or ownership.
onRecordUpdateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    const original = e.record.original();
    ["product", "author", "author_name", "status"].forEach((field) => e.record.set(field, original.get(field)));
    e.record.set("content", e.record.getString("content").trim());
  }
  e.next();
}, "comments");
