/**
 * View models consumed by UI components — decoupled from the raw
 * PocketBase record shapes so components don't depend on the schema.
 */

import type { PricingModel, ProductStatus } from "@/lib/types/records";

export type ProductBadge = "PRIORITY" | "PREMIUM";

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  websiteUrl: string;
  logoUrl: string | null;
  category: { name: string; slug: string } | null;
  tags: string[];
  pricing: PricingModel | null;
  upvotes: number;
  badge: ProductBadge | null;
  launchedAt: string;
  /** Outbound link passes SEO value (verified badge or paid plan); otherwise rel="nofollow". */
  dofollow: boolean;
}

/** A launch as its maker sees it, including hidden (badge-pending) ones. */
export interface MyLaunch extends ProductSummary {
  status: ProductStatus;
  /** Free launch waiting for the badge on the maker's site. */
  needsBadge: boolean;
  badgeVerified: boolean;
  /** Empty until the launch has a queue slot. */
  launchDate: string;
}

export interface ProductDetail extends ProductSummary {
  /** Plain-text paragraphs (HTML is stripped server-side for safety). */
  description: string[];
  makerId: string;
}

export interface ReviewSummary {
  id: string;
  title: string;
  rating: number;
  publishedAt: string;
  /** Editorial HTML — only published reviews written by admins are exposed. */
  contentHtml: string;
  product: ProductSummary | null;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  /** False until a moderator approves it (guest comments). */
  approved: boolean;
  /** `id` is empty for guests. */
  author: { id: string; name: string; avatarUrl: string | null };
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface SiteStats {
  products: number;
  upvotes: number;
  users: number;
  subscribers: number;
}

export interface PricingPlan {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}
