/// <reference path="../pb_data/types.d.ts" />

/**
 * Lemon Squeezy helpers for the checkout and webhook routes.
 *
 * Config comes from the environment (loaded from pb/.env by `npm run pb`):
 *   LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_WEBHOOK_SECRET,
 *   LEMONSQUEEZY_VARIANT_<PLAN SLUG> (e.g. LEMONSQUEEZY_VARIANT_PREMIUM),
 *   APP_URL (where buyers land after paying, default http://localhost:3000).
 */

const API = "https://api.lemonsqueezy.com/v1";

function env(name, fallback) {
  const value = String($os.getenv(name) || "").trim();
  if (value) return value;
  if (fallback !== undefined) return fallback;
  throw new Error(name + " is not set.");
}

function variantIdFor(planSlug) {
  return String($os.getenv("LEMONSQUEEZY_VARIANT_" + planSlug.toUpperCase()) || "").trim();
}

/** Creates a hosted checkout and returns `{ id, url }`. */
function createCheckout({ variantId, email, name, custom, redirectUrl }) {
  const res = $http.send({
    url: API + "/checkouts",
    method: "POST",
    timeout: 20,
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: "Bearer " + env("LEMONSQUEEZY_API_KEY"),
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: { email: email, name: name, custom: custom },
          product_options: { redirect_url: redirectUrl },
        },
        relationships: {
          store: { data: { type: "stores", id: env("LEMONSQUEEZY_STORE_ID") } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });
  if (res.statusCode !== 201) {
    throw new Error("Lemon Squeezy checkout failed (" + res.statusCode + "): " + toString(res.body).slice(0, 500));
  }
  return { id: res.json.data.id, url: res.json.data.attributes.url };
}

/** True when `raw` was signed with our webhook secret (X-Signature = hex HMAC-SHA256). */
function isValidSignature(raw, signature) {
  const secret = env("LEMONSQUEEZY_WEBHOOK_SECRET", "");
  if (!secret || !signature) return false;
  return $security.equal($security.hs256(raw, secret), signature);
}

/**
 * Grants a paid plan's perks to a product (caller saves). Only ever raises
 * levels, so an admin-set priority or a longer pin is never downgraded.
 * The pin runs from `paidAt`.
 */
function applyPlan(product, plan, paidAt) {
  product.set("priority_level", Math.max(product.getInt("priority_level"), plan.getInt("priority_level")));
  if (plan.getBool("featured")) product.set("featured", true);
  if (plan.getBool("dofollow")) product.set("dofollow_enabled", true);
  if (plan.getBool("instant_approval")) product.set("instant_approved", true);

  const pinDays = plan.getInt("pin_days");
  if (pinDays > 0) {
    const until = paidAt.addDate(0, 0, pinDays);
    const current = product.getDateTime("featured_until");
    if (current.isZero() || current.before(until)) product.set("featured_until", until);
  }
}

/**
 * Takes a still-queued launch out of the free queue: it goes live on the day
 * the maker picked ("YYYY-MM-DD", UTC midnight), or at `paidAt` when that day
 * is today, past or empty. Products that already launched keep their date.
 */
function scheduleLaunch(product, day, paidAt) {
  const current = product.getDateTime("launch_date");
  if (!current.isZero() && !current.after(paidAt)) return;
  let date = paidAt;
  if (day) {
    const picked = new DateTime(day + " 00:00:00.000Z");
    if (picked.after(paidAt)) date = picked;
  }
  product.set("launch_date", date);
  product.set("published_at", date);
}

/** After a refund: rebuild the product's perks from its remaining paid payments (caller saves). */
function recomputePlanPerks(app, product) {
  product.set("priority_level", 0);
  product.set("featured", false);
  product.set("featured_until", "");
  product.set("dofollow_enabled", false);
  product.set("instant_approved", false);
  const paid = app.findRecordsByFilter("payments", "product = {:p} && status = 'paid'", "", 0, 0, { p: product.id });
  paid.forEach((payment) => {
    try {
      applyPlan(product, app.findRecordById("pricing_plans", payment.getString("pricing_plan")), payment.getDateTime("paid_at"));
    } catch (_) {
      /* plan was deleted */
    }
  });
}

module.exports = { env, variantIdFor, createCheckout, isValidSignature, applyPlan, scheduleLaunch, recomputePlanPerks };
