/**
 * account-dashboard.tsx
 * Signed-in user's profile, launches and saved products.
 * Auth lives in the browser (PocketBase auth store), so this renders client-side.
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { UserAvatar } from "@/components/auth/user-avatar";
import { ProductList } from "@/components/products/product-list";
import { Button, buttonClasses } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useAuth } from "@/hooks/use-auth";
import { useFavoriteProducts } from "@/hooks/use-favorites";
import { listProductsByMaker } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";

export function AccountDashboard() {
  const { user, isReady, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && !user) router.replace("/login?next=/account");
  }, [isReady, user, router]);

  const myProducts = useQuery({
    queryKey: queryKeys.myProducts(user?.id),
    queryFn: () => listProductsByMaker(user!.id),
    enabled: !!user,
  });
  const favorites = useFavoriteProducts();

  if (!user) return <Panel className="h-40 animate-pulse" aria-hidden />;

  return (
    <div className="space-y-6 pb-12">
      <Panel className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar user={user} size={56} />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-black tracking-tight text-white">{user.name}</h1>
            <p className="truncate text-xs text-[#8c967d]">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/launch" className={buttonClasses({ size: "sm" })}>
            🚀 New launch
          </Link>
          <Button variant="secondary" size="sm" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </Panel>

      <ProductList
        title="My launches"
        subtitle={myProducts.isLoading ? "Loading…" : `${myProducts.data?.length ?? 0} products`}
        products={myProducts.data ?? []}
        showRank={false}
        emptyTitle={myProducts.isLoading ? "Loading…" : "You haven't launched anything yet"}
        emptyContent={
          !myProducts.isLoading && (
            <Link href="/launch" className="font-bold text-[#86ba28] hover:underline">
              Launch your first product →
            </Link>
          )
        }
      />

      <ProductList
        title="Saved products"
        subtitle={favorites.isLoading ? "Loading…" : `${favorites.data?.length ?? 0} saved`}
        products={favorites.data ?? []}
        showRank={false}
        emptyTitle={favorites.isLoading ? "Loading…" : "No saved products yet"}
        emptyContent={!favorites.isLoading && "Tap ☆ Save on any product page to keep it here."}
      />
    </div>
  );
}
