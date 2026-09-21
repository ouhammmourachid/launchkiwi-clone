import PocketBase from 'pocketbase';

let pbInstance: PocketBase | null = null;

export function getPB(): PocketBase {
  if (pbInstance) return pbInstance;
  const url = process.env.NEXT_PUBLIC_PB_URL;
  if (!url) throw new Error('NEXT_PUBLIC_PB_URL is not set');
  pbInstance = new PocketBase(url);
  return pbInstance;
}
