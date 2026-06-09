import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";

export default function Hero({ anchor, heading, subheading, backgroundImage, ctaLabel, ctaHref }) {
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

      <div className="text-center px-6 py-12 sm:py-16 max-w-3xl mx-auto">
        {heading && (
          <h1 className="text-2xl sm:text-4xl font-bold mb-3">{heading}</h1>
        )}

        {subheading && (
          <p className="text-lg sm:text-xl text-foreground/70 mb-6">{subheading}</p>
        )}

        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-block px-6 py-3 bg-foreground text-background font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
