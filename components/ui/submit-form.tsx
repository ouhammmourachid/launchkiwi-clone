/**
 * submit-form.tsx
 * Hero URL box — hands the URL to the full submit form on /launch.
 */

import Form from "next/form";

export function SubmitForm() {
  return (
    <Form
      action="/launch"
      className="mt-7 flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto rounded-xl border border-[#22271a] bg-[#0a0c07] p-1.5 shadow-inner"
    >
      <input
        type="url"
        name="url"
        aria-label="Your product URL"
        placeholder="https://yourproduct.com"
        className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder:text-[#5d6550] outline-none flex-1"
      />
      <button
        type="submit"
        className="w-full sm:w-auto shrink-0 rounded-lg bg-[#86ba28] px-4 py-2 text-xs font-bold text-[#0a0d06] transition hover:bg-[#96cc2e] cursor-pointer flex items-center justify-center gap-1.5"
      >
        <span>🚀</span>
        <span>Submit</span>
      </button>
    </Form>
  );
}
