import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json higher up the tree confuses workspace-root detection.
  turbopack: { root: path.resolve(__dirname) },
  // Sign-in doubles as sign-up (email one-time code), so the old register page
  // forwards there; the query string (e.g. ?next=) carries over.
  async redirects() {
    return [{ source: "/register", destination: "/login", permanent: false }];
  },
};

export default nextConfig;
