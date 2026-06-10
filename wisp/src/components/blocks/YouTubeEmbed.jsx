"use client";

import { useState } from "react";
import {
  getYouTubeEmbedUrl,
  getYouTubeThumbnailUrl,
} from "@/lib/youtube";
import SectionHeader from "@/components/SectionHeader";
import Buttons from "@/components/Buttons";

// Single YouTube video block with optional section header (heading,
// subheading, rich-text body, CTAs). Uses the same lazy facade pattern as
// VideoCarousel: a thumbnail with a play button replaces the iframe until
// the user clicks, saving ~500KB of iframe JS on page load.
export default function YouTubeEmbed({
  anchor,
  header,
  url,
  ctaButtons,
  ctaButtonsAlign,
}) {
  const [activated, setActivated] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(url);
  const posterUrl = getYouTubeThumbnailUrl(url, "high");
  const posterFallback = getYouTubeThumbnailUrl(url, "low");

  if (!embedUrl) return null;

  return (
    <section
      id={anchor || undefined}
      className="px-6 py-12 sm:py-16 max-w-5xl mx-auto w-full scroll-mt-20"
    >
      {header && (
        <div className="mb-6">
          <SectionHeader value={header} />
        </div>
      )}

      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
        {activated ? (
          <iframe
            src={`${embedUrl}&autoplay=1`}
            title={header?.heading || "YouTube video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; compute-pressure; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <button
            type="button"
            aria-label={`Play ${header?.heading || "video"}`}
            onClick={() => setActivated(true)}
            className="group absolute inset-0 w-full h-full block"
          >
            {posterUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={posterUrl}
                alt=""
                loading="lazy"
                onError={(e) => {
                  if (posterFallback && e.currentTarget.src !== posterFallback) {
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

      {ctaButtons?.length > 0 && (
        <Buttons
          items={ctaButtons}
          align={ctaButtonsAlign || "center"}
          className="mt-8"
        />
      )}
    </section>
  );
}
