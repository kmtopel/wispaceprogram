import { defineType, defineField } from "sanity";

export const pressItemType = defineType({
  name: "pressItem",
  title: "Press Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Article title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "outlet",
      title: "Publication / outlet",
      type: "string",
      description: "e.g., Milwaukee Record, Pitchfork, NPR",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Article URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "date",
      description: "When the article ran.",
    }),
    defineField({
      name: "quote",
      title: "Pull quote",
      type: "text",
      rows: 3,
      description: "Optional short excerpt or blurb from the article.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      description: "Optional — article screenshot or related photo.",
    }),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      outlet: "outlet",
      publishedAt: "publishedAt",
      media: "image",
    },
    prepare({ title, outlet, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";
      return {
        title,
        subtitle: [outlet, date].filter(Boolean).join(" — "),
        media,
      };
    },
  },
});
