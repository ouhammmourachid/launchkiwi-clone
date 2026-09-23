import type { Metadata } from "next";

import { AccountDashboard } from "@/components/account/account-dashboard";
import { ContentShell } from "@/components/layout/content-shell";

export const metadata: Metadata = { title: "My account" };

export default function AccountPage() {
  return (
    <ContentShell>
      <AccountDashboard />
    </ContentShell>
  );
}
