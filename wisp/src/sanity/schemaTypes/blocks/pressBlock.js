import { defineType, defineField } from "sanity";
import { anchorField } from "./_shared";

export const pressBlock = defineType({
  name: "pressBlock",
  title: "Press",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Press",
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
  ],
  preview: {
    select: { heading: "heading", limit: "limit" },
    prepare({ heading, limit }) {
      return {
        title: heading || "Press",
        subtitle: limit ? `Showing latest ${limit}` : "Showing all",
      };
    },
  },
});
