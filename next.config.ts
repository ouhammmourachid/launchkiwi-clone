import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json higher up the tree confuses workspace-root detection.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
