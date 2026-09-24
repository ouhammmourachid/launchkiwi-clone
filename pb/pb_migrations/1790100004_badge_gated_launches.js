/// <reference path="../pb_data/types.d.ts" />

/**
 * Free launches now start `pending` until the maker verifies our badge on
 * their site (pb_hooks/badge.pb.js). Hidden launches are visible only to their
 * maker and admins; everyone else sees published products only.
 * Existing self-submitted products get a badge token so they can verify too.
 */
const VISIBLE = "status = 'published' || (maker != '' && maker = @request.auth.id) || @request.auth.is_admin = true";

migrate(
  (app) => {
    const products = app.findCollectionByNameOrId("products");
    products.listRule = VISIBLE;
    products.viewRule = VISIBLE;
    app.save(products);

    app
      .findRecordsByFilter("products", "submission_type = 'self_submitted' && badge_token = ''", "", 0, 0)
      .forEach((product) => {
        product.set("badge_token", "ld_" + $security.randomString(24));
        app.saveNoValidate(product);
      });
  },
  (app) => {
    const products = app.findCollectionByNameOrId("products");
    products.listRule = "";
    products.viewRule = "";
    app.save(products);
  },
);
