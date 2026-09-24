"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";

import { getAuthRecord, refreshSession, requestSignInCode, signOut, verifySignInCode } from "@/lib/api/auth";
import { toSessionUser } from "@/lib/api/mappers";
import { getPB } from "@/lib/pb/client";
import type { SessionUser } from "@/lib/types/models";
import type { UserRecord } from "@/lib/types/records";
import type { SignInInput } from "@/lib/validation/schemas";

interface AuthContextValue {
  user: SessionUser | null;
  /** False during SSR/hydration, when the persisted session isn't known yet. */
  isReady: boolean;
  /** Emails a one-time code (creating the account if new); resolves to the id `verifyCode` needs. */
  requestSignInCode: (input: SignInInput) => Promise<string>;
  verifyCode: (otpId: string, code: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// The SDK's `authStore.record` getter re-parses localStorage and returns a new
// object on every read, so the snapshot must be cached between store changes
// or useSyncExternalStore loops forever.
let authSnapshot: UserRecord | null | undefined;
const getSnapshot = () => (authSnapshot === undefined ? (authSnapshot = getAuthRecord()) : authSnapshot);
const subscribe = (onChange: () => void) =>
  getPB().authStore.onChange(() => {
    authSnapshot = getAuthRecord();
    onChange();
  });
const noopSubscribe = () => () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const record = useSyncExternalStore(subscribe, getSnapshot, () => null);
  const isReady = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Re-validate a persisted session once per page load.
  useEffect(() => {
    void refreshSession();
  }, []);

  const user = useMemo(() => (record ? toSessionUser(record) : null), [record]);
  const value = useMemo<AuthContextValue>(() => ({ user, isReady, requestSignInCode, verifyCode: verifySignInCode, signOut }), [user, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>.");
  return ctx;
}

/**
 * Returns a guard for actions that need a signed-in user. When signed out it
 * sends the user to /login and brings them back here afterwards.
 *
 *   const requireAuth = useRequireAuth();
 *   if (!requireAuth()) return;
 */
export function useRequireAuth() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return useCallback((): boolean => {
    if (user) return true;
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
    return false;
  }, [user, router, pathname]);
}
