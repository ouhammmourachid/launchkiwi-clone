/// <reference path="../pb_data/types.d.ts" />

/**
 * Plan feature lists seeded from the scraped data still named the old brand
 * ("Permanent listing on LaunchKiwi"); they're shown on /launch and /pricing.
 */
function rebrand(app, from, to) {
  app.findAllRecords("pricing_plans").forEach((plan) => {
    // JSON fields come back as raw bytes from get(); getString() gives the JSON text.
    const features = JSON.parse(plan.getString("features") || "[]");
    if (!Array.isArray(features)) return;
    const next = features.map((f) => String(f).split(from).join(to));
    if (JSON.stringify(next) === JSON.stringify(features)) return;
    plan.set("features", next);
    app.save(plan);
  });
}

migrate(
  (app) => rebrand(app, "LaunchKiwi", "LaunchDunes"),
  (app) => rebrand(app, "LaunchDunes", "LaunchKiwi"),
);
