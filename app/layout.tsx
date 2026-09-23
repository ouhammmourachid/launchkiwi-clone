import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Readex_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { SiteShell } from "@/components/layout/site-shell";

const readex = Readex_Pro({
  variable: "--font-readex-pro",
  subsets: ["latin", "arabic"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LaunchDunes — Discover the best indie projects & startup launches",
    template: "%s — LaunchDunes",
  },
  description:
    "Browse this week's top indie launches, submit your own project for free, and get discovered by early adopters and AI-native communities.",
};

export default function RootLayout({ children, auth }: Readonly<{ children: React.ReactNode; auth: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${readex.variable} ${bricolage.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <Providers>
          <SiteShell>{children}</SiteShell>
          {auth}
        </Providers>
      </body>
    </html>
  );
}
