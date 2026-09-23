"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10">
      <Panel className="px-6 py-16 text-center">
        <h1 className="text-2xl font-black tracking-tight text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-[#9aa48c]">
          We couldn&apos;t load this page. If you&apos;re running locally, make sure PocketBase is up (<code>npm run pb</code>).
        </p>
        <Button className="mt-6" onClick={reset}>
          Try again
        </Button>
      </Panel>
    </div>
  );
}
