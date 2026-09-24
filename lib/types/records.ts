/**
 * Raw PocketBase record shapes (what the REST API returns).
 * UI code should prefer the view models in `lib/types/models.ts`.
 */

import type PocketBase from "pocketbase";
import type { RecordModel, RecordService } from "pocketbase";

export const PRICING_MODELS = ["Free", "Freemium", "Paid", "Free Trial", "Open Source", "Contact for pricing"] as const;
export type PricingModel = (typeof PRICING_MODELS)[number];

export type ProductStatus = "draft" | "pending" | "published" | "rejected" | "archived" | "suspended";

export interface UserRecord extends RecordModel {
  email: string;
  name: string;
  avatar: string;
  verified: boolean;
  is_admin: boolean;
}

export interface CategoryRecord extends RecordModel {
  name: string;
  slug: string;
  sort_order: number;
  active: boolean;
}

export interface TagRecord extends RecordModel {
  name: string;
  slug: string;
}

export interface ProductRecord extends RecordModel {
  name: string;
  slug: string;
  website_url: string;
  tagline: string;
  description: string;
  logo: string;
  category: string;
  tags: string[];
  pricing_model: PricingModel | "";
  status: ProductStatus;
  maker: string;
  priority_level: number;
  featured: boolean;
  verified: boolean;
  dofollow_enabled: boolean;
  instant_approved: boolean;
  badge_verified: boolean;
  upvotes: number;
  published_at: string;
  launch_date: string;
  expand?: {
    category?: CategoryRecord;
    tags?: TagRecord[];
    maker?: UserRecord;
  };
}

export interface ReviewRecord extends RecordModel {
  product: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  status: "pending" | "published" | "hidden" | "rejected";
  published_at: string;
  expand?: { product?: ProductRecord };
}

export interface CommentRecord extends RecordModel {
  product: string;
  /** Empty for guest comments, which carry `author_name` instead. */
  author: string;
  author_name: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  expand?: { author?: UserRecord };
}

export interface VoteRecord extends RecordModel {
  product: string;
  /** Empty for guest votes, which are tied to a hidden `visitor_hash`. */
  user: string;
}

export interface FavoriteRecord extends RecordModel {
  product: string;
  user: string;
  expand?: { product?: ProductRecord };
}

export interface PricingPlanRecord extends RecordModel {
  name: string;
  slug: string;
  price: number;
  currency: string;
  description: string;
  features: string[] | null;
  featured: boolean;
  pin_days: number;
  priority_level: number;
  active: boolean;
}

export interface SubscriberRecord extends RecordModel {
  email: string;
  active: boolean;
}

export interface CategoryStatsRecord extends RecordModel {
  name: string;
  slug: string;
  products_count: number;
}

export interface SiteStatsRecord extends RecordModel {
  products_count: number;
  votes_count: number;
  users_count: number;
  subscribers_count: number;
}

/** PocketBase client with per-collection record typings. */
export interface TypedPocketBase extends PocketBase {
  collection(idOrName: "users"): RecordService<UserRecord>;
  collection(idOrName: "categories"): RecordService<CategoryRecord>;
  collection(idOrName: "products"): RecordService<ProductRecord>;
  collection(idOrName: "reviews"): RecordService<ReviewRecord>;
  collection(idOrName: "comments"): RecordService<CommentRecord>;
  collection(idOrName: "votes"): RecordService<VoteRecord>;
  collection(idOrName: "favorites"): RecordService<FavoriteRecord>;
  collection(idOrName: "pricing_plans"): RecordService<PricingPlanRecord>;
  collection(idOrName: "subscribers"): RecordService<SubscriberRecord>;
  collection(idOrName: "category_stats"): RecordService<CategoryStatsRecord>;
  collection(idOrName: "site_stats"): RecordService<SiteStatsRecord>;
  collection(idOrName: string): RecordService;
}
