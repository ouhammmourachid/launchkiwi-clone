/**
 * Per-user interactions: votes, favorites, comments, newsletter.
 * Ownership is enforced server-side (API rules + pb_hooks); passing the
 * user id here just satisfies the create rules.
 */

import { PRODUCT_EXPAND, toComment, toProductSummary } from "@/lib/api/mappers";
import { getPB } from "@/lib/pb/client";
import type { Comment, ProductSummary } from "@/lib/types/models";

// ── Votes ───────────────────────────────────────────────────────────────

export async function listVotedProductIds(userId: string): Promise<string[]> {
  const pb = getPB();
  const votes = await pb.collection("votes").getFullList({
    filter: pb.filter("user = {:user}", { user: userId }),
    fields: "product",
  });
  return votes.map((v) => v.product);
}

export async function addVote(productId: string, userId: string): Promise<void> {
  await getPB().collection("votes").create({ product: productId, user: userId });
}

export async function removeVote(productId: string, userId: string): Promise<void> {
  const pb = getPB();
  const vote = await pb
    .collection("votes")
    .getFirstListItem(pb.filter("product = {:product} && user = {:user}", { product: productId, user: userId }));
  await pb.collection("votes").delete(vote.id);
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

export async function listComments(productId: string): Promise<Comment[]> {
  const pb = getPB();
  const items = await pb.collection("comments").getFullList({
    filter: pb.filter("product = {:product}", { product: productId }),
    sort: "-created",
    expand: "author",
  });
  return items.map(toComment);
}

export async function addComment(productId: string, userId: string, content: string): Promise<Comment> {
  const record = await getPB()
    .collection("comments")
    .create({ product: productId, author: userId, content }, { expand: "author" });
  return toComment(record);
}

export async function deleteComment(commentId: string): Promise<void> {
  await getPB().collection("comments").delete(commentId);
}

// ── Newsletter ──────────────────────────────────────────────────────────

export async function subscribeToNewsletter(email: string): Promise<void> {
  await getPB().collection("subscribers").create({ email, source: "website" });
}
