"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
} from "@/lib/youtube";
import RichString from "@/components/RichString";
import SectionHeader from "@/components/SectionHeader";
import Buttons from "@/components/Buttons";

// Thumbnail dimensions must match the Tailwind classes on <Thumb>.
// Mobile: w-20 (80px), sm+: w-28 (112px).
const THUMB_WIDTH_MOBILE = 80;
const THUMB_WIDTH_DESKTOP = 112;
const THUMB_GAP = 8; // gap-2

// Don't run layout effect during SSR (we fall back to useEffect there).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function VideoCarousel({
  anchor,
  header,
  videos,
  ctaButtons,
  ctaButtonsAlign,
}) {
  const items = (videos || [])
    .map((v) => ({
      key: v._key,
      title: v.title,
      src: getYouTubeEmbedUrl(v.url),
      thumb: getYouTubeThumbnailUrl(v.url),
    }))
    .filter((v) => v.src);

  // Main carousel — fade transitions instead of slide. No infinite loop —
  // the prev/next buttons disable at the ends.
  const [mainRef, mainApi] = useEmblaCarousel(
    { align: "center", loop: false, duration: 30 },
    [Fade()],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // Track which slides have been "activated" (user clicked play). Only
  // activated slides mount their YouTube iframe — others render a static
  // thumbnail facade. Saves ~500KB of iframe JS per unviewed video.
  const [activated, setActivated] = useState(() => new Set());
  const iframeRefs = useRef([]);

  const activate = useCallback((index) => {
    setActivated((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    setCanPrev(mainApi.canScrollPrev());
    setCanNext(mainApi.canScrollNext());
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
  }, [mainApi, onSelect]);

  // When the active slide changes, tell every other iframe to pause via the
  // YouTube IFrame API postMessage protocol. Requires `enablejsapi=1` in the
  // embed URL (set in getYouTubeEmbedUrl).
  useEffect(() => {
    iframeRefs.current.forEach((iframe, i) => {
      if (!iframe || i === selectedIndex) return;
      try {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
          "*",
        );
      } catch {
        // postMessage shouldn't throw, but be defensive about cross-origin.
      }
    });
  }, [selectedIndex]);

  if (items.length === 0) return null;

  return (
    <section id={anchor || undefined} className="py-12 sm:py-16 scroll-mt-20">
      {header && (
        <div className="max-w-5xl mx-auto px-6 mb-6">
          <SectionHeader value={header} />
        </div>
      )}

      {/* Main carousel — one slide visible at a time, crossfading. */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="overflow-hidden" ref={mainRef}>
          <div className="flex">
            {items.map((item, i) => {
              const isActivated = activated.has(i);
              // High-res 1280x720 poster. Some videos (older or non-HD)
              // don't have a maxresdefault — onError below swaps to mqdefault.
              const posterUrl = item.thumb?.replace(
                "/mqdefault.jpg",
                "/maxresdefault.jpg",
              );
              const posterFallback = item.thumb;
              return (
                <figure key={item.key} className="flex-none w-full min-w-0">
                  <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
                    {isActivated ? (
                      // Real iframe — mounted once and persisted across slide
                      // changes so we can pause it via postMessage.
                      // autoplay=1 so clicking play actually starts playback.
                      <iframe
                        ref={(el) => (iframeRefs.current[i] = el)}
                        src={`${item.src}&autoplay=1`}
                        title={item.title || "YouTube video"}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; compute-pressure; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    ) : (
                      <button
                        type="button"
                        aria-label={`Play ${item.title || "video"}`}
                        onClick={() => activate(i)}
                        className="group absolute inset-0 w-full h-full block"
                      >
                        {posterUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={posterUrl}
                            alt=""
                            loading="lazy"
                            onError={(e) => {
                              // maxresdefault doesn't exist for this video —
                              // fall back to the always-available 320x180.
                              if (e.currentTarget.src !== posterFallback) {
                                e.currentTarget.src = posterFallback;
                              }
                            }}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-red-600 group-hover:bg-red-500 transition-colors shadow-lg">
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="white"
                              aria-hidden="true"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                  {item.title && (
                    <RichString
                      as="figcaption"
                      value={item.title}
                      className="mt-2 text-sm text-foreground/70"
                    />
                  )}
                </figure>
              );
            })}
          </div>
        </div>
      </div>

      {/* Thumbnails — layout adapts based on whether they fit in the container. */}
      {items.length > 1 && (
        <div className="max-w-5xl mx-auto px-6 mt-3">
          <AdaptiveThumbs
            items={items}
            selectedIndex={selectedIndex}
            onPick={(i) => mainApi?.scrollTo(i)}
          />
        </div>
      )}

      {/* Prev/next arrows — centered beneath the thumbnail strip. */}
      {items.length > 1 && (
        <div className="max-w-5xl mx-auto px-6 mt-6 flex justify-center gap-3">
          <CarouselButton
            onClick={() => mainApi?.scrollPrev()}
            label="Previous video"
            disabled={!canPrev}
          >
            <ChevronIcon direction="left" />
          </CarouselButton>
          <CarouselButton
            onClick={() => mainApi?.scrollNext()}
            label="Next video"
            disabled={!canNext}
          >
            <ChevronIcon direction="right" />
          </CarouselButton>
        </div>
      )}

      {ctaButtons?.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 mt-10">
          <Buttons items={ctaButtons} align={ctaButtonsAlign || "center"} />
        </div>
      )}
    </section>
  );
}

function AdaptiveThumbs({ items, selectedIndex, onPick }) {
  const containerRef = useRef(null);
  const [fits, setFits] = useState(true);

  useIsoLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const containerWidth = el.clientWidth;
      const isDesktop = window.matchMedia("(min-width: 640px)").matches;
      const thumbWidth = isDesktop ? THUMB_WIDTH_DESKTOP : THUMB_WIDTH_MOBILE;
      const totalWidth =
        items.length * thumbWidth + Math.max(0, items.length - 1) * THUMB_GAP;
      setFits(totalWidth <= containerWidth);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  return (
    <div ref={containerRef}>
      {fits ? (
        <StaticThumbRow
          items={items}
          selectedIndex={selectedIndex}
          onPick={onPick}
        />
      ) : (
        <ScrollableThumbs
          items={items}
          selectedIndex={selectedIndex}
          onPick={onPick}
        />
      )}
    </div>
  );
}

function StaticThumbRow({ items, selectedIndex, onPick }) {
  return (
    <div className="flex justify-center gap-2">
      {items.map((item, i) => (
        <Thumb
          key={item.key}
          item={item}
          index={i}
          isActive={i === selectedIndex}
          onPick={onPick}
        />
      ))}
    </div>
  );
}

function ScrollableThumbs({ items, selectedIndex, onPick }) {
  const scrollerRef = useRef(null);
  const thumbRefs = useRef([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 1);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener("scroll", updateButtons, { passive: true });
    const ro = new ResizeObserver(updateButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      ro.disconnect();
    };
  }, [updateButtons]);

  // Scroll by a meaningful page — visible viewport minus one thumb, so the
  // edge thumb stays as context after the scroll.
  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const isDesktop = window.matchMedia("(min-width: 640px)").matches;
    const thumbWidth = isDesktop ? THUMB_WIDTH_DESKTOP : THUMB_WIDTH_MOBILE;
    const delta = (el.clientWidth - thumbWidth) * direction;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Keep active thumb in view when the main carousel changes.
  useEffect(() => {
    const el = thumbRefs.current[selectedIndex];
    if (el) el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  return (
    <div className="relative">
      {/* Fade masks */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10 transition-opacity ${
          canPrev ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10 transition-opacity ${
          canNext ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Scroll arrows */}
      {canPrev && (
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="Scroll thumbnails left"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-background border border-foreground/20 flex items-center justify-center hover:bg-foreground/5 transition-colors"
        >
          <ChevronIcon direction="left" small />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Scroll thumbnails right"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-background border border-foreground/20 flex items-center justify-center hover:bg-foreground/5 transition-colors"
        >
          <ChevronIcon direction="right" small />
        </button>
      )}

      <div
        ref={scrollerRef}
        className="overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Inner py-1 gives the inset-shadow border breathing room so it doesn't
            sit flush against the scroller edges when an edge thumb is active. */}
        <div className="flex gap-2 py-1">
          {items.map((item, i) => (
            <Thumb
              key={item.key}
              ref={(el) => (thumbRefs.current[i] = el)}
              item={item}
              index={i}
              isActive={i === selectedIndex}
              onPick={onPick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Thumb({ item, index, isActive, onPick, ref }) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onPick(index)}
      aria-label={`Play video ${index + 1}${item.title ? `: ${item.title}` : ""}`}
      aria-current={isActive}
      className={`relative flex-none aspect-square w-20 sm:w-28 overflow-hidden rounded-md bg-black transition-opacity ${
        isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
      }`}
    >
      {item.thumb && (
        <Image
          src={item.thumb}
          alt=""
          fill
          sizes="(min-width: 640px) 7rem, 5rem"
          className="object-cover"
        />
      )}
      {/* Active-state indicator. Inset box-shadow stays inside the element
          so it never gets clipped by the scroller or container, no matter
          where the active thumb is in the row. */}
      {isActive && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-md ring-2 ring-inset ring-foreground pointer-events-none"
        />
      )}
    </button>
  );
}

function CarouselButton({ children, onClick, label, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="h-12 w-12 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

// Clean chevron arrow. Use `direction="left"` or `"right"`. `small` shrinks
// it for the thumbnail scroller's compact buttons.
function ChevronIcon({ direction = "right", small = false }) {
  const size = small ? 14 : 22;
  const transform = direction === "left" ? "rotate(180deg)" : undefined;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ transform }}
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}
