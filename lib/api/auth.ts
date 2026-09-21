import { getPB } from '@/lib/pb/client';
import { User, UserCreate, AuthResponse } from '@/lib/types/pocketbase';

const TOKEN_KEY = 'pb_auth_token';
const STORE_KEY = 'pb_auth_store';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    const pb = getPB();
    pb.authStore.token = token;
  } catch {
    console.error('Failed to set token');
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORE_KEY);
    const pb = getPB();
    pb.authStore.clear();
  } catch {
    console.error('Failed to clear token');
  }
}

export function initializeAuth(): void {
  if (typeof window === 'undefined') return;
  try {
    const token = getToken();
    const store = localStorage.getItem(STORE_KEY);
    if (token && store) {
      const pb = getPB();
      pb.authStore.token = token;
      pb.authStore.model = JSON.parse(store);
    }
  } catch {
    clearToken();
  }
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<{ success: boolean; error?: string; data?: AuthResponse }> {
  try {
    const pb = getPB();
    await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      name,
    });
    const authData = await pb.collection('users').authWithPassword(email, password);
    setToken(authData.token);
    localStorage.setItem(STORE_KEY, JSON.stringify(authData.record));
    return {
      success: true,
      data: { record: authData.record as User, token: authData.token },
    };
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || 'Registration failed';
    return { success: false, error: message };
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; data?: AuthResponse }> {
  try {
    const pb = getPB();
    const authData = await pb.collection('users').authWithPassword(email, password);
    setToken(authData.token);
    localStorage.setItem(STORE_KEY, JSON.stringify(authData.record));
    return {
      success: true,
      data: { record: authData.record as User, token: authData.token },
    };
  } catch (err: any) {
    const message = err?.response?.data?.message || err?.message || 'Login failed';
    return { success: false, error: message };
  }
}

export async function logout(): Promise<void> {
  try {
    clearToken();
  } catch (err) {
    console.error('Logout error:', err);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const pb = getPB();
    if (!pb.authStore.isValid || !pb.authStore.token) return null;
    const record = await pb.collection('users').authRefresh();
    setToken(record.token);
    localStorage.setItem(STORE_KEY, JSON.stringify(record.record));
    return record.record as User;
  } catch {
    clearToken();
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const pb = getPB();
  return pb.authStore.isValid && !!getToken();
}
