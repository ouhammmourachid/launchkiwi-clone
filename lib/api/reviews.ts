import { getPB } from '@/lib/pb/client';
import { Review, ReviewSchema, ReviewCreateSchema, ListResponseSchema } from '@/lib/types/pocketbase';
import { isAuthenticated } from './auth';

export async function getReviewsByProduct(productId: string, options?: { page?: number; perPage?: number }): Promise<{ success: boolean; error?: string; data?: { page: number; perPage: number; totalItems: number; totalPages: number; items: Review[] } }> {
  try {
    const pb = getPB();
    const res = await pb.collection('reviews').getList(options?.page ?? 1, options?.perPage ?? 20, {
      filter: `product = "${productId}"`,
      sort: '-published_at',
    });
    const parsed = ListResponseSchema(ReviewSchema).parse(res);
    return { success: true, data: parsed };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch reviews' };
  }
}

export async function createReview(data: { product: string; rating: number; title?: string; content: string }): Promise<{ success: boolean; error?: string; data?: Review }> {
  try {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };
    const pb = getPB();
    const parsed = ReviewCreateSchema.parse(data);
    const record = await pb.collection('reviews').create({
      ...parsed,
      author: (pb.authStore.model as any)?.id,
      status: 'pending',
    });
    return { success: true, data: ReviewSchema.parse(record) };
  } catch (err: any) {
    const msg = err?.issues ? err.issues.map((i: any) => i.message).join(', ') : err?.message || 'Failed to create review';
    return { success: false, error: msg };
  }
}
