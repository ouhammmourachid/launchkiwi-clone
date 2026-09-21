import { getPB } from '@/lib/pb/client';
import { z } from 'zod';
import {
  Product, ProductSchema, ProductCreateSchema,
  ListResponseSchema,
} from '@/lib/types/pocketbase';

export async function getProducts(options?: {
  page?: number; perPage?: number; filter?: string; sort?: string;
}): Promise<{ success: boolean; error?: string; data?: { page: number; perPage: number; totalItems: number; totalPages: number; items: Product[] } }> {
  try {
    const pb = getPB();
    const res = await pb.collection('products').getList(options?.page ?? 1, options?.perPage ?? 20, {
      filter: options?.filter,
      sort: options?.sort,
    });
    const parsed = ListResponseSchema(ProductSchema).parse(res);
    return { success: true, data: parsed };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch products' };
  }
}

export async function getProductBySlug(slug: string): Promise<{ success: boolean; error?: string; data?: Product }> {
  try {
    const pb = getPB();
    const record = await pb.collection('products').getFirstListItem(`slug = "${slug}"`);
    const parsed = ProductSchema.parse(record);
    return { success: true, data: parsed };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Product not found' };
  }
}

export async function searchProducts(query: string): Promise<{ success: boolean; error?: string; data?: { items: Product[] } }> {
  try {
    const pb = getPB();
    const res = await pb.collection('products').getFullList({
      filter: `name ~ "${query}" || tagline ~ "${query}" || description ~ "${query}"`,
    });
    const parsed = z.array(ProductSchema).parse(res);
    return { success: true, data: { items: parsed } };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Search failed' };
  }
}
