/// <reference path="../pb_data/types.d.ts" />

/**
 * Paid listing upgrades through Lemon Squeezy.
 *
 *  POST /api/checkout                 { plan: "premium", product: "<id>" } → { url }
 *  POST /api/lemonsqueezy/webhook     order_created / order_refunded from Lemon Squeezy
 *
 * A `pending` payment is created before checkout and its id travels through
 * Lemon Squeezy as custom data, so the webhook knows exactly what was bought.
 */

routerAdd(
  "POST",
  "/api/checkout",
  (e) => {
    const ls = require(`${__hooks}/lemonsqueezy.js`);
    const body = e.requestInfo().body;
    const planSlug = String(body.plan || "");
    const productId = String(body.product || "");
    // Paid tiers pick their own launch day: "YYYY-MM-DD", today or later.
    const launchDate = /^\d{4}-\d{2}-\d{2}$/.test(String(body.launch_date || "")) ? String(body.launch_date) : "";

    let plan, product;
    try {
      plan = e.app.findFirstRecordByFilter("pricing_plans", "slug = {:slug} && active = true && price > 0", { slug: planSlug });
    } catch (_) {
      throw new BadRequestError("Unknown plan.");
    }
    try {
      product = e.app.findRecordById("products", productId);
    } catch (_) {
      throw new NotFoundError("Product not found.");
    }
    if (product.getString("maker") !== e.auth.id) throw new ForbiddenError("You can only upgrade your own products.");

    const variantId = ls.variantIdFor(planSlug);
    if (!variantId) throw new BadRequestError("Checkout isn't configured for the " + plan.getString("name") + " plan yet.");

    const payment = new Record(e.app.findCollectionByNameOrId("payments"));
    payment.set("user", e.auth.id);
    payment.set("product", product.id);
    payment.set("pricing_plan", plan.id);
    payment.set("payment_type", "listing");
    payment.set("provider", "lemonsqueezy");
    payment.set("amount", plan.getFloat("price"));
    payment.set("currency", plan.getString("currency") || "USD");
    payment.set("status", "pending");
    e.app.save(payment);

    let checkout;
    try {
      checkout = ls.createCheckout({
        variantId: variantId,
        email: e.auth.email(),
        name: e.auth.getString("name"),
        custom: { payment_id: payment.id, launch_date: launchDate },
        redirectUrl: ls.env("APP_URL", "http://localhost:3000") + "/account?payment=success",
      });
    } catch (err) {
      e.app.logger().error("lemonsqueezy checkout failed", "payment", payment.id, "error", String(err));
      payment.set("status", "failed");
      e.app.save(payment);
      throw new ApiError(502, "Couldn't start checkout. Please try again in a moment.");
    }

    payment.set("checkout_id", checkout.id);
    e.app.save(payment);
    return e.json(200, { url: checkout.url });
  },
  $apis.requireAuth(),
);

routerAdd("POST", "/api/lemonsqueezy/webhook", (e) => {
  const ls = require(`${__hooks}/lemonsqueezy.js`);
  const raw = toString(e.request.body);
  if (!ls.isValidSignature(raw, e.request.header.get("X-Signature"))) {
    throw new UnauthorizedError("Invalid signature.");
  }

  const payload = JSON.parse(raw);
  const event = payload.meta && payload.meta.event_name;
  const paymentId = String((payload.meta && payload.meta.custom_data && payload.meta.custom_data.payment_id) || "");
  const order = payload.data || {};
  const attrs = order.attributes || {};

  // Always 200 for events we don't act on, so Lemon Squeezy doesn't retry them.
  if (event !== "order_created" && event !== "order_refunded") return e.json(200, { ignored: event });

  let payment;
  try {
    payment = e.app.findRecordById("payments", paymentId);
  } catch (_) {
    e.app.logger().warn("lemonsqueezy webhook for unknown payment", "event", event, "payment", paymentId, "order", order.id);
    return e.json(200, { ignored: "unknown payment" });
  }

  e.app.runInTransaction((txApp) => {
    const product = txApp.findRecordById("products", payment.getString("product"));
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

      const plan = txApp.findRecordById("pricing_plans", payment.getString("pricing_plan"));
      ls.applyPlan(product, plan, paidAt);
      ls.scheduleLaunch(product, String(payload.meta.custom_data.launch_date || ""), paidAt);
      // Paid tiers skip badge verification: the launch goes public on its date.
      if (plan.getBool("instant_approval")) {
        const u = require(`${__hooks}/utils.js`);
        u.publishProduct(txApp, product, product.getDateTime("launch_date"), plan.getString("slug"));
      }
      txApp.save(product);
    } else {
      if (payment.getString("status") !== "paid") return;
      payment.set("status", "refunded");
      txApp.save(payment);
      ls.recomputePlanPerks(txApp, product);
      ls.revertToFreeIfUnverified(txApp, product);
      txApp.save(product);
    }
  });

  return e.json(200, { ok: true });
});
