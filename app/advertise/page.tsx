import type { Metadata } from "next";

import { AdvertiseContent } from "@/components/advertise/advertise-content";
import { ContentShell } from "@/components/layout/content-shell";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Put your product at the top of the LaunchKiwi feed.",
};

export default function AdvertisePage() {
  return (
    <ContentShell>
      <AdvertiseContent />
    </ContentShell>
  );
}
