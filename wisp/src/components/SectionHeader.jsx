import { PortableText } from "@portabletext/react";
import RichString from "@/components/RichString";
import Buttons from "@/components/Buttons";

// Visual size presets, decoupled from semantic heading level. When an editor
// sets level=h3 but headingSize=display, the rendered element is <h3> with
// display-sized typography. If headingSize is blank, we fall back to a
// default for each level so the simple case ("just use h2") still works.
const SIZE_CLASSES = {
  sm: "text-lg sm:text-xl",
  md: "text-xl sm:text-2xl",
  lg: "text-2xl sm:text-3xl",
  xl: "text-3xl sm:text-4xl",
  "display-2": "text-4xl sm:text-5xl md:text-6xl",
  "display-1": "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
  // Backward-compat for any existing blocks that stored the old "display"
  // value before we split it into 1 and 2.
  display: "text-4xl sm:text-5xl md:text-6xl",
};

const LEVEL_DEFAULT_SIZE = {
  h1: "display-1",
  h2: "lg",
  h3: "md",
  h4: "md",
  h5: "sm",
  h6: "sm",
};

const ALIGN_CLASSES = {
  left: { container: "text-left", buttons: "left" },
  center: { container: "text-center", buttons: "center" },
  right: { container: "text-right", buttons: "right" },
};

// Width caps for the whole header. 75% / 67% are relative to the
// surrounding section's content width (max-w-5xl = 64rem) — Tailwind's
// max-w-3xl (48rem) and max-w-2xl (42rem) land at those proportions.
const WIDTH_CLASSES = {
  full: "",
  "three-quarters": "max-w-3xl mx-auto",
  "two-thirds": "max-w-2xl mx-auto",
};

// Portable Text serializers for the "text" field — basic prose styling.
const textComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-3 leading-relaxed text-foreground/85">{children}</p>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl sm:text-2xl font-bold mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg sm:text-xl font-semibold mt-5 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-foreground/30 pl-4 italic my-4 text-foreground/80">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-3 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-3 space-y-1">{children}</ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    code: ({ children }) => (
      <code className="bg-foreground/10 rounded px-1.5 py-0.5 text-sm font-mono">
        {children}
      </code>
    ),
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
};

// Renders a Sanity `sectionHeader` object. Heading, subheading, optional
// prose text, and an optional row of CTA buttons — all sharing one
// alignment setting.
//
// Reuse anywhere a block needs heading-area content: as the standalone
// Section Header block, or as a field inside other blocks.
export default function SectionHeader({ value }) {
  if (!value) return null;

  const {
    heading,
    headingLevel,
    headingSize,
    subheading,
    text,
    buttons,
    align,
    contentAlign,
    width,
  } = value;

  if (!heading && !subheading && !text?.length && !buttons?.length) {
    return null;
  }

  const level = headingLevel || "h2";
  const size = headingSize || LEVEL_DEFAULT_SIZE[level] || "md";
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const a = ALIGN_CLASSES[align || "center"] || ALIGN_CLASSES.center;
  const widthClass = WIDTH_CLASSES[width || "full"] ?? "";

  return (
    <div className={`${widthClass} ${a.container}`.trim()}>
      {heading && (
        <RichString
          as={level}
          value={heading}
          className={`${sizeClass} font-bold tracking-tight`}
        />
      )}
      {subheading && (
        <RichString
          as="p"
          value={subheading}
          className="mt-2 text-base sm:text-lg text-foreground/70"
        />
      )}
      {text?.length > 0 && (
        <div
          className={`mt-4 ${
            (contentAlign || "left") === "center" ? "text-center" : "text-left"
          }`}
        >
          <PortableText value={text} components={textComponents} />
        </div>
      )}
      {buttons?.length > 0 && (
        <Buttons items={buttons} align={a.buttons} className="mt-6" />
      )}
    </div>
  );
}
