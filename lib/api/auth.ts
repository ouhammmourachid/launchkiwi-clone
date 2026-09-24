/**
 * Browser-only auth helpers. Sign-in is passwordless: an emailed one-time code.
 * The PocketBase SDK persists the session in
 * localStorage (LocalAuthStore), so no manual token handling is needed.
 */

import { getPB } from "@/lib/pb/client";
import type { UserRecord } from "@/lib/types/records";
import type { SignInInput } from "@/lib/validation/schemas";

/**
 * Emails a one-time sign-in code and returns the id needed to verify it.
 * There's no separate sign-up: an email without an account gets one created
 * on the server (pb_hooks/auth.pb.js) before the code is sent.
 */
export async function requestSignInCode({ email }: SignInInput): Promise<string> {
  const { otpId } = await getPB().collection("users").requestOTP(email);
  return otpId;
}

/** Exchanges the emailed code for a session (also marks the email verified). */
export async function verifySignInCode(otpId: string, code: string): Promise<void> {
  await getPB().collection("users").authWithOTP(otpId, code);
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
