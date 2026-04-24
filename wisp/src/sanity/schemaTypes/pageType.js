import { defineType, defineField } from "sanity";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      description: "URL path. Use 'home' for the home page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "blocks",
      title: "Page blocks",
      type: "array",
      of: [{ type: "heroBlock" }],
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug === "home" ? "/" : `/${slug}`,
      };
    },
  },
});
