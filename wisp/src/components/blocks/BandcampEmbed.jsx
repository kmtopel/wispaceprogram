import {
  parseBandcampEmbed,
  parseBandcampParams,
} from "@/lib/bandcamp";
import RichString from "@/components/RichString";
import SectionHeader from "@/components/SectionHeader";
import Buttons from "@/components/Buttons";

const SIZE_MAX_WIDTH = {
  small: 350,
  medium: 500,
  large: 700,
};

// Bandcamp embeds don't scale uniformly — the artwork stretches with the
// iframe width while the UI controls (play bar, tracklist) stay at fixed
// pixel heights. So we model height as `artworkHeight + uiHeight`, where
// artworkHeight is a function of rendered width.
function computeHeight(embedCode, src, renderedWidth) {
  const p = parseBandcampParams(src);
  const variant = p.size || "large";
  const hasTracklist = p.tracklist === "true";
  const artwork = p.artwork; // "small" | "none" | undefined (= large square)

  // Slim horizontal bar — fixed regardless of width.
  if (variant === "small") return 42;

  // Compact horizontal cards: small artwork on the left, info on the right.
  // Height is fixed (the artwork is small, not stretched with iframe width).
  if (artwork === "small" || artwork === "none") {
    return hasTracklist ? 320 : 120;
  }

  // Default size=large: square artwork that scales 1:1 with width, plus a
  // ~120px tracklist/UI strip below it that does NOT scale.
  const artworkHeight = renderedWidth;
  const uiHeight = hasTracklist ? 120 : 0;
  return artworkHeight + uiHeight;
}

export default function BandcampEmbed({
  anchor,
  header,
  embedCode,
  size = "large",
  caption,
  ctaButtons,
  ctaButtonsAlign,
}) {
  const src = parseBandcampEmbed(embedCode);
  if (!src) return null;

  const maxWidth = SIZE_MAX_WIDTH[size] ?? SIZE_MAX_WIDTH.large;
  const height = computeHeight(embedCode, src, maxWidth);

  return (
    <section id={anchor || undefined} className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6">
        {header && (
          <div className="mb-6">
            <SectionHeader value={header} />
          </div>
        )}

        <div
          className="w-full mx-auto"
          style={maxWidth ? { maxWidth: `${maxWidth}px` } : undefined}
        >
          <iframe
            src={src}
            style={{
              border: 0,
              display: "block",
              width: "100%",
              height: `${height}px`,
            }}
            loading="lazy"
            title={caption || header?.heading || "Bandcamp player"}
            seamless
          />
        </div>

        {caption && (
          <RichString
            as="p"
            value={caption}
            className="mt-3 text-sm text-foreground/70 text-center"
          />
        )}

        {ctaButtons?.length > 0 && (
          <Buttons
            items={ctaButtons}
            align={ctaButtonsAlign || "center"}
            className="mt-8"
          />
        )}
      </div>
    </section>
  );
}
