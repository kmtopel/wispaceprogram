import { defineType, defineField } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton — there should only ever be one of these.
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      initialValue: "WI Space Program",
    }),
    defineField({
      name: "description",
      title: "Site description",
      type: "text",
      rows: 2,
      description: "Used for SEO and social sharing.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Bandcamp", value: "bandcamp" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Spotify", value: "spotify" },
                  { title: "Apple Music", value: "appleMusic" },
                  { title: "Facebook", value: "facebook" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "X / Twitter", value: "twitter" },
                  { title: "Other", value: "other" },
                ],
              },
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              description: "Override display label (optional).",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { platform: "platform", label: "label", url: "url" },
            prepare({ platform, label, url }) {
              return { title: label || platform || url, subtitle: url };
            },
          },
        },
      ],
    }),
    defineField({
      name: "footerText",
      title: "Footer text",
      type: "string",
      description: "Shown in the site footer. Supports plain text only.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
