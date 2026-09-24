/// <reference path="../pb_data/types.d.ts" />

/**
 * "Featured on LaunchDunes" badge: token lookup, on-demand verification and
 * the daily re-check that keeps free launches' dofollow links honest.
 */

// The badge token is a hidden field; only the maker (or an admin) may read it.
routerAdd(
  "GET",
  "/api/products/{id}/badge",
  (e) => {
    const u = require(`${__hooks}/utils.js`);
    let product;
    try {
      product = e.app.findRecordById("products", e.request.pathValue("id"));
    } catch (_) {
      throw new NotFoundError("Product not found.");
    }
    if (product.getString("maker") !== e.auth.id && !u.isAdmin(e)) throw new NotFoundError("Product not found.");
    if (!product.getString("badge_token")) {
      product.set("badge_token", "ld_" + $security.randomString(24));
      e.app.saveNoValidate(product);
    }
    return e.json(200, {
      token: product.getString("badge_token"),
      verified: product.getBool("badge_verified"),
      verifiedAt: product.getDateTime("badge_verified_at").string(),
    });
  },
  $apis.requireAuth(),
);

// Maker asks us to look for the badge on their site. On success the launch
// gets a dofollow link and — if it was still hidden — the next free queue slot.
routerAdd(
  "POST",
  "/api/products/{id}/verify-badge",
  (e) => {
    const u = require(`${__hooks}/utils.js`);
    let product;
    try {
      product = e.app.findRecordById("products", e.request.pathValue("id"));
    } catch (_) {
      throw new NotFoundError("Product not found.");
    }
    if (product.getString("maker") !== e.auth.id && !u.isAdmin(e)) {
      throw new ForbiddenError("You can only verify your own products.");
    }
    if (["rejected", "suspended", "archived"].includes(product.getString("status"))) {
      throw new BadRequestError("This launch can't be verified.");
    }

    // One live fetch per product every 20 seconds is plenty.
    const recent = e.app.countRecords(
      "badge_verifications",
      $dbx.exp("product = {:p} AND created > {:since}", {
        p: product.id,
        since: new DateTime().add(-20 * 1000 * 1000 * 1000).string(),
      }),
    );
    if (recent > 0) throw new TooManyRequestsError("Please wait a few seconds before checking again.");

    const result = u.checkBadge(product);
    u.logBadgeCheck(e.app, product, result);
    if (!result.ok) return e.json(200, { verified: false, reason: result.reason });

    e.app.runInTransaction((txApp) => {
      const p = txApp.findRecordById("products", product.id);
      const now = new DateTime();
      p.set("badge_verified", true);
      p.set("badge_verified_at", now);
      p.set("verified", true);
      p.set("dofollow_enabled", true);
      if (p.getString("status") !== "published") u.publishProduct(txApp, p, u.nextFreeLaunchDate(txApp), null);
      txApp.save(p);
    });

    const saved = e.app.findRecordById("products", product.id);
    return e.json(200, {
      verified: true,
      status: saved.getString("status"),
      launchDate: saved.getDateTime("launch_date").string(),
    });
  },
  $apis.requireAuth(),
);

// Daily re-check of free launches: their dofollow link lasts as long as the
// badge does. Two failed checks in a row (so a brief outage doesn't count)
// turn the link back to nofollow; the listing itself stays up.
cronAdd("badge-recheck", "30 4 * * *", () => {
  const u = require(`${__hooks}/utils.js`);
  const products = $app.findRecordsByFilter(
    "products",
    "status = 'published' && badge_verified = true && instant_approved = false",
    "badge_verified_at",
    500,
    0,
  );
  products.forEach((product) => {
    try {
      const result = u.checkBadge(product);
      const previous = $app.findRecordsByFilter("badge_verifications", "product = {:p}", "-created", 1, 0, { p: product.id })[0];
      u.logBadgeCheck($app, product, result);
      if (result.ok) return;
      if (previous && previous.getString("status") === "failed") {
        product.set("badge_verified", false);
        product.set("dofollow_enabled", false);
        $app.save(product);
        $app.logger().info("badge removed, dofollow revoked", "product", product.id);
      }
    } catch (err) {
      $app.logger().error("badge recheck failed", "product", product.id, "error", String(err));
    }
  });
});
