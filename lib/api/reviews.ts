import { PRODUCT_EXPAND, toReviewDetail, toReviewSummary } from "@/lib/api/mappers";
import { getPB } from "@/lib/pb/client";
import { isNotFound } from "@/lib/pb/errors";
import type { ReviewDetail, ReviewSummary } from "@/lib/types/models";

const REVIEW_EXPAND = `product,${PRODUCT_EXPAND.split(",").map((f) => `product.${f}`).join(",")}`;

/** Editorial reviews. The collection's list rule already hides unpublished ones. */
export async function listPublishedReviews(): Promise<ReviewSummary[]> {
  const items = await getPB().collection("reviews").getFullList({
    filter: 'status = "published"',
    sort: "-published_at",
    expand: REVIEW_EXPAND,
  });
  return items.map(toReviewSummary);
}

export async function getReviewForProduct(productId: string): Promise<ReviewDetail | null> {
  try {
    const pb = getPB();
    const record = await pb
      .collection("reviews")
      .getFirstListItem(pb.filter('product = {:product} && status = "published"', { product: productId }), {
        sort: "-published_at",
      });
    return toReviewDetail(record);
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}
