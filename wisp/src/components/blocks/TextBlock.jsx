import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/image";
import Buttons from "@/components/Buttons";

// Inline image renderer. Honors the per-image `maxWidth` (in px) set in Studio —
// constrains max-width and keeps the image centered within the text column.
// Uses next/image with width/height (preserving native aspect) when the
// image asset metadata exposes dimensions; falls back to a sensible aspect.
function ImageInBody({ value }) {
  if (!value?.asset) return null;
  const maxW =
    typeof value.maxWidth === "number" && value.maxWidth > 0
      ? value.maxWidth
      : null;
  const src = urlFor(value).width(1600).url();
  // Sanity asset metadata includes original dimensions on `asset.metadata.dimensions`
  // but we may not have asked for it in the projection — fall back to a width
  // and let the browser keep aspect via height: auto.
  const dims = value.asset?.metadata?.dimensions;

  return (
    <figure
      className="my-8 mx-auto"
      style={maxW ? { maxWidth: `${maxW}px` } : undefined}
    >
      {dims?.width && dims?.height ? (
        <Image
          src={src}
          alt={value.alt || ""}
          width={dims.width}
          height={dims.height}
          className="w-full h-auto"
          sizes={maxW ? `${maxW}px` : "(min-width: 1024px) 1024px, 100vw"}
        />
      ) : (
        // Fallback when we don't have dimensions in the projection.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={value.alt || ""}
          className="w-full h-auto block"
        />
      )}
      {value.caption && (
        <figcaption className="mt-2 text-sm text-center text-foreground/60">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
}

// Resolve a block's alignment from its children's marks.
// Priority order (so multiple toggled marks resolve cleanly):
//   right > center > left (default)
// Editors apply marks individually in the toolbar, but the rendered output
// always reflects a single alignment per block.
function getBlockAlignment(block) {
  const spans = (block?.children || []).filter((c) => c._type === "span");
  if (spans.length === 0) return null;

  const has = (mark) =>
    spans.every((s) => (s.marks || []).includes(mark));

  if (has("align-right")) return "text-right";
  if (has("align-center")) return "text-center";
  if (has("align-left")) return "text-left"; // explicit override of any inherited alignment
  return null;
}

// Custom serializers map Portable Text nodes to Tailwind-styled JSX.
// Headings/text styles match site rhythm; images are responsive.
const components = {
  block: {
    normal: ({ value, children }) => (
      <p
        className={`mb-4 leading-relaxed text-foreground/90 ${getBlockAlignment(value) || ""}`}
      >
        {children}
      </p>
    ),
    h2: ({ value, children }) => (
      <h2
        className={`text-2xl sm:text-3xl font-bold mt-10 mb-4 ${getBlockAlignment(value) || ""}`}
      >
        {children}
      </h2>
    ),
    h3: ({ value, children }) => (
      <h3
        className={`text-xl sm:text-2xl font-bold mt-8 mb-3 ${getBlockAlignment(value) || ""}`}
      >
        {children}
      </h3>
    ),
    h4: ({ value, children }) => (
      <h4
        className={`text-lg sm:text-xl font-semibold mt-6 mb-2 ${getBlockAlignment(value) || ""}`}
      >
        {children}
      </h4>
    ),
    blockquote: ({ value, children }) => (
      <blockquote
        className={`border-l-4 border-foreground/30 pl-4 italic my-6 text-foreground/80 ${getBlockAlignment(value) || ""}`}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => (
      <span className="line-through">{children}</span>
    ),
    code: ({ children }) => (
      <code className="bg-foreground/10 rounded px-1.5 py-0.5 text-sm font-mono">
        {children}
      </code>
    ),
    // Alignment marks are read at the block level (see getBlockAlignment).
    // They don't render any inline wrapping — pass children through.
    "align-left": ({ children }) => children,
    "align-center": ({ children }) => children,
    "align-right": ({ children }) => children,
    link: ({ value, children }) => {
      const newTab = value?.openInNewTab;
      return (
        <a
          href={value?.href}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
          className="underline underline-offset-2 hover:opacity-70"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ImageInBody,
  },
};

export default function TextBlock({ anchor, body, ctaButtons, ctaButtonsAlign }) {
  if (!body?.length && !ctaButtons?.length) return null;

  return (
    <section
      id={anchor || undefined}
      className="py-12 sm:py-16 scroll-mt-20"
    >
      {/* Matches max-w-5xl (1024px) used by other content blocks for a
          consistent rhythm across the page. */}
      <div className="max-w-5xl mx-auto px-6">
        {body?.length > 0 && (
          <PortableText value={body} components={components} />
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
