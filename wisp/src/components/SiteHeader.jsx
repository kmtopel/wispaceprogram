"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNavHref, isExternal } from "@/lib/nav";

// Site header — logo + navigation. Client component for:
//   1) Mobile drawer open/close state
//   2) "Splash" intro animation on first mount.
//
// Animation timeline (skipped for prefers-reduced-motion):
//   t=0    Wide splash logo visible across the header, settled row hidden.
//   t=1200 Splash fades out, settled row (compact logo + nav) fades in.
//
// The splash is rendered absolutely positioned ON TOP of the settled row,
// so the header's outer dimensions never change during the animation —
// only what's visible inside.
const SPLASH_DURATION_MS = 1200;

export default function SiteHeader({
  splashLogoUrl,
  desktopLogoUrl,
  mobileLogoUrl,
  navItems,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setSplash(false);
      return;
    }
    const t = setTimeout(() => setSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const items = (navItems || [])
    .map((item) => ({ ...item, href: getNavHref(item) }))
    .filter((item) => item.href);

  return (
    <header className="relative px-6 pt-10 pb-6 max-w-5xl mx-auto">
      {/* Settled row — always laid out so it sets the header's height.
          During splash: invisible & nudged up slightly. After: settles
          smoothly into place. Slight delay so the splash fades out first. */}
      <div
        className={`flex items-center gap-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          splash
            ? "opacity-0 pointer-events-none translate-y-2"
            : "opacity-100 translate-y-0 delay-200"
        }`}
        aria-hidden={splash}
      >
        <Link
          href="/"
          aria-label="WI Space Program — home"
          className="block shrink-0"
        >
          <Image
            src={desktopLogoUrl}
            alt="WI Space Program"
            width={600}
            height={80}
            priority
            className="hidden sm:block w-auto h-20 invert"
          />
          <Image
            src={mobileLogoUrl}
            alt="WI Space Program"
            width={300}
            height={130}
            priority
            className="block sm:hidden w-auto h-16 invert"
          />
        </Link>

        {items.length > 0 && (
          <nav className="hidden sm:flex items-center gap-6 ml-auto">
            {items.map((item) => (
              <NavLink key={item._key} item={item} />
            ))}
          </nav>
        )}

        {items.length > 0 && (
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="sm:hidden ml-auto h-10 w-10 flex flex-col justify-center items-center gap-1.5 rounded-md hover:bg-foreground/5 transition-colors"
          >
            <span className="h-0.5 w-6 bg-foreground" />
            <span className="h-0.5 w-6 bg-foreground" />
            <span className="h-0.5 w-6 bg-foreground" />
          </button>
        )}
      </div>

      {/* Splash overlay — absolutely positioned over the settled row, so it
          doesn't affect header dimensions. Fades out and shrinks slightly
          to suggest "settling down" rather than just vanishing. */}
      <div
        className={`absolute inset-0 px-6 pt-10 pb-6 flex items-center justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-[opacity,transform] ${
          splash
            ? "opacity-100 scale-100"
            : "opacity-0 scale-[0.96] -translate-y-1"
        }`}
        aria-hidden={!splash}
      >
        <Image
          src={splashLogoUrl}
          alt={splash ? "WI Space Program" : ""}
          width={1200}
          height={130}
          priority
          className="w-full max-w-3xl h-auto invert"
        />
      </div>

      {menuOpen && (
        <MobileDrawer items={items} onClose={() => setMenuOpen(false)} />
      )}
    </header>
  );
}

function NavLink({ item, onNavigate }) {
  const className =
    "text-sm uppercase tracking-wide font-medium hover:opacity-70 transition-opacity";

  if (isExternal(item)) {
    return (
      <a
        href={item.href}
        target={item.newTab ? "_blank" : undefined}
        rel={item.newTab ? "noopener noreferrer" : undefined}
        onClick={onNavigate}
        className={className}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} onClick={onNavigate} className={className}>
      {item.label}
    </Link>
  );
}

function MobileDrawer({ items, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-50 sm:hidden"
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="absolute inset-y-0 right-0 w-72 max-w-[80vw] bg-background shadow-xl border-l border-foreground/10 flex flex-col">
        <div className="flex justify-end p-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-foreground/5 transition-colors"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {items.map((item) => (
            <div key={item._key} className="py-2">
              <NavLink item={item} onNavigate={onClose} />
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
