/// <reference path="../pb_data/types.d.ts" />

/**
 * The starter schema shipped every JSON field with maxSize = 1 byte (unusable)
 * and marked plan prices as required — PocketBase treats 0 as blank for
 * required numbers, so a free plan could never be saved.
 */
const JSON_FIELDS = [
  ["submissions", "scraped_metadata"],
  ["pricing_plans", "features"],
  ["payments", "provider_data"],
  ["ad_plans", "features"],
  ["site_settings", "json_value"],
  ["product_events", "metadata"],
];
const PRICE_FIELDS = [
  ["pricing_plans", "price"],
  ["ad_plans", "price"],
];

function apply(app, { jsonMaxSize, priceRequired }) {
  JSON_FIELDS.forEach(([name, field]) => {
    const col = app.findCollectionByNameOrId(name);
    col.fields.getByName(field).maxSize = jsonMaxSize;
    app.save(col);
  });
  PRICE_FIELDS.forEach(([name, field]) => {
    const col = app.findCollectionByNameOrId(name);
    const f = col.fields.getByName(field);
    f.required = priceRequired;
    f.min = priceRequired ? null : 0;
    app.save(col);
  });
}

migrate(
  (app) => apply(app, { jsonMaxSize: 1024 * 1024, priceRequired: false }),
  (app) => apply(app, { jsonMaxSize: 1, priceRequired: true }),
);
