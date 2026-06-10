import Hero from "./blocks/Hero";
import ShowsBlock from "./blocks/ShowsBlock";
import VideoCarousel from "./blocks/VideoCarousel";
import YouTubeEmbed from "./blocks/YouTubeEmbed";
import BandcampEmbed from "./blocks/BandcampEmbed";
import PressBlock from "./blocks/PressBlock";
import TextBlock from "./blocks/TextBlock";
import NewsletterBlock from "./blocks/NewsletterBlock";
import SectionHeaderBlock from "./blocks/SectionHeaderBlock";

const blockComponents = {
  sectionHeaderBlock: SectionHeaderBlock,
  heroBlock: Hero,
  showsBlock: ShowsBlock,
  videoCarouselBlock: VideoCarousel,
  youtubeBlock: YouTubeEmbed,
  bandcampBlock: BandcampEmbed,
  pressBlock: PressBlock,
  textBlock: TextBlock,
  newsletterBlock: NewsletterBlock,
};

export default function BlockRenderer({ blocks }) {
  if (!blocks?.length) return null;

  return (
    <>
      {blocks.map((block) => {
        const Component = blockComponents[block._type];
        if (!Component) {
          // Unknown block type — fail gracefully rather than crashing.
          return (
            <div key={block._key} className="p-4 bg-yellow-100 text-yellow-900">
              Unknown block type: {block._type}
            </div>
          );
        }
        return <Component key={block._key} {...block} />;
      })}
    </>
  );
}
