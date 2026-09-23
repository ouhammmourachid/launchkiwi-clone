/**
 * auth-card.tsx
 * Shared frame for sign-in and sign-up, used both as a full page
 * (direct visit / refresh) and inside the auth modal (client navigation).
 */

import type { ReactNode } from "react";

import { DunesLogo } from "@/components/layout/nav-icons";
import { Panel } from "@/components/ui/panel";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  inModal?: boolean;
}

export function AuthCard({ title, subtitle, children, footer, inModal = false }: AuthCardProps) {
  const body = (
    <>
      <div className="flex justify-center">
        <DunesLogo />
      </div>
      <h1 className="mt-6 text-center text-2xl font-black tracking-tight text-white">{title}</h1>
      <p className="mt-1.5 text-center text-xs text-dune-400">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </>
  );

  if (inModal) {
    return (
      <div className="p-7 sm:p-8">
        {body}
        <p className="mt-6 text-center text-xs text-dune-400">{footer}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <Panel className="p-7 sm:p-8">{body}</Panel>
      <p className="mt-5 text-center text-xs text-dune-400">{footer}</p>
    </div>
  );
}
