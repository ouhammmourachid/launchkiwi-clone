import { getPB } from '@/lib/pb/client';
import { Vote, VoteSchema } from '@/lib/types/pocketbase';
import { isAuthenticated } from './auth';

export async function getVotesByProduct(productId: string): Promise<{ success: boolean; error?: string; data?: Vote[] }> {
  try {
    const pb = getPB();
    const res = await pb.collection('votes').getFullList({ filter: `product = "${productId}"` });
    return { success: true, data: res.map((r) => VoteSchema.parse(r)) };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to fetch votes' };
  }
}

export async function createVote(productId: string): Promise<{ success: boolean; error?: string; data?: Vote }> {
  try {
    if (!isAuthenticated()) return { success: false, error: 'Authentication required' };
    const pb = getPB();
    const userId = (pb.authStore.model as any)?.id;
    const hash = getVisitorHash();
    const record = await pb.collection('votes').create({
      product: productId,
      user: userId || undefined,
      visitor_hash: hash,
      voted_at: new Date().toISOString(),
    });
    return { success: true, data: VoteSchema.parse(record) };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to create vote' };
  }
}

export async function hasVoted(productId: string): Promise<boolean> {
  try {
    if (isAuthenticated()) {
      const pb = getPB();
      const userId = (pb.authStore.model as any)?.id;
      await pb.collection('votes').getFirstListItem(`product = "${productId}" && user = "${userId}"`);
      return true;
    }
    const hash = getVisitorHash();
    const pb = getPB();
    await pb.collection('votes').getFirstListItem(`product = "${productId}" && visitor_hash = "${hash}"`);
    return true;
  } catch {
    return false;
  }
}

export function getVisitorHash(): string {
  try {
    if (typeof window === 'undefined') return 'anonymous';
    const stored = localStorage.getItem('visitor_hash');
    if (stored) return stored;
    const hash = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('visitor_hash', hash);
    return hash;
  } catch {
    return 'anonymous';
  }
}
