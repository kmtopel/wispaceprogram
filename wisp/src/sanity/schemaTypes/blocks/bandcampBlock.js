import { defineType, defineField } from "sanity";
import { parseBandcampEmbed } from "@/lib/bandcamp";
import { anchorField, ctaButtonsField, ctaButtonsAlignField } from "./_shared";

export const bandcampBlock = defineType({
  name: "bandcampBlock",
  title: "Bandcamp Embed",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "header",
      title: "Header",
      type: "sectionHeader",
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
        "How wide the player renders. Bandcamp's artwork players are fixed internally — for a truly fluid width, grab the Slim variant from Bandcamp's Share/Embed dialog.",
      initialValue: "large",
      options: {
        list: [
          { title: "Small (350px)", value: "small" },
          { title: "Medium (500px)", value: "medium" },
          { title: "Large (700px)", value: "large" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description:
        "Optional short label shown beneath the player. Basic markup allowed: <br>, <i>/<em>, <b>/<strong>, <u>, <small>.",
    }),
    ctaButtonsField,
    ctaButtonsAlignField,
  ],
  preview: {
    select: {
      heading: "header.heading",
      caption: "caption",
      embedCode: "embedCode",
    },
    prepare({ heading, caption, embedCode }) {
      const ok = !!parseBandcampEmbed(embedCode);
      return {
        title: heading || caption || "Bandcamp Embed",
        subtitle: ok ? "✓ valid embed" : "⚠ invalid embed",
      };
    },
  },
});
