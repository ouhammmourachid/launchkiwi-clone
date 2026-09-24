/**
 * app/account/launches/[id]/page.tsx — A maker edits one of their launches.
 * Categories and tags are public, so they load on the server; the launch itself
 * needs the maker's auth and loads in the browser.
 */

import type { Metadata } from "next";

import { LaunchEditor } from "@/components/account/launch-editor";
import { ContentShell } from "@/components/layout/content-shell";
import { listAllCategories, listTagIdsBySlug } from "@/lib/api/catalog";

export const metadata: Metadata = { title: "Edit launch", robots: { index: false } };

type Params = Promise<{ id: string }>;

export default async function EditLaunchPage({ params }: { params: Params }) {
  const { id } = await params;
  const [categories, tagIdsBySlug] = await Promise.all([listAllCategories(), listTagIdsBySlug()]);

  return (
    <ContentShell>
      <LaunchEditor launchId={id} categories={categories} tagIdsBySlug={tagIdsBySlug} />
    </ContentShell>
  );
}
