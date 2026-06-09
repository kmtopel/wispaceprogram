import { getShows } from "@/lib/bandsintown";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function ShowsBlock({ anchor, heading, limit, emptyMessage }) {
  const artist = process.env.BANDSINTOWN_ARTIST;
  const allShows = artist ? await getShows(artist) : [];
  const shows = typeof limit === "number" ? allShows.slice(0, limit) : allShows;

  return (
    <section
      id={anchor || undefined}
      className="px-6 py-12 sm:py-16 max-w-5xl mx-auto w-full scroll-mt-20"
    >
      {heading && (
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">{heading}</h2>
      )}

      {shows.length === 0 ? (
        <p className="text-foreground/60">
          {emptyMessage || "No upcoming shows."}
        </p>
      ) : (
        <ul className="divide-y divide-foreground/10">
          {shows.map((show) => {
            const venue = show.venue || {};
            const cityLine = [venue.city, venue.region, venue.country]
              .filter(Boolean)
              .join(", ");
            const ticketUrl =
              show.offers?.find((o) => o.type === "Tickets")?.url || show.url;

            return (
              <li
                key={show.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4"
              >
                <div>
                  <div className="font-medium">{formatDate(show.datetime)}</div>
                  <div className="text-sm text-foreground/70">
                    {venue.name}
                    {cityLine && <span> — {cityLine}</span>}
                  </div>
                </div>

                {ticketUrl && (
                  <a
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-90 transition-opacity self-start sm:self-auto"
                  >
                    Tickets
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
