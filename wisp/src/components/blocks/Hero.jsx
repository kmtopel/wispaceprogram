import Image from "next/image";
import { urlFor } from "@/sanity/image";
import SectionHeader from "@/components/SectionHeader";
import Buttons from "@/components/Buttons";

export default function Hero({
  anchor,
  header,
  backgroundImage,
  ctaButtons,
  ctaButtonsAlign,
}) {
  const imageUrl = backgroundImage ? urlFor(backgroundImage).width(2400).url() : null;

  return (
    <section id={anchor || undefined} className="flex flex-col scroll-mt-20">
      {imageUrl && (
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}

      {(header || ctaButtons?.length > 0) && (
        <div className="px-6 py-12 sm:py-16 max-w-5xl mx-auto w-full">
          {header && <SectionHeader value={header} />}
          {ctaButtons?.length > 0 && (
            <Buttons
              items={ctaButtons}
              align={ctaButtonsAlign || "center"}
              className="mt-8"
            />
          )}
        </div>
      )}
    </section>
  );
}
