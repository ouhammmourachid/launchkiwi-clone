/**
 * header-search.tsx
 * Global search — submits to /browse?q=… with client-side navigation.
 */

import Form from "next/form";

import { SearchIcon } from "@/components/layout/nav-icons";

export function HeaderSearch() {
  return (
    <Form action="/browse" role="search" className="relative w-full max-w-[320px]">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dune-500">
        <SearchIcon />
      </span>
      {/* `!` beats the global `input { font: inherit }` reset in globals.css. */}
      <input
        type="search"
        name="q"
        aria-label="Search products"
        placeholder="Search projects, tools or tags..."
        className="h-9 w-full rounded-full border border-dune-850 bg-dune-970 pl-10 pr-4 text-[13px]! text-dune-50 placeholder:text-dune-500 outline-none focus:border-sun transition"
      />
    </Form>
  );
}
