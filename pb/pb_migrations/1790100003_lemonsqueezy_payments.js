/// <reference path="../pb_data/types.d.ts" />

/**
 * Payments are written only by the /api/checkout route and the Lemon Squeezy
 * webhook (pb_hooks/payments.pb.js). Clients could previously create their own
 * payment rows, including ones marked `paid`.
 */
const UNIQUE_PROVIDER_ID =
  "CREATE UNIQUE INDEX `idx_payment_provider_id` ON `payments` (`provider`,`provider_payment_id`) WHERE `provider_payment_id` != ''";

migrate(
  (app) => {
    const payments = app.findCollectionByNameOrId("payments");
    payments.createRule = null;
    payments.indexes = [UNIQUE_PROVIDER_ID, "CREATE INDEX `idx_payments_product_status` ON `payments` (`product`, `status`)"];
    app.save(payments);
  },
  (app) => {
    const payments = app.findCollectionByNameOrId("payments");
    payments.createRule = "user = @request.auth.id";
    payments.indexes = [UNIQUE_PROVIDER_ID];
    app.save(payments);
  },
);
