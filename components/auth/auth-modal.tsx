/**
 * auth-modal.tsx
 * Native <dialog> shell for the intercepted sign-in / sign-up routes.
 * Closing (Esc, backdrop click, close button) navigates back, which
 * returns to the page the modal was opened over.
 */

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

export function AuthModal({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    // Lock page scroll while the modal is up.
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const close = () => router.back();

  // A click whose target is the <dialog> itself landed on the backdrop.
  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={onBackdropClick}
      aria-label="Account"
      className="animate-card-pop m-auto w-[calc(100%-2rem)] max-w-md overflow-visible rounded-[24px] border border-dune-850 bg-dune-940 p-0 text-dune-50 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-dune-400 transition hover:bg-dune-900 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </dialog>
  );
}
