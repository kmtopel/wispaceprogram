import { defineType, defineField } from "sanity";
import { anchorField, ctaButtonsField, ctaButtonsAlignField } from "./_shared";

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "header",
      title: "Header",
      type: "sectionHeader",
      description:
        "Heading, subheading, optional text, and CTA buttons. Leave blank to render only the background image.",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "image",
      options: { hotspot: true },
    }),
    ctaButtonsField,
    ctaButtonsAlignField,
  ],
  preview: {
    select: {
      heading: "header.heading",
      subheading: "header.subheading",
      media: "backgroundImage",
    },
    prepare({ heading, subheading, media }) {
      return {
        title: heading || "Hero",
        subtitle: subheading || "(no subheading)",
        media,
      };
    },
  },
});
