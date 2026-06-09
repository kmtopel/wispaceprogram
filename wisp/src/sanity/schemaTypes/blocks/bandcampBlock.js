import { defineType, defineField } from "sanity";
import { parseBandcampEmbed } from "@/lib/bandcamp";
import { anchorField } from "./_shared";

export const bandcampBlock = defineType({
  name: "bandcampBlock",
  title: "Bandcamp Embed",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "embedCode",
      title: "Embed code or URL",
      type: "text",
      rows: 4,
      description:
        "On Bandcamp, open the album/track → Share/Embed → copy the iframe code and paste it here. Just pasting the embed URL also works.",
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return "Paste the Bandcamp embed code.";
          return parseBandcampEmbed(value)
            ? true
            : "Couldn't find a Bandcamp embed URL in that input.";
        }),
    }),
    defineField({
      name: "size",
      title: "Display size",
      type: "string",
      description:
        "How wide the player renders on the page. Bandcamp's native width is 350px; larger sizes scale the embed up.",
      initialValue: "full",
      options: {
        list: [
          { title: "Small (350px)", value: "small" },
          { title: "Medium (500px)", value: "medium" },
          { title: "Large (700px)", value: "large" },
          { title: "Full width", value: "full" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional short label shown beneath the player.",
    }),
  ],
  preview: {
    select: { heading: "heading", caption: "caption", embedCode: "embedCode" },
    prepare({ heading, caption, embedCode }) {
      const ok = !!parseBandcampEmbed(embedCode);
      return {
        title: heading || caption || "Bandcamp Embed",
        subtitle: ok ? "✓ valid embed" : "⚠ invalid embed",
      };
    },
  },
});
