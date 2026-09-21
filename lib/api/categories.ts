import { getPB } from '@/lib/pb/client';
import { Category, CategorySchema, ListResponseSchema } from '@/lib/types/pocketbase';

export async function getCategories(options?: { page?: number; perPage?: number; filter?: string; sort?: string }): Promise<{ success: boolean; error?: string; data?: { page: number; perPage: number; totalItems: number; totalPages: number; items: Category[] } }> {
  try {
    const pb = getPB();
    const res = await pb.collection('categories').getList(options?.page ?? 1, options?.perPage ?? 20, {
      filter: options?.filter,
      sort: options?.sort ?? '-created',
    });
    const parsed = ListResponseSchema(CategorySchema).parse(res);
    return { success: true, data: parsed };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch categories' };
  }
}

export async function getCategoryBySlug(slug: string): Promise<{ success: boolean; error?: string; data?: Category }> {
  try {
    const pb = getPB();
    const record = await pb.collection('categories').getFirstListItem(`slug = "${slug}"`);
    const parsed = CategorySchema.parse(record);
    return { success: true, data: parsed };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Category not found' };
  }
}
