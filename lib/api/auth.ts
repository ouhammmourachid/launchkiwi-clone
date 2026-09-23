/**
 * Browser-only auth helpers. The PocketBase SDK persists the session in
 * localStorage (LocalAuthStore), so no manual token handling is needed.
 */

import { getPB } from "@/lib/pb/client";
import type { UserRecord } from "@/lib/types/records";
import type { SignInInput, SignUpInput } from "@/lib/validation/schemas";

export async function signIn({ email, password }: SignInInput): Promise<void> {
  await getPB().collection("users").authWithPassword(email, password);
}

export async function signUp({ name, email, password, passwordConfirm }: SignUpInput): Promise<void> {
  await getPB().collection("users").create({ name, email, password, passwordConfirm });
  await signIn({ email, password });
}

export function signOut(): void {
  getPB().authStore.clear();
}

/** Validates a persisted session against the server; clears it if revoked. */
export async function refreshSession(): Promise<void> {
  const pb = getPB();
  if (!pb.authStore.isValid) return;
  try {
    await pb.collection("users").authRefresh();
  } catch {
    pb.authStore.clear();
  }
}

export function getAuthRecord(): UserRecord | null {
  const pb = getPB();
  return pb.authStore.isValid ? (pb.authStore.record as UserRecord | null) : null;
}
