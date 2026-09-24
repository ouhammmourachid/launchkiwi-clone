/**
 * submit-form.tsx
 * Hero URL box — hands the URL to the full submit form on /launch.
 */

import Form from "next/form";

import { RocketIcon } from "@/components/layout/nav-icons";

export function SubmitForm() {
  return (
    <Form
      action="/launch"
      className="mt-5 flex items-center gap-2 max-w-md mx-auto rounded-xl border border-dune-850 bg-dune-970 p-1.5"
    >
      <input
        type="url"
        name="url"
        aria-label="Your product URL"
        placeholder="https://yourproduct.com"
        className="min-w-0 flex-1 bg-transparent px-2.5 py-2.5 sm:px-3 text-sm text-white placeholder:text-dune-600 outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-sun px-4 py-2.5 sm:px-5 text-sm font-bold text-on-sun transition hover:bg-sun-bright cursor-pointer flex items-center justify-center gap-1.5"
      >
        <RocketIcon className="hidden h-3.5 w-3.5 min-[400px]:block" />
        <span>Submit</span>
      </button>
    </Form>
  );
}
