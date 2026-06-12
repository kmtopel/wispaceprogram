"use client";

import { usePathname } from "next/navigation";

// Client wrapper that suppresses its children when the current path is
// under /studio. Used to keep <SanityLive /> from firing router.refresh()
// while an editor is in the middle of an upload — the refresh otherwise
// nukes Studio's in-progress state.
//
// Important: this component does NOT import <SanityLive /> directly,
// because SanityLive is a server-only component and pulling it into a
// "use client" file breaks the build. Instead, the layout (a Server
// Component) imports SanityLive and passes it as children here.
export default function SanityLiveOnPublic({ children }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/studio")) return null;
  return children;
}
