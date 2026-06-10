import { defineType, defineField, defineArrayMember } from "sanity";

// Reusable "section header" composition: heading + level/size controls,
// subheading, optional rich text, and a buttons group. Drop this into any
// block schema as a field of type "sectionHeader" — or use the dedicated
// sectionHeaderBlock to render it on its own.
export const sectionHeaderType = defineType({
  name: "sectionHeader",
  title: "Section Header",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        "Basic markup allowed: <br>, <i>/<em>, <b>/<strong>, <u>, <small>.",
    }),
    defineField({
      name: "headingLevel",
      title: "Heading level",
      type: "string",
      description:
        "Semantic HTML element. Picks the visual weight too unless overridden by size below. Use H1 sparingly — only one per page.",
      initialValue: "h2",
      options: {
        list: [
          { title: "H1", value: "h1" },
          { title: "H2", value: "h2" },
          { title: "H3", value: "h3" },
          { title: "H4", value: "h4" },
          { title: "H5", value: "h5" },
          { title: "H6", value: "h6" },
        ],
      },
    }),
    defineField({
      name: "headingSize",
      title: "Heading size",
      type: "string",
      description:
        "Overrides the visual size independent of the semantic level. Leave blank to match the level (h1 = largest, h6 = smallest).",
      options: {
        list: [
          { title: "Small", value: "sm" },
          { title: "Medium", value: "md" },
          { title: "Large", value: "lg" },
          { title: "Extra large", value: "xl" },
          { title: "Display 2", value: "display-2" },
          { title: "Display 1", value: "display-1" },
        ],
      },
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "string",
      description: "Same markup rules as the heading.",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      description: "Optional rich text shown beneath the subheading.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
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
              { title: "Code", value: "code" },
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
      ],
    }),
    defineField({
      name: "buttons",
      title: "Buttons",
      type: "array",
      description: "Optional CTA group. Drag to reorder.",
      of: [defineArrayMember({ type: "button" })],
    }),
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      description:
        "Constrain how wide the header block renders within its section. Defaults to the full content width.",
      initialValue: "full",
      options: {
        list: [
          { title: "Full (content width)", value: "full" },
          { title: "75% of content width", value: "three-quarters" },
          { title: "67% of content width", value: "two-thirds" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "align",
      title: "Alignment",
      type: "string",
      description:
        "Horizontal alignment for the heading, subheading, and buttons.",
      initialValue: "center",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "contentAlign",
      title: "Content alignment",
      type: "string",
      description:
        "Alignment of the rich-text body. Body copy is usually best left-aligned for readability even when the rest of the header is centered.",
      initialValue: "left",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Center", value: "center" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { heading: "heading", subheading: "subheading" },
    prepare({ heading, subheading }) {
      return {
        title: heading || "Section Header",
        subtitle: subheading || "(no subheading)",
      };
    },
  },
});
