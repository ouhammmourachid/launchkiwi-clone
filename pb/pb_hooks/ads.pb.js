/// <reference path="../pb_data/types.d.ts" />

/**
 * Sidebar spotlight ads (/advertise).
 *
 *  POST /api/ads/checkout      multipart { plan, product_name, tagline, website_url, email, logo } → { url }
 *  GET  /api/ads/spotlight     ?limit=N different live ads in random order (counts impressions) → { items }
 *  GET  /api/ads/recent        recent advertisers for the "spotlight rotation" chips → { items }
 *  GET  /api/ads/{id}/click    counts a click and redirects to the advertiser
 *
 * No account needed to book: a guest pays with their contact email. Signed-in
 * users also own the ad. The Lemon Squeezy webhook (payments.pb.js) puts the ad
 * live; a cron expires finished ads and clears abandoned bookings.
 */

routerAdd("POST", "/api/ads/checkout", (e) => {
  const ads = require(`${__hooks}/ads.js`);
  const ls = require(`${__hooks}/lemonsqueezy.js`);
  const body = e.requestInfo().body;

  const planSlug = String(body.plan || "");
  const name = String(body.product_name || "").trim();
  const tagline = String(body.tagline || "").trim();
  const url = ads.normalizeUrl(body.website_url);
  const email = String(body.email || "").trim().toLowerCase();
  let logo = null;
  try {
    logo = e.findUploadedFiles("logo")[0] || null;
  } catch (_) {
    /* no file in the form */
  }

  let plan;
  try {
    plan = e.app.findFirstRecordByFilter("ad_plans", "slug = {:slug} && active = true", { slug: planSlug });
  } catch (_) {
    throw new BadRequestError("Please pick a plan.");
  }
  if (name.length < 2 || name.length > 80) throw new BadRequestError("Please enter your product name.");
  if (tagline.length < 5 || tagline.length > 140) throw new BadRequestError("Please enter a one-line tagline (5–140 characters).");
  if (!url) throw new BadRequestError("Please enter a valid website URL.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BadRequestError("Please enter a valid contact email.");
  if (!logo) throw new BadRequestError("Please upload your logo.");

  const variantId = ls.variantIdFor(planSlug);
  if (!variantId) throw new BadRequestError("Checkout isn't configured for the " + plan.getString("name") + " plan yet.");

  const owner = e.auth && e.auth.collection().name === "users" ? e.auth.id : "";

  const ad = new Record(e.app.findCollectionByNameOrId("advertisements"));
  ad.set("owner", owner);
  ad.set("ad_plan", plan.id);
  ad.set("product_name", name);
  ad.set("tagline", tagline);
  ad.set("website_url", url);
  ad.set("contact_email", email);
  ad.set("logo", logo);
  ad.set("status", "pending_payment");
  try {
    e.app.save(ad);
  } catch (err) {
    throw new BadRequestError("Your logo must be a PNG, JPG, WebP or SVG image under 5 MB.");
  }

  const payment = new Record(e.app.findCollectionByNameOrId("payments"));
  payment.set("user", owner);
  payment.set("advertisement", ad.id);
  payment.set("payment_type", "advertising");
  payment.set("provider", "lemonsqueezy");
  payment.set("amount", plan.getFloat("price"));
  payment.set("currency", plan.getString("currency") || "USD");
  payment.set("status", "pending");
  e.app.save(payment);

  let checkout;
  try {
    checkout = ls.createCheckout({
      variantId: variantId,
      email: email,
      name: owner ? e.auth.getString("name") : "",
      custom: { payment_id: payment.id },
      redirectUrl: ls.env("APP_URL", "http://localhost:3000") + "/advertise?booked=1",
    });
  } catch (err) {
    e.app.logger().error("lemonsqueezy ad checkout failed", "payment", payment.id, "error", String(err));
    payment.set("status", "failed");
    e.app.save(payment);
    throw new ApiError(502, "Couldn't start checkout. Please try again in a moment.");
  }

  payment.set("checkout_id", checkout.id);
  e.app.save(payment);
  return e.json(200, { url: checkout.url });
});

routerAdd("GET", "/api/ads/spotlight", (e) => {
  const ads = require(`${__hooks}/ads.js`);
  const limit = Math.min(Math.max(parseInt(e.request.url.query().get("limit"), 10) || 1, 1), 8);
  // Copy into a plain JS array: swapping elements of the Go slice in place duplicates them.
  const live = [];
  e.app.findRecordsByFilter("advertisements", "status = 'active' && ends_at > @now", "", 100, 0).forEach((ad) => live.push(ad));

  // Shuffle, then show `limit` different ads; each shown ad counts an impression.
  for (let i = live.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = live[i];
    live[i] = live[j];
    live[j] = tmp;
  }
  const picked = live.slice(0, limit);
  picked.forEach((ad) => {
    e.app.db().newQuery("UPDATE advertisements SET impressions = COALESCE(impressions, 0) + 1 WHERE id = {:id}").bind({ id: ad.id }).execute();
  });
  return e.json(200, { items: picked.map(ads.publicAd) });
});

routerAdd("GET", "/api/ads/recent", (e) => {
  const ads = require(`${__hooks}/ads.js`);
  const seen = {};
  const items = [];
  e.app.findRecordsByFilter("advertisements", "status = 'active' || status = 'expired'", "-starts_at", 30, 0).forEach((ad) => {
    const key = ad.getString("product_name").toLowerCase();
    if (seen[key] || items.length >= 8) return;
    seen[key] = true;
    items.push(ads.publicAd(ad));
  });
  return e.json(200, { items: items });
});

routerAdd("GET", "/api/ads/{id}/click", (e) => {
  let ad;
  try {
    ad = e.app.findRecordById("advertisements", e.request.pathValue("id"));
  } catch (_) {
    throw new NotFoundError("Ad not found.");
  }
  const status = ad.getString("status");
  if (status !== "active" && status !== "expired") throw new NotFoundError("Ad not found.");

  e.app.db().newQuery("UPDATE advertisements SET clicks = COALESCE(clicks, 0) + 1 WHERE id = {:id}").bind({ id: ad.id }).execute();
  return e.redirect(302, ad.getString("website_url"));
});

cronAdd("ads_sweep", "*/10 * * * *", () => {
  const ads = require(`${__hooks}/ads.js`);
  ads.sweep($app);
});
