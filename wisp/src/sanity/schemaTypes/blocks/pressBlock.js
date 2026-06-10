import { defineType, defineField } from "sanity";
import { anchorField, ctaButtonsField, ctaButtonsAlignField } from "./_shared";

export const pressBlock = defineType({
  name: "pressBlock",
  title: "Press",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "header",
      title: "Header",
      type: "sectionHeader",
    }),
    defineField({
      name: "limit",
      title: "Limit",
      type: "number",
      description: "Optional. Leave blank to show all press items.",
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: "emptyMessage",
      title: "Empty state message",
      type: "string",
      description: 'Default: "No press items yet."',
    }),
    ctaButtonsField,
    ctaButtonsAlignField,
  ],
  preview: {
    select: { heading: "header.heading", limit: "limit" },
    prepare({ heading, limit }) {
      return {
        title: heading || "Press",
        subtitle: limit ? `Showing latest ${limit}` : "Showing all",
      };
    },
  },
});
