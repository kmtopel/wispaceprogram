import { defineType, defineField } from "sanity";
import { anchorField, ctaButtonsField, ctaButtonsAlignField } from "./_shared";

export const showsBlock = defineType({
  name: "showsBlock",
  title: "Shows Index",
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
      description:
        "Optional. Leave blank to show all matching shows. Applies after filtering by date.",
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      name: "showPast",
      title: "Include past shows",
      type: "boolean",
      description:
        "When on, past shows are listed below upcoming ones in reverse chronological order. CTA buttons are hidden for past shows.",
      initialValue: false,
    }),
    defineField({
      name: "ctaLabel",
      title: "Show CTA label",
      type: "string",
      description:
        'Label for the button next to each show, linking to the show page on Bandsintown. Default: "Info" (works for free shows too).',
      initialValue: "Info",
    }),
    defineField({
      name: "emptyMessage",
      title: "Empty state message",
      type: "string",
      description: 'Shown when there are no upcoming shows. Default: "No upcoming shows."',
    }),
    ctaButtonsField,
    ctaButtonsAlignField,
  ],
  preview: {
    select: { heading: "header.heading", limit: "limit" },
    prepare({ heading, limit }) {
      return {
        title: heading || "Shows Index",
        subtitle: limit ? `Showing next ${limit}` : "Showing all",
      };
    },
  },
});
