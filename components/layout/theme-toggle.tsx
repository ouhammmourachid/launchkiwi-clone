/**
 * theme-toggle.tsx
 * Navbar button that flips between the dark ("Golden Hour") and light ("Midday") themes.
 * The theme lives on <html data-theme>; the inline script in app/layout.tsx applies the
 * saved choice before first paint, so this component only reads and writes it.
 */

"use client";

import { useSyncExternalStore } from "react";

import { MoonIcon, SunIcon } from "@/components/layout/nav-icons";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function ThemeToggle() {
  // Server snapshot is null so the icon renders only once the real theme is known.
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, () => null);
  const next: Theme = theme === "light" ? "dark" : "light";

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this page.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dune-850 bg-dune-925 text-dune-100 transition hover:border-dune-750 hover:text-sun cursor-pointer"
    >
      {theme === "light" ? <MoonIcon /> : theme === "dark" ? <SunIcon /> : null}
    </button>
  );
}
