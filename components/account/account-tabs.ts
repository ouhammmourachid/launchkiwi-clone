/**
 * account-tabs.ts
 * The /account tabs, shared by the server page (reads `?tab=`) and the
 * client dashboard (renders and switches them).
 */

export type AccountTab = "launches" | "saved";

export const ACCOUNT_TABS: { id: AccountTab; label: string }[] = [
  { id: "launches", label: "Launches" },
  { id: "saved", label: "Saved" },
];

/** Unknown or missing values fall back to the first tab. */
export function parseAccountTab(value: unknown): AccountTab {
  return ACCOUNT_TABS.some((t) => t.id === value) ? (value as AccountTab) : "launches";
}
