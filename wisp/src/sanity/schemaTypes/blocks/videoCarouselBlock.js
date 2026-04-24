import { defineType, defineField } from "sanity";

export const videoCarouselBlock = defineType({
  name: "videoCarouselBlock",
  title: "Video Carousel",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "videos",
      title: "Videos",
      type: "array",
      validation: (rule) => rule.min(1),
      of: [
        {
          type: "object",
          name: "video",
          fields: [
            defineField({
              name: "url",
              title: "YouTube URL",
              type: "url",
              description:
                "Full URL, e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...",
              validation: (rule) =>
                rule
                  .required()
                  .uri({ scheme: ["http", "https"] })
                  .custom((value) => {
                    if (!value) return true;
                    return /youtube\.com|youtu\.be/.test(value) ||
                      "Must be a YouTube URL.";
                  }),
            }),
            defineField({
              name: "title",
              title: "Title override",
              type: "string",
              description: "Optional — shown below the video. Leave blank to hide.",
            }),
          ],
          preview: {
            select: { title: "title", url: "url" },
            prepare({ title, url }) {
              return { title: title || url, subtitle: "YouTube video" };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { heading: "heading", videos: "videos" },
    prepare({ heading, videos }) {
      const count = videos?.length || 0;
      return {
        title: heading || "Video Carousel",
        subtitle: `${count} video${count === 1 ? "" : "s"}`,
      };
    },
  },
});
