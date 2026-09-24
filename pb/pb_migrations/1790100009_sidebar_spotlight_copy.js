/// <reference path="../pb_data/types.d.ts" />

/**
 * Spotlight ads moved from the top of the homepage feed to the left/right
 * sidebar slots; update the plan copy shown on /advertise to match.
 */

const COPY = {
  "spotlight-30": {
    description: ["A full month at the top of the feed.", "A full month in the sidebar spotlight."],
    feature: ["Top-of-feed spotlight for a full 30 days", "Sidebar spotlight on the homepage & browse pages for 30 days"],
  },
  "spotlight-90": {
    description: ["Our lowest daily rate, for a full quarter.", "Our lowest daily rate, for a full quarter."],
    feature: ["Top-of-feed spotlight for a full 90 days", "Sidebar spotlight on the homepage & browse pages for 90 days"],
  },
};

function apply(app, from, to) {
  Object.keys(COPY).forEach((slug) => {
    let plan;
    try {
      plan = app.findFirstRecordByFilter("ad_plans", "slug = {:slug}", { slug: slug });
    } catch (_) {
      return;
    }
    const copy = COPY[slug];
    if (plan.getString("description") === copy.description[from]) plan.set("description", copy.description[to]);
    // JSON fields come back as raw bytes from get(); getString() gives the JSON text.
    const features = JSON.parse(plan.getString("features") || "[]");
    plan.set("features", features.map((f) => (f === copy.feature[from] ? copy.feature[to] : f)));
    app.save(plan);
  });
}

migrate(
  (app) => apply(app, 0, 1),
  (app) => apply(app, 1, 0),
);
