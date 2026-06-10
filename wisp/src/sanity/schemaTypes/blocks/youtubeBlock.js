import { defineType, defineField } from "sanity";
import { anchorField, ctaButtonsField, ctaButtonsAlignField } from "./_shared";
import { getYouTubeId, getYouTubeThumbnailUrl } from "@/lib/youtube";

// Tiny thumbnail used as the block's preview media in the Studio sidebar
// so editors can tell videos apart at a glance.
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

export const youtubeBlock = defineType({
  name: "youtubeBlock",
  title: "YouTube Video",
  type: "object",
  fields: [
    anchorField,
    defineField({
      name: "header",
      title: "Header",
      type: "sectionHeader",
      description:
        "Heading, subheading, optional text, and CTA buttons shown above the video.",
    }),
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
      description: "Paste any YouTube link — watch URL, share URL, or embed URL.",
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || getYouTubeId(value)
              ? true
              : "Couldn't find a YouTube video ID in that URL.",
          ),
    }),
    ctaButtonsField,
    ctaButtonsAlignField,
  ],
  preview: {
    select: { heading: "header.heading", url: "url" },
    prepare({ heading, url }) {
      return {
        title: heading || "YouTube Video",
        subtitle: url || "(no URL)",
        media: url ? <YouTubeThumb url={url} /> : undefined,
      };
    },
  },
});
