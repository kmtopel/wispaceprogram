import Image from "next/image";
import { client, sanityFetchOptions } from "@/sanity/client";
import { pressItemsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/image";

function formatDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export default async function PressBlock({
  anchor,
  heading,
  limit,
  emptyMessage,
}) {
  const all = await client.fetch(pressItemsQuery, {}, sanityFetchOptions);
  const items = typeof limit === "number" ? all.slice(0, limit) : all;

  return (
    <section
      id={anchor || undefined}
      className="px-6 py-12 sm:py-16 max-w-5xl mx-auto w-full scroll-mt-20"
    >
      {heading && (
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">{heading}</h2>
      )}

      {items.length === 0 ? (
        <p className="text-foreground/60">
          {emptyMessage || "No press items yet."}
        </p>
      ) : (
        <ul className="divide-y divide-foreground/10">
          {items.map((item) => {
            const date = formatDate(item.publishedAt);
            const thumb = item.image
              ? urlFor(item.image).width(240).height(240).fit("crop").url()
              : null;

            return (
              <li key={item._id} className="py-5">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-4 items-start"
                >
                  {thumb && (
                    <div className="flex-none w-20 h-20 sm:w-28 sm:h-28 relative overflow-hidden rounded-md bg-foreground/5">
                      <Image
                        src={thumb}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 7rem, 5rem"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="text-xs uppercase tracking-wide text-foreground/60">
                      {item.outlet}
                      {date && <span> · {date}</span>}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold group-hover:underline underline-offset-4">
                      {item.title}
                    </h3>
                    {item.quote && (
                      <p className="mt-2 text-sm text-foreground/70 italic">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    )}
                  </div>

                  <span
                    aria-hidden
                    className="flex-none text-foreground/40 group-hover:text-foreground transition-colors pt-1"
                  >
                    ↗
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
