"use client";

import { usePathname } from "next/navigation";
import { SanityLive } from "@/sanity/live";

// Mounts the Sanity live-events listener everywhere EXCEPT under /studio.
//
// Why: SanityLive subscribes to content-change events and calls
// router.refresh() when one fires. That refresh nukes whatever local
// state the Studio editor is holding — most visibly, an in-progress
// image upload disappears between hitting "Upload" and seeing the
// thumbnail render. We only need live updates on the public site; the
// Studio has its own internal sync.
export default function SanityLiveOnPublic() {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return <SanityLive />;
}
