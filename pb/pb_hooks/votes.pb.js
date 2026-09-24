/// <reference path="../pb_data/types.d.ts" />

/**
 * Upvotes from members and guests, plus the denormalized products.upvotes counter.
 */

// Signed-in users vote as themselves; guests vote under their browser's
// `X-Visitor-Id`, with a per-IP cap so clearing storage can't farm votes.
onRecordCreateRequest((e) => {
  const u = require(`${__hooks}/utils.js`);
  if (!u.isAdmin(e)) {
    const r = e.record;
    const product = r.getString("product");
    const visitorId = u.visitorId(e);
    const alreadyVoted = (field, value) =>
      value !== "" && e.app.countRecords("votes", $dbx.hashExp({ product: product, [field]: value })) > 0;

    if (e.auth) {
      // Catches a guest vote from this browser made before signing in.
      if (alreadyVoted("visitor_hash", visitorId)) throw new BadRequestError("You've already upvoted this product.");
      r.set("user", e.auth.id);
      r.set("visitor_hash", "");
      r.set("ip_hash", "");
    } else {
      if (!visitorId) throw new BadRequestError("Couldn't save your vote. Please enable site storage and try again.");
      if (alreadyVoted("visitor_hash", visitorId)) throw new BadRequestError("You've already upvoted this product.");
      const ipHash = $security.sha256(e.realIP());
      if (e.app.countRecords("votes", $dbx.hashExp({ product: product, ip_hash: ipHash })) >= u.MAX_GUEST_VOTES_PER_IP) {
        throw new BadRequestError("Too many upvotes for this product from your network. Sign in to upvote.");
      }
      r.set("user", "");
      r.set("visitor_hash", visitorId);
      r.set("ip_hash", ipHash);
    }
    r.set("user_agent_hash", "");
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
