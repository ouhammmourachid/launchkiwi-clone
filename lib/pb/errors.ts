import { ClientResponseError } from "pocketbase";

export function isNotFound(err: unknown): boolean {
  return err instanceof ClientResponseError && err.status === 404;
}

/**
 * Turns any thrown value into a message fit for the UI. For PocketBase
 * validation errors, the first field message is more useful than the generic
 * "Failed to create record."
 */
export function getErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
  if (err instanceof ClientResponseError) {
    if (err.status === 0) return "Can't reach the server. Check your connection and try again.";
    const fieldErrors = Object.entries(err.response?.data ?? {}) as [string, { message?: string }][];
    const [field, detail] = fieldErrors[0] ?? [];
    if (detail?.message) return `${humanize(field)}: ${detail.message}`;
    return err.response?.message || fallback;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

function humanize(field = ""): string {
  const words = field.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
