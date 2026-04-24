import { defineType, defineField } from "sanity";

export const showsBlock = defineType({
  name: "showsBlock",
  title: "Shows Index",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Shows",
    }),
    defineField({
      name: "limit",
      title: "Limit",
      type: "number",
      description: "Optional. Leave blank to show all upcoming shows.",
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: "emptyMessage",
      title: "Empty state message",
      type: "string",
      description: 'Shown when there are no upcoming shows. Default: "No upcoming shows."',
    }),
  ],
  preview: {
    select: { heading: "heading", limit: "limit" },
    prepare({ heading, limit }) {
      return {
        title: heading || "Shows Index",
        subtitle: limit ? `Showing next ${limit}` : "Showing all",
      };
    },
  },
});
