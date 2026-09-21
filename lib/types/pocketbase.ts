import { z } from 'zod';

export const PBErrorSchema = z.object({
  code: z.number().optional(),
  message: z.string(),
  data: z.record(z.any()).optional(),
});
export type PBError = z.infer<typeof PBErrorSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  emailVisibility: z.boolean().optional(),
  verified: z.boolean().optional(),
  created: z.string(),
  updated: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const UserCreateSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  passwordConfirm: z.string(),
  name: z.string().optional(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm'],
});
export type UserCreate = z.infer<typeof UserCreateSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  sort_order: z.number().optional(),
  active: z.boolean(),
  created: z.string(),
  updated: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  created: z.string(),
  updated: z.string(),
});
export type Tag = z.infer<typeof TagSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  website_url: z.string().url(),
  tagline: z.string(),
  description: z.string(),
  logo: z.string().optional(),
  screenshots: z.array(z.string()).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  pricing_model: z.enum(['Free', 'Freemium', 'Paid', 'Free Trial', 'Open Source', 'Contact for pricing']).optional(),
  pricing_note: z.string().optional(),
  status: z.enum(['draft', 'pending', 'published', 'rejected', 'archived', 'suspended']).optional(),
  submission_type: z.enum(['self_submitted', 'invited', 'admin_added']).optional(),
  maker: z.string().optional(),
  upvotes: z.number().optional(),
  views: z.number().optional(),
  clicks: z.number().optional(),
  featured: z.boolean().optional(),
  verified: z.boolean().optional(),
  published_at: z.string().optional(),
  created: z.string(),
  updated: z.string(),
});
export type Product = z.infer<typeof ProductSchema>;

export const ProductCreateSchema = z.object({
  name: z.string().min(1, 'Name required'),
  slug: z.string().min(1, 'Slug required'),
  website_url: z.string().url('Invalid URL'),
  tagline: z.string().min(1, 'Tagline required'),
  description: z.string().min(1, 'Description required'),
});
export type ProductCreate = z.infer<typeof ProductCreateSchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  product: z.string(),
  author: z.string(),
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().optional(),
  content: z.string(),
  status: z.enum(['pending', 'published', 'hidden', 'rejected']).optional(),
  is_verified_user: z.boolean().optional(),
  published_at: z.string().optional(),
  created: z.string(),
  updated: z.string(),
});
export type Review = z.infer<typeof ReviewSchema>;

export const ReviewCreateSchema = z.object({
  product: z.string().min(1, 'Product required'),
  rating: z.number().int().min(1, 'Min rating 1').max(5, 'Max rating 5'),
  title: z.string().optional(),
  content: z.string().min(10, 'Review must be at least 10 characters'),
});
export type ReviewCreate = z.infer<typeof ReviewCreateSchema>;

export const FavoriteSchema = z.object({
  id: z.string(),
  product: z.string(),
  user: z.string(),
  created: z.string(),
  updated: z.string(),
});
export type Favorite = z.infer<typeof FavoriteSchema>;

export const VoteSchema = z.object({
  id: z.string(),
  product: z.string(),
  user: z.string().optional(),
  visitor_hash: z.string(),
  voted_at: z.string(),
  created: z.string(),
  updated: z.string(),
});
export type Vote = z.infer<typeof VoteSchema>;

export const LaunchWeekSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  status: z.enum(['upcoming', 'active', 'closed']).optional(),
  description: z.string().optional(),
  is_current: z.boolean().optional(),
  created: z.string(),
  updated: z.string(),
});
export type LaunchWeek = z.infer<typeof LaunchWeekSchema>;

export const LaunchEntrySchema = z.object({
  id: z.string(),
  launch_week: z.string(),
  product: z.string(),
  rank: z.number().optional(),
  week_upvotes: z.number().optional(),
  featured: z.boolean().optional(),
  pinned: z.boolean().optional(),
  created: z.string(),
  updated: z.string(),
});
export type LaunchEntry = z.infer<typeof LaunchEntrySchema>;

export const ListResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    page: z.number(),
    perPage: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    items: z.array(schema),
  });
export type ListResponse<T> = {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
};

export const AuthResponseSchema = z.object({
  record: UserSchema,
  token: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
