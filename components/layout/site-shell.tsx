/**
 * site-shell.tsx
 * Top-level page shell — composes the banner, header, main content,
 * newsletter section and footer into a single layout wrapper.
 */

import type { ReactNode } from "react";

import { AnnouncementBanner } from "@/components/layout/announcement-banner";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsletterSection } from "@/components/layout/newsletter-section";
import { SiteFooter } from "@/components/layout/site-footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0c07] text-[#f3efe6] font-sans antialiased">
      <AnnouncementBanner />
      <SiteHeader />
      <main className="relative">{children}</main>
      <NewsletterSection />
      <SiteFooter />
    </div>
  );
}
