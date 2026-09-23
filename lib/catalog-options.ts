/** Browse options shared by the server query layer and the filter UI. */

import type { PricingModel } from "@/lib/types/records";

export const PRODUCT_SORTS = {
  new: { label: "Newest launched", sort: "-launch_date,-upvotes" },
  top: { label: "Most upvoted", sort: "-upvotes,-launch_date" },
  trending: { label: "Trending this month", sort: "-upvotes,-launch_date" },
} as const;
export type ProductSort = keyof typeof PRODUCT_SORTS;

export const PRICE_FILTERS: PricingModel[] = ["Free", "Freemium", "Paid"];
