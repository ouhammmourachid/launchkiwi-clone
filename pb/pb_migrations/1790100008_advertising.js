/// <reference path="../pb_data/types.d.ts" />

/**
 * Paid homepage spotlight ads (/advertise):
 *  - ad_plans: the two spotlight plans sold on /advertise; older plans are retired.
 *  - advertisements: guest contact email; created only by POST /api/ads/checkout
 *    (pb_hooks/ads.pb.js), activated by the Lemon Squeezy webhook.
 *  - payments: which advertisement an `advertising` payment is for.
 */

const SPOTLIGHT_PLANS = [
  {
    slug: "spotlight-30",
    name: "30 days",
    price: 30,
    duration_days: 30,
    description: "A full month at the top of the feed.",
    features: [
      "Top-of-feed spotlight for a full 30 days",
      "No directory listing required — just your logo & link",
      "Live today — no approval wait",
      "A full month of consistent visibility",
      "$1.00/day — one flat rate, no bidding",
      "One-time payment, no subscription, no auto-renewal",
    ],
  },
  {
    slug: "spotlight-90",
    name: "90 days",
    price: 79,
    duration_days: 90,
    description: "Our lowest daily rate, for a full quarter.",
    features: [
      "Top-of-feed spotlight for a full 90 days",
      "No directory listing required — just your logo & link",
      "Live today — no approval wait",
      "Nearly a full quarter of consistent visibility",
      "$0.88/day — our lowest rate, 12% cheaper per day than the 30-day plan",
      "One-time payment, no subscription, no auto-renewal",
    ],
  },
];

migrate(
  (app) => {
    // ── ad_plans ───────────────────────────────────────────────────────────
    const plans = app.findCollectionByNameOrId("ad_plans");
    const slugs = SPOTLIGHT_PLANS.map((p) => p.slug);
    app.findAllRecords("ad_plans").forEach((plan) => {
      if (slugs.includes(plan.getString("slug"))) return;
      plan.set("active", false);
      app.save(plan);
    });
    SPOTLIGHT_PLANS.forEach((data) => {
      let plan;
      try {
        plan = app.findFirstRecordByFilter("ad_plans", "slug = {:slug}", { slug: data.slug });
      } catch (_) {
        plan = new Record(plans);
      }
      Object.keys(data).forEach((key) => plan.set(key, data[key]));
      plan.set("currency", "USD");
      plan.set("active", true);
      app.save(plan);
    });

    // ── advertisements ─────────────────────────────────────────────────────
    const ads = app.findCollectionByNameOrId("advertisements");
    if (!ads.fields.getByName("contact_email")) {
      ads.fields.add(new EmailField({ name: "contact_email" }));
    }
    // Public reads go through /api/ads/* routes; owners can see their own ads.
    ads.listRule = "owner != '' && owner = @request.auth.id";
    ads.viewRule = "owner != '' && owner = @request.auth.id";
    ads.createRule = null;
    ads.updateRule = null;
    ads.deleteRule = null;
    ads.indexes = ["CREATE INDEX `idx_advertisements_status_ends` ON `advertisements` (`status`, `ends_at`)"];
    app.save(ads);

    // ── payments ───────────────────────────────────────────────────────────
    const payments = app.findCollectionByNameOrId("payments");
    if (!payments.fields.getByName("advertisement")) {
      payments.fields.add(new RelationField({ name: "advertisement", collectionId: ads.id, maxSelect: 1, cascadeDelete: false }));
    }
    app.save(payments);
  },
  (app) => {
    const payments = app.findCollectionByNameOrId("payments");
    payments.fields.removeByName("advertisement");
    app.save(payments);

    const ads = app.findCollectionByNameOrId("advertisements");
    ads.fields.removeByName("contact_email");
    ads.listRule = "status = 'active'";
    ads.viewRule = "status = 'active'";
    ads.createRule = "owner = @request.auth.id";
    ads.updateRule = "owner = @request.auth.id || @request.auth.is_admin = true";
    ads.deleteRule = "owner = @request.auth.id || @request.auth.is_admin = true";
    ads.indexes = [];
    app.save(ads);

    app.findAllRecords("ad_plans").forEach((plan) => {
      plan.set("active", !plan.getString("slug").startsWith("spotlight-"));
      app.save(plan);
    });
  },
);
