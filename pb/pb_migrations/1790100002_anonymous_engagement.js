/// <reference path="../pb_data/types.d.ts" />

/**
 * Lets visitors take part without an account:
 *  - votes: guests vote under a random browser id sent as the `X-Visitor-Id`
 *    header and stored in `visitor_hash`. Rules only ever match a guest's own
 *    votes (the `!= ''` guards stop `'' = ''` from matching every guest vote).
 *  - comments: guests comment under a display name; their comments stay
 *    `pending` until an admin approves them. Only approved comments are listed.
 */
const OWN_VOTE =
  "(user != '' && user = @request.auth.id) || " +
  "(visitor_hash != '' && visitor_hash = @request.headers.x_visitor_id)";

migrate(
  (app) => {
    // ── votes ──────────────────────────────────────────────────────────────
    const votes = app.findCollectionByNameOrId("votes");
    votes.listRule = OWN_VOTE;
    votes.viewRule = OWN_VOTE;
    // `visitor_hash` is hidden, so clients can't set it: pb_hooks copy it from
    // the header (and validate it) after this rule passes.
    votes.createRule =
      "(@request.auth.id != '' && user = @request.auth.id) || " +
      "(@request.auth.id = '' && user = '' && @request.headers.x_visitor_id != '')";
    votes.deleteRule = OWN_VOTE;
    votes.indexes = [
      "CREATE UNIQUE INDEX `idx_votes_product_user` ON `votes` (`product`, `user`) WHERE `user` != ''",
      "CREATE UNIQUE INDEX `idx_votes_product_visitor` ON `votes` (`product`, `visitor_hash`) WHERE `visitor_hash` != ''",
      "CREATE INDEX `idx_votes_user` ON `votes` (`user`)",
      "CREATE INDEX `idx_votes_product_ip` ON `votes` (`product`, `ip_hash`)",
    ];
    app.save(votes);

    // ── comments ───────────────────────────────────────────────────────────
    const comments = app.findCollectionByNameOrId("comments");
    comments.fields.getByName("author").required = false;
    comments.fields.add(new TextField({ name: "author_name", max: 50 }));
    comments.fields.add(
      new SelectField({ name: "status", values: ["pending", "approved", "rejected"], maxSelect: 1, required: true }),
    );
    comments.listRule = "status = 'approved' || @request.auth.is_admin = true";
    comments.viewRule = comments.listRule;
    comments.createRule = ""; // guests allowed; pb_hooks set author/status
    comments.updateRule = "author != '' && author = @request.auth.id";
    comments.deleteRule = "(author != '' && author = @request.auth.id) || @request.auth.is_admin = true";
    comments.indexes = [
      "CREATE INDEX `idx_comments_product_status_created` ON `comments` (`product`, `status`, `created`)",
    ];
    app.save(comments);

    // Everything posted before moderation existed came from signed-in users.
    app.db().newQuery("UPDATE comments SET status = 'approved' WHERE status = '' OR status IS NULL").execute();
  },
  (app) => {
    app.db().newQuery("DELETE FROM comments WHERE author = '' OR author IS NULL").execute();
    const comments = app.findCollectionByNameOrId("comments");
    comments.fields.removeByName("author_name");
    comments.fields.removeByName("status");
    comments.fields.getByName("author").required = true;
    comments.listRule = "";
    comments.viewRule = "";
    comments.createRule = "@request.auth.id != '' && author = @request.auth.id";
    comments.updateRule = "author = @request.auth.id";
    comments.deleteRule = "author = @request.auth.id || @request.auth.is_admin = true";
    comments.indexes = ["CREATE INDEX `idx_comments_product_created` ON `comments` (`product`, `created`)"];
    app.save(comments);

    app.db().newQuery("DELETE FROM votes WHERE user = '' OR user IS NULL").execute();
    const votes = app.findCollectionByNameOrId("votes");
    votes.listRule = "user = @request.auth.id";
    votes.viewRule = "user = @request.auth.id";
    votes.createRule = "@request.auth.id != '' && user = @request.auth.id";
    votes.deleteRule = "user = @request.auth.id";
    votes.indexes = [
      "CREATE UNIQUE INDEX `idx_votes_product_user` ON `votes` (`product`, `user`) WHERE `user` != ''",
      "CREATE INDEX `idx_votes_user` ON `votes` (`user`)",
    ];
    app.save(votes);
  },
);
