import type { Metadata } from "next";

import { SignUpView } from "@/components/auth/auth-views";
import { safeRedirect } from "@/lib/utils/safe-redirect";

export const metadata: Metadata = { title: "Create an account" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Full page for direct visits and refreshes; client navigation opens app/@auth/(.)register instead. */
export default async function RegisterPage({ searchParams }: { searchParams: SearchParams }) {
  const next = safeRedirect((await searchParams).next);
  return <SignUpView next={next} />;
}
