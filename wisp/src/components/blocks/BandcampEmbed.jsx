import {
  parseBandcampEmbed,
  getEmbedDimensions,
} from "@/lib/bandcamp";

const SIZE_MAX_WIDTH = {
  small: 350,
  medium: 500,
  large: 700,
  full: null, // fills container
};

export default function BandcampEmbed({
  anchor,
  heading,
  embedCode,
  size = "full",
  caption,
}) {
  const src = parseBandcampEmbed(embedCode);
  if (!src) return null;

  // Bandcamp's native height depends on the embed variant — we never scale it.
  const { height } = getEmbedDimensions(src);
  const maxWidth = SIZE_MAX_WIDTH[size];

  return (
    <section id={anchor || undefined} className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-6">
        {heading && (
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">{heading}</h2>
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
            title={caption || heading || "Bandcamp player"}
            seamless
          />
        </div>

        {caption && (
          <p className="mt-3 text-sm text-foreground/70 text-center">
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}
