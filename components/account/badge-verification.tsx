/**
 * badge-verification.tsx
 * Free launches stay hidden until the maker embeds our badge on their site.
 * Shows the snippet to copy and asks PocketBase to check for it.
 */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { BoltIcon } from "@/components/layout/nav-icons";
import { Button, buttonClasses } from "@/components/ui/button";
import { Alert, Panel } from "@/components/ui/panel";
import { useToast } from "@/hooks/use-toast";
import { badgeSnippet, getBadgeInfo, verifyBadge } from "@/lib/api/badge";
import { getErrorMessage } from "@/lib/pb/errors";
import { queryKeys } from "@/lib/query-keys";
import type { MyLaunch } from "@/lib/types/models";

const noopSubscribe = () => () => {};

export function BadgeVerification({ launch, userId }: { launch: MyLaunch; userId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => "");
  const badge = useQuery({ queryKey: queryKeys.badge(launch.id), queryFn: () => getBadgeInfo(launch.id) });
  const snippet = origin && badge.data ? badgeSnippet(origin, launch.slug, badge.data.token) : "";

  const verify = useMutation({
    mutationFn: () => verifyBadge(launch.id),
    onSuccess: (result) => {
      if (!result.verified) {
        setFailure(result.reason);
        return;
      }
      setFailure(null);
      toast(`✅ Badge verified! ${launch.name} is in the launch queue with a dofollow link.`);
      void queryClient.invalidateQueries({ queryKey: queryKeys.myProducts(userId) });
    },
    onError: (err) => setFailure(getErrorMessage(err)),
  });

  async function copy() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Panel className="space-y-4 p-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="text-base font-black text-white">Verify {launch.name} to go live</h2>
        <span className="text-[10px] font-black uppercase tracking-wider text-sun">Hidden · awaiting badge</span>
      </div>
      <p className="text-xs leading-relaxed text-dune-300">
        Free launches appear once our badge is on your homepage. Paste this snippet into your site, deploy it, then check.
        Verified launches join the queue and earn a dofollow backlink. Keep the badge up to keep the dofollow link.
      </p>

      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-dune-850 bg-dune-970 p-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-dune-500">Badge preview</span>
        {/* eslint-disable-next-line @next/next/no-img-element -- the exact asset makers embed, shown as-is */}
        <img src="/badge.svg" alt="Launched on LaunchDunes" width={200} height={54} />
      </div>

      <div className="relative">
        <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-xl border border-dune-850 bg-dune-925 p-4 pr-20 text-[11px] text-dune-200">
          {snippet || "Loading…"}
        </pre>
        <Button variant="secondary" size="sm" className="absolute right-2 top-2" onClick={copy} disabled={!snippet}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      {failure && <Alert>{failure}</Alert>}

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" loading={verify.isPending} onClick={() => verify.mutate()}>
          Check my badge
        </Button>
        <Link href={`/upgrade?plan=premium&product=${launch.id}`} className={buttonClasses({ variant: "secondary", size: "sm" })}>
          <BoltIcon /> Skip the badge with Premium
        </Link>
      </div>
    </Panel>
  );
}
