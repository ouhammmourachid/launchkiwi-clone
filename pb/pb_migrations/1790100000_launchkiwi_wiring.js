/// <reference path="../pb_data/types.d.ts" />

/**
 * Wires the starter schema for the Next.js frontend:
 *  - users: `is_admin` flag (referenced by existing rules), public profiles,
 *    and rules that stop users from granting themselves admin.
 *  - products: logo optional (submit form + seed may not have one).
 *  - reviews: editorial 1–10 decimal ratings.
 *  - votes: one vote per signed-in user per product.
 *  - comments: new collection for product discussion.
 */
migrate(
  (app) => {
    // ── users ──────────────────────────────────────────────────────────────
    const users = app.findCollectionByNameOrId("users");
    if (!users.fields.getByName("is_admin")) {
      users.fields.add(new BoolField({ name: "is_admin" }));
    }
    // Profiles (name/avatar) are public so comments can show their author.
    // Email stays hidden unless the user opts into emailVisibility.
    users.viewRule = "";
    users.createRule = "@request.body.is_admin:isset = false";
    users.updateRule = "id = @request.auth.id && @request.body.is_admin:isset = false";
    app.save(users);

    // ── products ───────────────────────────────────────────────────────────
    const products = app.findCollectionByNameOrId("products");
    products.fields.getByName("logo").required = false;
    app.save(products);

    // ── reviews ────────────────────────────────────────────────────────────
    const reviews = app.findCollectionByNameOrId("reviews");
    const rating = reviews.fields.getByName("rating");
    rating.onlyInt = false;
    rating.min = 1;
    rating.max = 10;
    reviews.indexes = [
      "CREATE INDEX `idx_reviews_status_published` ON `reviews` (`status`, `published_at`)",
      "CREATE INDEX `idx_reviews_product` ON `reviews` (`product`)",
    ];
    app.save(reviews);

    // ── votes ──────────────────────────────────────────────────────────────
    const votes = app.findCollectionByNameOrId("votes");
    const visitorHash = votes.fields.getByName("visitor_hash");
    if (visitorHash) visitorHash.required = false;
    votes.listRule = "user = @request.auth.id";
    votes.viewRule = "user = @request.auth.id";
    votes.createRule = "@request.auth.id != '' && user = @request.auth.id";
    votes.deleteRule = "user = @request.auth.id";
    votes.indexes = [
      "CREATE UNIQUE INDEX `idx_votes_product_user` ON `votes` (`product`, `user`) WHERE `user` != ''",
      "CREATE INDEX `idx_votes_user` ON `votes` (`user`)",
    ];
    app.save(votes);

    // ── favorites ──────────────────────────────────────────────────────────
    const favorites = app.findCollectionByNameOrId("favorites");
    favorites.createRule = "@request.auth.id != '' && user = @request.auth.id";
    app.save(favorites);

    // ── comments (new) ─────────────────────────────────────────────────────
    const comments = new Collection({
      type: "base",
      name: "comments",
      listRule: "",
      viewRule: "",
      createRule: "@request.auth.id != '' && author = @request.auth.id",
      updateRule: "author = @request.auth.id",
      deleteRule: "author = @request.auth.id || @request.auth.is_admin = true",
      fields: [
        { name: "product", type: "relation", collectionId: products.id, maxSelect: 1, required: true, cascadeDelete: true },
        { name: "author", type: "relation", collectionId: users.id, maxSelect: 1, required: true, cascadeDelete: true },
        { name: "content", type: "text", required: true, min: 1, max: 1000 },
        { name: "created", type: "autodate", onCreate: true },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
      indexes: ["CREATE INDEX `idx_comments_product_created` ON `comments` (`product`, `created`)"],
    });
    app.save(comments);
  },
  (app) => {
    const comments = app.findCollectionByNameOrId("comments");
    app.delete(comments);

    const users = app.findCollectionByNameOrId("users");
    users.fields.removeByName("is_admin");
    users.viewRule = "id = @request.auth.id";
    users.createRule = "";
    users.updateRule = "id = @request.auth.id";
    app.save(users);

    const products = app.findCollectionByNameOrId("products");
    products.fields.getByName("logo").required = true;
    app.save(products);

    const reviews = app.findCollectionByNameOrId("reviews");
    const rating = reviews.fields.getByName("rating");
    rating.onlyInt = true;
    rating.min = null;
    rating.max = null;
    reviews.indexes = [];
    app.save(reviews);

    const votes = app.findCollectionByNameOrId("votes");
    votes.listRule = "@request.auth.id != ''";
    votes.viewRule = "@request.auth.id != ''";
    votes.createRule = "";
    votes.deleteRule = "@request.auth.is_admin = true";
    votes.indexes = ["CREATE UNIQUE INDEX `idx_votes_product_visitor` ON `votes` (`product`,`visitor_hash`)"];
    app.save(votes);

    const favorites = app.findCollectionByNameOrId("favorites");
    favorites.createRule = "user = @request.auth.id";
    app.save(favorites);
  },
);
