/// <reference path="../pb_data/types.d.ts" />

/**
 * Editorial reviews get their own page (/p/<slug>/review), laid out after
 * launchkiwi.com: key takeaways, the long-form body (`content`), per-criterion
 * scores, best for / not ideal for, pros & cons and a closing verdict.
 *
 *  - takeaways, pros, cons: string[]
 *  - scores: { label: string, score: number (0–10), note: string }[]
 */
const JSON_FIELDS = ["takeaways", "scores", "pros", "cons"];
const TEXT_FIELDS = ["best_for", "not_ideal_for", "verdict"];

migrate(
  (app) => {
    const reviews = app.findCollectionByNameOrId("reviews");
    JSON_FIELDS.forEach((name) => reviews.fields.add(new JSONField({ name, maxSize: 256 * 1024 })));
    TEXT_FIELDS.forEach((name) => reviews.fields.add(new TextField({ name, max: 2000 })));
    app.save(reviews);
  },
  (app) => {
    const reviews = app.findCollectionByNameOrId("reviews");
    [...JSON_FIELDS, ...TEXT_FIELDS].forEach((name) => reviews.fields.removeByName(name));
    app.save(reviews);
  },
);
