import { defineType, defineField } from "sanity";
import { anchorField } from "./_shared";

// Standalone block that just renders a Section Header. Editors who want a
// header on its own (without a Bandcamp/YouTube/etc. below it) drop this in.
//
// Other blocks can also include a `header: { type: "sectionHeader" }` field
// to embed the same control structure within their own UI.
export const sectionHeaderBlock = defineType({
  name: "sectionHeaderBlock",
  title: "Section Header",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "header",
      title: "Header",
      type: "sectionHeader",
    }),
  ],
  preview: {
    select: { heading: "header.heading", subheading: "header.subheading" },
    prepare({ heading, subheading }) {
      return {
        title: heading || "Section Header",
        subtitle: subheading || "(no subheading)",
      };
    },
  },
});
