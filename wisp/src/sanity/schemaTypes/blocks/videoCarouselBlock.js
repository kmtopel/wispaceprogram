import { defineType, defineField } from "sanity";
import { anchorField } from "./_shared";
import { getYouTubeThumbnailUrl } from "@/lib/youtube";

// Tiny preview image component used as the Studio list media.
// Sanity auto-sizes media slots to ~25x25 up to ~40x40 depending on context.
function YouTubeThumb({ url }) {
  const src = getYouTubeThumbnailUrl(url);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}

export const videoCarouselBlock = defineType({
  name: "videoCarouselBlock",
  title: "Video Carousel",
  type: "object",
  fields: [
    anchorField,
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
              return {
                title: title || url || "Video",
                subtitle: url || "YouTube video",
                media: url ? <YouTubeThumb url={url} /> : undefined,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      heading: "heading",
      videos: "videos",
      firstUrl: "videos.0.url",
    },
    prepare({ heading, videos, firstUrl }) {
      const count = videos?.length || 0;
      return {
        title: heading || "Video Carousel",
        subtitle: `${count} video${count === 1 ? "" : "s"}`,
        media: firstUrl ? <YouTubeThumb url={firstUrl} /> : undefined,
      };
    },
  },
});
