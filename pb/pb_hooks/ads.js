/// <reference path="../pb_data/types.d.ts" />

/**
 * Spotlight ad helpers shared by ads.pb.js and the payments webhook.
 * (Not a .pb.js file, so PocketBase only loads it through require().)
 */

/** Days an unpaid booking is kept before it's cleaned up. */
const ABANDONED_AFTER_DAYS = 3;

/** Fields safe to expose publicly for an ad card. */
function publicAd(ad) {
  return {
    id: ad.id,
    collectionId: ad.collection().id,
    collectionName: ad.collection().name,
    product_name: ad.getString("product_name"),
    tagline: ad.getString("tagline"),
    website_url: ad.getString("website_url"),
    logo: ad.getString("logo"),
  };
}

/** "yourproduct.com" → "https://yourproduct.com"; "" when it isn't a usable URL. */
function normalizeUrl(value) {
  let url = String(value || "").trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  return /^https?:\/\/[^\s/.]+\.[^\s]+$/i.test(url) ? url : "";
}

/** Puts a paid ad live from `paidAt` for its plan's duration (caller saves). */
function activate(app, ad, paidAt) {
  let days = 30;
  try {
    days = app.findRecordById("ad_plans", ad.getString("ad_plan")).getInt("duration_days") || days;
  } catch (_) {
    /* plan was deleted — fall back to 30 days */
  }
  ad.set("status", "active");
  ad.set("starts_at", paidAt);
  ad.set("ends_at", paidAt.addDate(0, 0, days));
}

/** Marks finished ads expired and clears out bookings that were never paid. */
function sweep(app) {
  const now = new DateTime();
  app
    .db()
    .newQuery("UPDATE advertisements SET status = 'expired' WHERE status = 'active' AND ends_at != '' AND ends_at <= {:now}")
    .bind({ now: now.string() })
    .execute();

  const cutoff = now.addDate(0, 0, -ABANDONED_AFTER_DAYS).string();
  app.findRecordsByFilter("advertisements", "status = 'pending_payment' && created < {:cutoff}", "", 100, 0, { cutoff: cutoff }).forEach((ad) => {
    app.findRecordsByFilter("payments", "advertisement = {:ad} && status = 'pending'", "", 0, 0, { ad: ad.id }).forEach((payment) => {
      payment.set("status", "cancelled");
      app.save(payment);
    });
    app.delete(ad);
  });
}

/** Spotlight ad orders: a paid order puts the ad live, a refund takes it down. */
function fulfil(txApp, payment, event, order, attrs) {
  const ad = txApp.findRecordById("advertisements", payment.getString("advertisement"));
  payment.set("provider_payment_id", String(order.id));
  payment.set("provider_data", attrs);

  if (event === "order_created") {
    if (attrs.status !== "paid" || payment.getString("status") === "paid") return; // not paid yet / duplicate delivery
    const paidAt = new DateTime();
    payment.set("status", "paid");
    payment.set("paid_at", paidAt);
    payment.set("amount", Number(attrs.total || 0) / 100);
    payment.set("currency", attrs.currency || payment.getString("currency"));
    txApp.save(payment);
    activate(txApp, ad, paidAt);
    txApp.save(ad);
  } else {
    if (payment.getString("status") !== "paid") return;
    payment.set("status", "refunded");
    txApp.save(payment);
    ad.set("status", "cancelled");
    txApp.save(ad);
  }
}

module.exports = { publicAd, normalizeUrl, activate, fulfil, sweep };
