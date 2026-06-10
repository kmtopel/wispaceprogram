import Link from "next/link";
import RichString from "@/components/RichString";

// Renders a group of buttons from a Sanity `buttons` array. Each item
// follows the `button` object schema (label, href, style, size, newTab).
//
// Internal hrefs (starting with "/") use next/link for client-side
// navigation. Everything else uses a plain anchor.

const STYLE_CLASSES = {
  primary:
    "bg-foreground text-background hover:opacity-90 border border-foreground",
  secondary:
    "bg-foreground/10 text-foreground hover:bg-foreground/15 border border-transparent",
  outline:
    "bg-transparent text-foreground hover:bg-foreground/5 border border-foreground/30",
  ghost:
    "bg-transparent text-foreground hover:underline border border-transparent",
};

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3 text-lg",
};

export default function Buttons({ items, className = "", align = "left" }) {
  if (!items?.length) return null;

  const justify =
    align === "right"
      ? "justify-end"
      : align === "center"
        ? "justify-center"
        : "justify-start";

  return (
    <div className={`flex flex-wrap gap-3 ${justify} ${className}`}>
      {items.map((item) => {
        const styleClass = STYLE_CLASSES[item.style] || STYLE_CLASSES.primary;
        const sizeClass = SIZE_CLASSES[item.size] || SIZE_CLASSES.md;
        const className = `inline-flex items-center rounded-full font-medium transition-colors duration-200 ${sizeClass} ${styleClass}`;
        const isInternal = item.href?.startsWith("/");

        if (isInternal && !item.newTab) {
          return (
            <Link key={item._key} href={item.href} className={className}>
              <RichString as="span" value={item.label} />
            </Link>
          );
        }
        return (
          <a
            key={item._key}
            href={item.href}
            target={item.newTab ? "_blank" : undefined}
            rel={item.newTab ? "noopener noreferrer" : undefined}
            className={className}
          >
            <RichString as="span" value={item.label} />
          </a>
        );
      })}
    </div>
  );
}
