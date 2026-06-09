"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Fade from "embla-carousel-fade";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
} from "@/lib/youtube";

// Thumbnail dimensions must match the Tailwind classes on <Thumb>.
// Mobile: w-28 (112px), sm+: w-40 (160px).
const THUMB_WIDTH_MOBILE = 112;
const THUMB_WIDTH_DESKTOP = 160;
const THUMB_GAP = 8; // gap-2

// Don't run layout effect during SSR (we fall back to useEffect there).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function VideoCarousel({ anchor, heading, videos }) {
  const items = (videos || [])
    .map((v) => ({
      key: v._key,
      title: v.title,
      src: getYouTubeEmbedUrl(v.url),
      thumb: getYouTubeThumbnailUrl(v.url),
    }))
    .filter((v) => v.src);

  // Main carousel — fade transitions instead of slide.
  const [mainRef, mainApi] = useEmblaCarousel(
    { align: "center", loop: true, duration: 30 },
    [Fade()],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
  }, [mainApi, onSelect]);

  if (items.length === 0) return null;

  return (
    <section id={anchor || undefined} className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6 mb-6 flex items-end justify-between gap-4">
        {heading ? (
          <h2 className="text-2xl sm:text-3xl font-bold">{heading}</h2>
        ) : (
          <span />
        )}
        {items.length > 1 && (
          <div className="flex gap-2 shrink-0">
            <CarouselButton
              onClick={() => mainApi?.scrollPrev()}
              label="Previous video"
            >
              ←
            </CarouselButton>
            <CarouselButton
              onClick={() => mainApi?.scrollNext()}
              label="Next video"
            >
              →
            </CarouselButton>
          </div>
        )}
      </div>

      {/* Main carousel — one slide visible at a time, crossfading. */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="overflow-hidden" ref={mainRef}>
          <div className="flex">
            {items.map((item) => (
              <figure key={item.key} className="flex-none w-full min-w-0">
                <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
                  <iframe
                    src={item.src}
                    title={item.title || "YouTube video"}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; compute-pressure; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                {item.title && (
                  <figcaption className="mt-2 text-sm text-foreground/70">
                    {item.title}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnails — layout adapts based on whether they fit in the container. */}
      {items.length > 1 && (
        <div className="max-w-5xl mx-auto px-6 mt-6">
          <AdaptiveThumbs
            items={items}
            selectedIndex={selectedIndex}
            onPick={(i) => mainApi?.scrollTo(i)}
          />
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
          ←
        </button>
      )}
      {canNext && (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="Scroll thumbnails right"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-background border border-foreground/20 flex items-center justify-center hover:bg-foreground/5 transition-colors"
        >
          →
        </button>
      )}

      <div
        ref={scrollerRef}
        className="overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-2">
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
      className={`relative flex-none aspect-video w-28 sm:w-40 overflow-hidden rounded-md bg-black transition-all ${
        isActive
          ? "ring-2 ring-foreground opacity-100"
          : "opacity-50 hover:opacity-80"
      }`}
    >
      {item.thumb && (
        <Image
          src={item.thumb}
          alt=""
          fill
          sizes="(min-width: 640px) 10rem, 7rem"
          className="object-cover"
        />
      )}
    </button>
  );
}

function CarouselButton({ children, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="h-10 w-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground/5 transition-colors"
    >
      {children}
    </button>
  );
}
