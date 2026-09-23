/** Only allow same-site relative paths as post-login redirects (no open redirects). */
export function safeRedirect(target: unknown, fallback = "/"): string {
  if (typeof target !== "string" || !target.startsWith("/") || target.startsWith("//") || target.startsWith("/\\")) {
    return fallback;
  }
  return target;
}
