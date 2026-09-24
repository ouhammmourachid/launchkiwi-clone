import type { Metadata } from "next";

import { AccountDashboard } from "@/components/account/account-dashboard";
import { ContentShell } from "@/components/layout/content-shell";

export const metadata: Metadata = { title: "My account" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AccountPage({ searchParams }: { searchParams: SearchParams }) {
  // Lemon Squeezy sends buyers back to /account?payment=success.
  const { payment } = await searchParams;
  return (
    <ContentShell>
      <AccountDashboard paymentSucceeded={payment === "success"} />
    </ContentShell>
  );
}
