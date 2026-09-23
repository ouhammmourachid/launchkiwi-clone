import type { Metadata } from "next";

import { SignInView } from "@/components/auth/auth-views";
import { safeRedirect } from "@/lib/utils/safe-redirect";

export const metadata: Metadata = { title: "Sign in" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Full page for direct visits and refreshes; client navigation opens app/@auth/(.)login instead. */
export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const next = safeRedirect((await searchParams).next);
  return <SignInView next={next} />;
}
