/**
 * submit-form.tsx
 * Client component — the URL submission form on the hero section.
 * Isolated here so the home page can remain a Server Component.
 */

"use client";

export function SubmitForm() {
  return (
    <form
      className="mt-7 flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto rounded-xl border border-[#22271a] bg-[#0a0c07] p-1.5 shadow-inner"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
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
    </form>
  );
}
