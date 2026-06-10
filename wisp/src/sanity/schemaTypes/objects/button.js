import { defineType, defineField } from "sanity";

// Reusable button object — single button with label, link, visual style, and
// new-tab toggle. Used inside the Section Header's `buttons` array, but can
// be reused anywhere we need a CTA.
export const buttonType = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description:
        "Basic markup allowed: <br>, <i>/<em>, <b>/<strong>, <u>, <small>.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Internal path (/shows) or full URL.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      initialValue: "primary",
      options: {
        list: [
          { title: "Primary (filled)", value: "primary" },
          { title: "Secondary (muted)", value: "secondary" },
          { title: "Outline", value: "outline" },
          { title: "Ghost (link-style)", value: "ghost" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      initialValue: "md",
      options: {
        list: [
          { title: "Small", value: "sm" },
          { title: "Medium", value: "md" },
          { title: "Large", value: "lg" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "newTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: "label", href: "href", style: "style" },
    prepare({ label, href, style }) {
      return {
        title: label || "(no label)",
        subtitle: `${style || "primary"} — ${href || "no link"}`,
      };
    },
  },
});
