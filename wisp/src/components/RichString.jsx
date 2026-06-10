// Renders a plain Sanity string while allowing a small whitelist of inline
// HTML tags. Used for headings/captions/subheads where editors occasionally
// want a line break or italics without us reaching for full Portable Text.
//
// Whitelist: <br>, <i>, <em>, <b>, <strong>, <u>, <small>
// Anything else is rendered as text. Attributes are never preserved, so
// there's no path to inject onclick handlers, srcs, etc.

const ALLOWED_TAGS_RE =
  /&lt;(\/?(?:br|i|em|b|strong|u|small)\s*\/?)&gt;/gi;

function sanitize(str) {
  if (typeof str !== "string") return "";
  // 1. Escape everything (defangs all HTML).
  // 2. Re-allow only the whitelisted tags (no attributes possible).
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(ALLOWED_TAGS_RE, "<$1>");
}

export default function RichString({ as: As = "span", value, className }) {
  if (!value) return null;
  return (
    <As
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitize(value) }}
    />
  );
}
