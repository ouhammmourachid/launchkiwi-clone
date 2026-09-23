/**
 * newsletter-section.tsx
 * Email subscription section shown at the bottom of every page.
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

import { subscribeToNewsletter } from "@/lib/api/engagement";
import { getErrorMessage } from "@/lib/pb/errors";
import { subscribeSchema } from "@/lib/validation/schemas";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const subscribe = useMutation({ mutationFn: subscribeToNewsletter, onSuccess: () => setEmail("") });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = subscribeSchema.safeParse({ email });
    if (!parsed.success) {
      setValidationError(parsed.error.issues[0].message);
      return;
    }
    setValidationError(null);
    subscribe.mutate(parsed.data.email);
  };

  const error = validationError ?? (subscribe.isError ? getErrorMessage(subscribe.error) : null);

  return (
    <section className="border-t border-dune-900 bg-dune-970 px-4 py-16 text-center text-white">
      <div className="mx-auto max-w-2xl">
        <span className="inline-block rounded-full border border-dune-800 bg-dune-925 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-dune-200">
          STAY UPDATED
        </span>
        <h3 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl leading-tight">
          Get weekly indie project launches directly in your inbox.
        </h3>
        <p className="mt-3 text-xs sm:text-sm text-dune-300 leading-relaxed">
          Subscribe to receive curated lists of the most successful SaaS products, developer tools, and community favourites.
        </p>

        {subscribe.isSuccess ? (
          <p role="status" className="mt-6 text-sm font-semibold text-sun-bright">
            You&apos;re subscribed — see you in your inbox! ☀️
          </p>
        ) : (
          <form className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
              aria-invalid={!!error}
              placeholder="your.email@domain.com"
              className="w-full rounded-xl border border-dune-850 bg-dune-925 px-4 py-2.5 text-xs text-white placeholder:text-dune-600 outline-none focus:border-sun"
            />
            <button
              type="submit"
              disabled={subscribe.isPending}
              className="w-full sm:w-auto shrink-0 rounded-xl bg-sun px-5 py-2.5 text-xs font-bold text-on-sun transition hover:bg-sun-bright cursor-pointer disabled:opacity-60"
            >
              {subscribe.isPending ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-2 text-xs text-danger">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
