/**
 * header-search.tsx
 * Global search — submits to /browse?q=… with client-side navigation.
 */

import Form from "next/form";

import { SearchIcon } from "@/components/layout/nav-icons";

export function HeaderSearch() {
  return (
    <Form action="/browse" role="search" className="relative w-full max-w-[360px]">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78826b]">
        <SearchIcon />
      </span>
      <input
        type="search"
        name="q"
        aria-label="Search products"
        placeholder="Search projects, tools or tags..."
        className="w-full rounded-full border border-[#23291b] bg-[#141810] py-2 pl-9 pr-4 text-xs text-white placeholder:text-[#6e7760] outline-none focus:border-[#86ba28] transition"
      />
    </Form>
  );
}
