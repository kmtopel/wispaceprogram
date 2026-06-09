import { defineType, defineField } from "sanity";
import { anchorField } from "./_shared";

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "Optional — leave blank to show only the logo/image.",
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "string",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA label",
      type: "string",
      description: "Optional button text.",
    }),
    defineField({
      name: "ctaHref",
      title: "CTA link",
      type: "url",
      description: "Where the button goes. Internal paths (/shows) or full URLs.",
      validation: (rule) =>
        rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
  preview: {
    select: { heading: "heading", subheading: "subheading", media: "backgroundImage" },
    prepare({ heading, subheading, media }) {
      return {
        title: heading || "Hero",
        subtitle: subheading || "(no subheading)",
        media,
      };
    },
  },
});
