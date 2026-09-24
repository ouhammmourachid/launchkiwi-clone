/**
 * load-more-products.tsx
 * Home page footer: loads launches older than the month's sections in place,
 * a page per click, instead of sending visitors off to /browse.
 */

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

import { ProductList } from "@/components/products/product-list";
import { Button } from "@/components/ui/button";
import { listOlderProducts } from "@/lib/api/products";
import { queryKeys } from "@/lib/query-keys";

export function LoadMoreProducts() {
  const [started, setStarted] = useState(false);
  const { data, fetchNextPage, refetch, hasNextPage, isFetching, isError } = useInfiniteQuery({
    queryKey: queryKeys.olderProducts,
    queryFn: ({ pageParam }) => listOlderProducts(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
    enabled: started,
    staleTime: 60 * 1000,
  });

  const products = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.totalItems ?? 0;
  const canLoad = !started || hasNextPage || isError;

  const loadMore = () => {
    if (!started) setStarted(true);
    else if (!data) void refetch(); // the first page failed
    else void fetchNextPage();
  };

  return (
    <>
      {data && (
        <ProductList
          title="Older Hunts"
          subtitle="Sorted by upvote count"
          products={products}
          emptyTitle="No older launches yet"
        />
      )}

      {canLoad && (
        <div className="text-center py-2">
          <Button variant="secondary" size="sm" onClick={loadMore} loading={isFetching}>
            {isError ? "Couldn't load — try again" : "Load more products"}
          </Button>
          {data && total > 0 && (
            <p className="mt-2 text-[11px] text-dune-500">
              Showing {products.length} of {total}
            </p>
          )}
        </div>
      )}
    </>
  );
}
