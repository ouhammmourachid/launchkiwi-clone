/**
 * mobile-menu.tsx
 * Phone navigation: a panel that drops open under the header with search,
 * this week's launch counters, the launch CTA, nav links and the auth actions.
 * The header owns the open state and page-scroll lock; this covers the whole
 * viewport below the header and renders only below `md`.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { UserAvatar } from "@/components/auth/user-avatar";
import { GridIcon, MegaphoneIcon, ReviewIcon, RocketIcon, SearchIcon, TagIcon } from "@/components/layout/nav-icons";
import { buttonClasses } from "@/components/ui/button";
import { navLinks } from "@/data/site";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { getWeeklyLaunchCounts } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";

const ICON_CLASS = "h-4 w-4 shrink-0";

const NAV_ICONS: Record<string, ReactNode> = {
  "/browse": <GridIcon className={ICON_CLASS} />,
  "/reviews": <ReviewIcon className={ICON_CLASS} />,
  "/pricing": <TagIcon className={ICON_CLASS} />,
  "/advertise": <MegaphoneIcon className={ICON_CLASS} />,
};

interface MobileMenuProps {
  id: string;
  /** Viewport offset of the header's bottom edge, in px. */
  top: number;
  pathname: string;
  onClose: () => void;
}

export function MobileMenu({ id, top, pathname, onClose }: MobileMenuProps) {
  const counts = useQuery({ queryKey: queryKeys.weeklyLaunchCounts, queryFn: getWeeklyLaunchCounts, staleTime: 5 * 60 * 1000 });

  return (
    <div id={id} style={{ top }} className="fixed inset-x-0 bottom-0 overflow-y-auto overscroll-contain bg-dune-970 md:hidden">
      <div className="mx-auto max-w-lg space-y-3 px-4 pt-4 pb-5">
        <Form action="/browse" role="search" className="relative" onSubmit={onClose}>
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-dune-500">
            <SearchIcon />
          </span>
          <input
            type="search"
            name="q"
            aria-label="Search products"
            placeholder="Search projects…"
            className="h-11 w-full rounded-xl border border-dune-850 bg-dune-940 pl-10 pr-4 text-dune-50 outline-none transition placeholder:text-dune-500 focus:border-sun"
          />
        </Form>

        <div className="grid grid-cols-2 gap-2">
          <LaunchCounter label="This week" value={counts.data?.thisWeek} accent />
          <LaunchCounter label="Last week" value={counts.data?.lastWeek} />
        </div>

        <Link href="/launch" onClick={onClose} className={buttonClasses({ className: "w-full justify-start! rounded-xl!" })}>
          <RocketIcon className={ICON_CLASS} />
          Launch your project
        </Link>

        <nav aria-label="Main" className="space-y-1.5">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "border-dune-800 bg-dune-925 text-sun"
                    : "border-transparent bg-dune-940 text-dune-100 hover:bg-dune-925 hover:text-white"
                }`}
              >
                <span className={active ? "text-sun" : "text-dune-500"}>{NAV_ICONS[link.href]}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <MobileAuth pathname={pathname} onClose={onClose} />
      </div>
    </div>
  );
}

function LaunchCounter({ label, value, accent = false }: { label: string; value: number | undefined; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-dune-900 bg-dune-940 px-3 py-2.5 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-dune-500">{label}</p>
      <p className={`mt-0.5 text-lg font-black tabular-nums ${accent ? "text-sun" : "text-white"}`}>{value ?? "–"}</p>
    </div>
  );
}

function MobileAuth({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const { user, isReady, signOut } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  if (!isReady) return <div className="h-11" aria-hidden />;

  if (!user) {
    const next = pathname !== "/login" && pathname !== "/register" ? `?next=${encodeURIComponent(pathname)}` : "";
    return (
      <Link href={`/login${next}`} onClick={onClose} className={buttonClasses({ variant: "secondary", className: "w-full rounded-xl!" })}>
        Sign In / Register
      </Link>
    );
  }

  const handleSignOut = () => {
    onClose();
    signOut();
    toast("Signed out. See you soon!");
    router.refresh();
  };

  return (
    <div className="rounded-xl border border-dune-900 bg-dune-940 p-3">
      <div className="flex items-center gap-3">
        <UserAvatar user={user} size={36} />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{user.name}</p>
          <p className="truncate text-xs text-dune-500">{user.email}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link href="/account" onClick={onClose} className={buttonClasses({ variant: "secondary", size: "sm" })}>
          My account
        </Link>
        <button type="button" onClick={handleSignOut} className={buttonClasses({ variant: "ghost", size: "sm", className: "text-danger! hover:bg-dune-925" })}>
          Sign out
        </button>
      </div>
    </div>
  );
}
