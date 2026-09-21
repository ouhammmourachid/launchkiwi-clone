import { getPB } from '@/lib/pb/client';
import { Favorite, FavoriteSchema } from '@/lib/types/pocketbase';
import { isAuthenticated } from './auth';

export async function getFavorites(): Promise<{ success: boolean; error?: string; data?: Favorite[] }> {
  try {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };
    const pb = getPB();
    const userId = (pb.authStore.model as any)?.id;
    const res = await pb.collection('favorites').getFullList({
      filter: `user = "${userId}"`,
      sort: '-created',
    });
    return { success: true, data: res.map((r) => FavoriteSchema.parse(r)) };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch favorites' };
  }
}

export async function addFavorite(productId: string): Promise<{ success: boolean; error?: string; data?: Favorite }> {
  try {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };
    const pb = getPB();
    const userId = (pb.authStore.model as any)?.id;
    const record = await pb.collection('favorites').create({ product: productId, user: userId });
    return { success: true, data: FavoriteSchema.parse(record) };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to add favorite' };
  }
}

export async function removeFavorite(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };
    const pb = getPB();
    const userId = (pb.authStore.model as any)?.id;
    const record = await pb.collection('favorites').getFirstListItem(`product = "${productId}" && user = "${userId}"`);
    await pb.collection('favorites').delete(record.id);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to remove favorite' };
  }
}

export async function isFavorited(productId: string): Promise<boolean> {
  try {
    if (!isAuthenticated()) return false;
    const pb = getPB();
    const userId = (pb.authStore.model as any)?.id;
    await pb.collection('favorites').getFirstListItem(`product = "${productId}" && user = "${userId}"`);
    return true;
  } catch {
    return false;
  }
}
