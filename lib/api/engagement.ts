/**
 * Per-user interactions: votes, favorites, comments, newsletter.
 * Ownership is enforced server-side (API rules + pb_hooks); passing the
 * user id here just satisfies the create rules.
 */

import { PRODUCT_EXPAND, toComment, toProductSummary } from "@/lib/api/mappers";
import { getPB } from "@/lib/pb/client";
import type { Comment, ProductSummary } from "@/lib/types/models";
import { visitorHeaders } from "@/lib/utils/visitor";

// ── Votes ───────────────────────────────────────────────────────────────
// Guests vote too: every vote request carries the browser's visitor id, and
// the API rules scope list/delete to the caller's own votes (as a member
// and/or as this browser), so no owner filter is needed here.

export async function listVotedProductIds(): Promise<string[]> {
  const votes = await getPB().collection("votes").getFullList({ fields: "product", headers: visitorHeaders() });
  return votes.map((v) => v.product);
}

/** `userId` is null for guests; the vote is then tied to this browser. */
export async function addVote(productId: string, userId: string | null): Promise<void> {
  await getPB()
    .collection("votes")
    .create({ product: productId, user: userId ?? "" }, { headers: visitorHeaders() });
}

export async function removeVote(productId: string): Promise<void> {
  const pb = getPB();
  const options = { headers: visitorHeaders() };
  const votes = await pb
    .collection("votes")
    .getFullList({ ...options, filter: pb.filter("product = {:product}", { product: productId }), fields: "id" });
  await Promise.all(votes.map((v) => pb.collection("votes").delete(v.id, options)));
}

// ── Favorites ───────────────────────────────────────────────────────────

export async function listFavoriteProducts(userId: string): Promise<ProductSummary[]> {
  const pb = getPB();
  const favorites = await pb.collection("favorites").getFullList({
    filter: pb.filter("user = {:user}", { user: userId }),
    sort: "-created",
    expand: `product,${PRODUCT_EXPAND.split(",").map((f) => `product.${f}`).join(",")}`,
  });
  return favorites.flatMap((f) => (f.expand?.product ? [toProductSummary(f.expand.product)] : []));
}

export async function addFavorite(productId: string, userId: string): Promise<void> {
  await getPB().collection("favorites").create({ product: productId, user: userId });
}

export async function removeFavorite(productId: string, userId: string): Promise<void> {
  const pb = getPB();
  const favorite = await pb
    .collection("favorites")
    .getFirstListItem(pb.filter("product = {:product} && user = {:user}", { product: productId, user: userId }));
  await pb.collection("favorites").delete(favorite.id);
}

// ── Comments ────────────────────────────────────────────────────────────

/** Approved comments only — guest comments appear once a moderator approves them. */
export async function listComments(productId: string): Promise<Comment[]> {
  const pb = getPB();
  const items = await pb.collection("comments").getFullList({
    filter: pb.filter("product = {:product} && status = 'approved'", { product: productId }),
    sort: "-created",
    expand: "author",
  });
  return items.map(toComment);
}

export type NewComment = { content: string } & ({ userId: string } | { authorName: string });

/** Members' comments go live immediately; guests' come back `pending`. */
export async function addComment(productId: string, input: NewComment): Promise<Comment> {
  const author = "userId" in input ? { author: input.userId } : { author_name: input.authorName };
  const record = await getPB()
    .collection("comments")
    .create({ product: productId, content: input.content, ...author }, { expand: "author" });
  return toComment(record);
}

export async function deleteComment(commentId: string): Promise<void> {
  await getPB().collection("comments").delete(commentId);
}

// ── Newsletter ──────────────────────────────────────────────────────────

export async function subscribeToNewsletter(email: string): Promise<void> {
  await getPB().collection("subscribers").create({ email, source: "website" });
}
