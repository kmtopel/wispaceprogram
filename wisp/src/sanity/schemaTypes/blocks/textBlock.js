import { defineType, defineField, defineArrayMember } from "sanity";
import { anchorField, ctaButtonsField, ctaButtonsAlignField } from "./_shared";
import { MutuallyExclusiveAlignmentInput } from "../../components/MutuallyExclusiveAlignmentInput";

// Tiny toolbar icon for the alignment decorators. SVG inline so we don't need
// to ship a separate icon import.
function AlignIcon({ dir }) {
  // Three stacked lines with widths/positions hinting at alignment direction.
  const lines = {
    left: [
      { x: 2, w: 16 },
      { x: 2, w: 12 },
      { x: 2, w: 14 },
    ],
    center: [
      { x: 4, w: 12 },
      { x: 2, w: 16 },
      { x: 4, w: 12 },
    ],
    right: [
      { x: 2, w: 16 },
      { x: 6, w: 12 },
      { x: 4, w: 14 },
    ],
  }[dir];
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      {lines.map((l, i) => (
        <rect
          key={i}
          x={l.x}
          y={4 + i * 5}
          width={l.w}
          height="2"
          rx="1"
        />
      ))}
    </svg>
  );
}

// Renders an aligned span as block-level so the alignment is visible in the
// Studio editor itself, not just on the rendered frontend.
function AlignedSpan({ children, dir }) {
  return (
    <span style={{ display: "block", textAlign: dir }} data-align={dir}>
      {children}
    </span>
  );
}

// Generic rich-text block. Editors get the full Portable Text editor with
// formatting (bold/italic/code), headings, lists, links, and inline image
// uploads — anything heavier (callouts, columns, etc.) should be its own block.
export const textBlock = defineType({
  name: "textBlock",
  title: "Rich Text",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      components: { input: MutuallyExclusiveAlignmentInput },
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
              { title: "Code", value: "code" },
              {
                title: "Align left",
                value: "align-left",
                icon: () => <AlignIcon dir="left" />,
                component: ({ children }) => (
                  <AlignedSpan dir="left">{children}</AlignedSpan>
                ),
              },
              {
                title: "Align center",
                value: "align-center",
                icon: () => <AlignIcon dir="center" />,
                component: ({ children }) => (
                  <AlignedSpan dir="center">{children}</AlignedSpan>
                ),
              },
              {
                title: "Align right",
                value: "align-right",
                icon: () => <AlignIcon dir="right" />,
                component: ({ children }) => (
                  <AlignedSpan dir="right">{children}</AlignedSpan>
                ),
              },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                  {
                    name: "openInNewTab",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        }),
        // Inline image uploads.
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt text",
              description:
                "Describe the image for screen readers and SEO. Leave blank only if purely decorative.",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
            {
              name: "maxWidth",
              type: "number",
              title: "Max width (px)",
              description:
                "Optional. Maximum display width in pixels. Leave blank to fill the text column.",
              validation: (rule) => rule.positive().integer(),
            },
          ],
        }),
      ],
    }),
    ctaButtonsField,
    ctaButtonsAlignField,
  ],
  preview: {
    select: { body: "body" },
    prepare({ body }) {
      // Pull the first text fragment for the subtitle.
      const firstBlock = body?.find((b) => b._type === "block");
      const text = firstBlock?.children
        ?.filter((c) => c._type === "span")
        .map((c) => c.text)
        .join("")
        .slice(0, 80);
      return {
        title: "Rich Text",
        subtitle: text || "(empty)",
      };
    },
  },
});
