import { defineType, defineField } from "sanity";
import { anchorField, ctaButtonsField, ctaButtonsAlignField } from "./_shared";

export const newsletterBlock = defineType({
  name: "newsletterBlock",
  title: "Newsletter Signup",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "header",
      title: "Header",
      type: "sectionHeader",
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label",
      type: "string",
    }),
    defineField({
      name: "placeholder",
      title: "Email placeholder",
      type: "string",
    }),
    defineField({
      name: "successMessage",
      title: "Success message",
      type: "string",
      description: "Shown after a successful signup.",
    }),
    ctaButtonsField,
    ctaButtonsAlignField,
  ],
  preview: {
    select: { heading: "header.heading", subheading: "header.subheading" },
    prepare({ heading, subheading }) {
      return {
        title: heading || "Newsletter Signup",
        subtitle: subheading || "(no subheading)",
      };
    },
  },
});
