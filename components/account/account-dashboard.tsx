/**
 * account-dashboard.tsx
 * Signed-in user's profile, launches and saved products.
 * Auth lives in the browser (PocketBase auth store), so this renders client-side.
 *
 * Reading order: who you are, then two tabs — Launches (each row opens its
 * editor, where badge checks live) and Saved products. The active tab lives
 * in `?tab=` so it survives refreshes.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { ACCOUNT_TABS, type AccountTab } from "@/components/account/account-tabs";
import { EmptyList, StatusPill } from "@/components/account/account-ui";
import { UserAvatar } from "@/components/auth/user-avatar";
import { BoltIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, RocketIcon } from "@/components/layout/nav-icons";
import { ProductLogo } from "@/components/products/product-logo";
import { ProductRow } from "@/components/products/product-row";
import { Button, buttonClasses } from "@/components/ui/button";
import { Alert } from "@/components/ui/panel";
import { ProductBadge } from "@/components/ui/product-badge";
import { useAuth } from "@/hooks/use-auth";
import { useFavoriteProducts } from "@/hooks/use-favorites";
import { listProductsByMaker } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";
import type { MyLaunch } from "@/lib/types/models";
import { formatNumber } from "@/lib/utils/format";

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

/** Launches shown before the list collapses behind "Show all". */
const COLLAPSED_LAUNCHES = 8;

const LIST = "divide-y divide-dune-900 overflow-hidden rounded-2xl border border-dune-900 bg-dune-970";

function SkeletonList({ rows = 3 }: { rows?: number }) {
  return (
    <div className={LIST} aria-busy aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5">
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-dune-900" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 animate-pulse rounded bg-dune-900" />
            <div className="h-2.5 w-64 max-w-full animate-pulse rounded bg-dune-925" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Launch rows
// ---------------------------------------------------------------------------

/** A launch the maker owns: the whole row opens its editor. */
function MyLaunchRow({ launch }: { launch: MyLaunch }) {
  const isLive = launch.status === "published";
  const canUpgrade = !launch.badge && (launch.status === "published" || launch.status === "pending");
  const upgradeHref = `/upgrade?product=${launch.id}`;

  return (
    <div className="product-item group relative flex items-center gap-3 px-3 py-3.5 sm:gap-4 sm:px-4">
      <div className="shrink-0">
        <ProductLogo name={launch.name} logoUrl={launch.logoUrl} size="row" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <h3 className="product-name truncate font-display text-sm font-bold leading-snug">
            {/* Stretched link: the whole row opens the editor. */}
            <Link href={`/account/launches/${launch.id}`} className="after:absolute after:inset-0">
              {launch.name}
              <span className="sr-only">, edit launch</span>
            </Link>
          </h3>
          <ProductBadge badge={launch.badge} />
        </div>
        <p className="line-clamp-1 text-xs leading-relaxed text-dune-400">{launch.tagline}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-dune-500">
          <StatusPill launch={launch} />
          {launch.needsBadge && <span className="font-semibold text-sun">Verify your badge to go live</span>}
          {isLive && (
            <Link href={`/p/${launch.slug}`} className="relative z-10 transition-colors hover:text-sun">
              View live ↗
            </Link>
          )}
          {canUpgrade && (
            <Link href={upgradeHref} className="relative z-10 inline-flex items-center gap-1 font-bold text-sun hover:underline sm:hidden">
              <BoltIcon className="h-3 w-3" /> Upgrade
            </Link>
          )}
        </div>
      </div>

      {canUpgrade && (
        <div className="relative z-10 hidden shrink-0 sm:block">
          <Link href={upgradeHref} className={buttonClasses({ variant: "secondary", size: "sm", className: "hover:border-sun/50" })}>
            <BoltIcon /> Upgrade
          </Link>
        </div>
      )}

      <div className="flex w-10 shrink-0 flex-col items-center font-mono text-xs font-bold tabular-nums text-dune-300" title="Upvotes">
        <ChevronUpIcon className="h-3.5 w-3.5 text-dune-500" />
        {formatNumber(launch.upvotes)}
        <span className="sr-only">upvotes</span>
      </div>

      <ChevronRightIcon className="h-4 w-4 shrink-0 text-dune-600 transition group-hover:translate-x-0.5 group-hover:text-sun" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

interface AccountDashboardProps {
  paymentSucceeded?: boolean;
  initialTab?: AccountTab;
}

export function AccountDashboard({ paymentSucceeded = false, initialTab = "launches" }: AccountDashboardProps) {
  const { user, isReady, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) router.replace("/login?next=/account");
  }, [isReady, user, router]);

  const myProducts = useQuery({
    queryKey: queryKeys.myProducts(user?.id),
    queryFn: () => listProductsByMaker(user!.id),
    enabled: !!user,
    // The Lemon Squeezy webhook usually lands a few seconds after the redirect;
    // keep refreshing briefly so the new badge shows up without a reload.
    refetchInterval: (query) => (paymentSucceeded && query.state.dataUpdateCount < 6 ? 5000 : false),
  });
  const favorites = useFavoriteProducts();
  const [showAllLaunches, setShowAllLaunches] = useState(false);
  const [tab, setTab] = useState<AccountTab>(initialTab);
  const tabRefs = useRef<Partial<Record<AccountTab, HTMLButtonElement | null>>>({});

  // Keep the tab in the URL so refreshes and shared links land on the same view.
  function selectTab(next: AccountTab) {
    setTab(next);
    const url = new URL(window.location.href);
    if (next === "launches") url.searchParams.delete("tab");
    else url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url);
  }

  // Arrow keys move between tabs (WAI-ARIA tabs pattern, automatic activation).
  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const index = ACCOUNT_TABS.findIndex((t) => t.id === tab);
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: ACCOUNT_TABS.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = ACCOUNT_TABS[(moves[event.key] + ACCOUNT_TABS.length) % ACCOUNT_TABS.length].id;
    selectTab(next);
    tabRefs.current[next]?.focus();
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4 py-6" aria-hidden>
        <div className="h-16 w-16 animate-pulse rounded-full bg-dune-900" />
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-dune-900" />
          <div className="h-3 w-32 animate-pulse rounded bg-dune-925" />
        </div>
      </div>
    );
  }

  const launches = myProducts.data ?? [];
  const pendingBadges = launches.filter((launch) => launch.needsBadge);
  const saved = favorites.data ?? [];
  const totalUpvotes = launches.reduce((sum, launch) => sum + launch.upvotes, 0);

  const summary = [
    `${launches.length} ${launches.length === 1 ? "launch" : "launches"}`,
    `${formatNumber(totalUpvotes)} upvotes`,
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Profile header */}
      <header>
        <div className="flex flex-col gap-5 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="shrink-0 rounded-full p-1 ring-1 ring-dune-850">
              <UserAvatar user={user} size={64} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-black tracking-tight text-white sm:text-3xl">{user.name}</h1>
              <p className="truncate text-xs text-dune-400">{user.email}</p>
              {!myProducts.isLoading && (
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 font-mono text-[11px] tabular-nums text-dune-500">
                  {summary.map((item, i) => (
                    <span key={item} className="flex items-center gap-2">
                      {i > 0 && <span className="h-0.5 w-0.5 rounded-full bg-dune-700" aria-hidden />}
                      {item}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Link href="/launch" className={buttonClasses({ className: "rounded-xl hover:-translate-y-px" })}>
              <RocketIcon /> New launch
            </Link>
            <Button variant="secondary" className="rounded-xl" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
        <div className="mt-8 h-px bg-gradient-to-r from-transparent via-dune-850 to-transparent" aria-hidden />
      </header>

      {paymentSucceeded && (
        <Alert tone="success">Payment received, thank you! Your upgrade will show on your launch within a few seconds.</Alert>
      )}

      <div>
        <div role="tablist" aria-label="Account sections" className="flex gap-6 border-b border-dune-900">
          {ACCOUNT_TABS.map((t) => {
            const selected = tab === t.id;
            const count = t.id === "launches" ? (myProducts.isLoading ? null : launches.length) : favorites.isLoading ? null : saved.length;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[t.id] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(t.id)}
                onKeyDown={onTabKeyDown}
                className={`relative -mb-px flex cursor-pointer items-center gap-2 border-b-2 pb-3 font-display text-base font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sun ${
                  selected ? "border-sun text-white" : "border-transparent text-dune-400 hover:text-white"
                }`}
              >
                {t.label}
                {count !== null && (
                  <span
                    className={`rounded-full px-1.5 py-px font-mono text-[10px] font-bold tabular-nums ${
                      selected ? "bg-sun/15 text-sun" : "bg-dune-925 text-dune-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
                {t.id === "launches" && pendingBadges.length > 0 && (
                  <span className="h-2 w-2 rounded-full bg-sun animate-pulse" title="A launch needs your attention">
                    <span className="sr-only">(needs attention)</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id="panel-launches" aria-labelledby="tab-launches" hidden={tab !== "launches"} className="pt-6">
          <section aria-label="My launches" className="space-y-3">
            {myProducts.isLoading ? (
              <SkeletonList />
            ) : myProducts.isError ? (
              <Alert>We couldn&apos;t load your launches. Refresh the page to try again.</Alert>
            ) : launches.length === 0 ? (
              <EmptyList title="You haven't launched anything yet">
                <Link href="/launch" className="font-bold text-sun hover:underline">
                  Launch your first product →
                </Link>
              </EmptyList>
            ) : (
              <>
                <div className={LIST}>
                  {(showAllLaunches ? launches : launches.slice(0, COLLAPSED_LAUNCHES)).map((launch) => (
                    <MyLaunchRow key={launch.id} launch={launch} />
                  ))}
                </div>
                {launches.length > COLLAPSED_LAUNCHES && (
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setShowAllLaunches((v) => !v)}
                      aria-expanded={showAllLaunches}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dune-850 bg-dune-940 px-4 py-2 text-xs font-semibold text-dune-300 transition-colors hover:bg-sun/10 hover:text-sun"
                    >
                      {showAllLaunches ? "Show fewer" : `Show all ${launches.length} launches`}
                      <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform ${showAllLaunches ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <div role="tabpanel" id="panel-saved" aria-labelledby="tab-saved" hidden={tab !== "saved"} className="pt-6">
          {favorites.isLoading ? (
            <SkeletonList rows={2} />
          ) : saved.length === 0 ? (
            <EmptyList title="No saved products yet">
              Hit Save on any product page to keep it here.{" "}
              <Link href="/browse" className="font-bold text-sun hover:underline">
                Browse launches →
              </Link>
            </EmptyList>
          ) : (
            <div className={LIST}>
              {saved.map((product, index) => (
                <ProductRow key={product.id} product={product} index={index} showRank={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
