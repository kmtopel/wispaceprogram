import Hero from "./blocks/Hero";
import ShowsBlock from "./blocks/ShowsBlock";

const blockComponents = {
  heroBlock: Hero,
  showsBlock: ShowsBlock,
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
