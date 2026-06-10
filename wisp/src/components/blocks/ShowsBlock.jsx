import { getShows } from "@/lib/bandsintown";
import SectionHeader from "@/components/SectionHeader";
import Buttons from "@/components/Buttons";

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

// One row in either the upcoming or past list. Past shows skip the CTA
// button and get muted styling so the eye still lands on upcoming first.
function ShowRow({ show, cta, isPast }) {
  const venue = show.venue || {};
  const cityLine = [venue.city, venue.region, venue.country]
    .filter(Boolean)
    .join(", ");
  const ticketUrl =
    show.offers?.find((o) => o.type === "Tickets")?.url || show.url;

  return (
    <li
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-4 ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <div>
        <div className="font-medium">{formatDate(show.datetime)}</div>
        <div className="text-sm text-foreground/70">
          {venue.name}
          {cityLine && <span> — {cityLine}</span>}
        </div>
      </div>

      {!isPast && ticketUrl && (
        <a
          href={ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-foreground text-background text-sm font-medium rounded-full hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          {cta}
        </a>
      )}
    </li>
  );
}

export default async function ShowsBlock({
  anchor,
  header,
  limit,
  showPast,
  ctaLabel,
  emptyMessage,
  ctaButtons,
  ctaButtonsAlign,
}) {
  const artist = process.env.BANDSINTOWN_ARTIST;

  // Fetch upcoming. If past shows are requested, fetch those separately so
  // we can present them with a divider and reverse-chronological order.
  const upcoming = artist ? await getShows(artist, "upcoming") : [];
  const past = artist && showPast ? await getShows(artist, "past") : [];

  // Sort defensively in case Bandsintown returns out-of-order data.
  const upcomingSorted = [...upcoming].sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime),
  );
  const pastSortedNewestFirst = [...past].sort(
    (a, b) => new Date(b.datetime) - new Date(a.datetime),
  );

  // Apply the limit to upcoming only — past is meant to be "extra context"
  // and shouldn't eat the budget of a "next 3 shows" request.
  const upcomingShown =
    typeof limit === "number"
      ? upcomingSorted.slice(0, limit)
      : upcomingSorted;

  const cta = ctaLabel || "Info";
  const hasAny = upcomingShown.length > 0 || pastSortedNewestFirst.length > 0;

  return (
    <section
      id={anchor || undefined}
      className="px-6 py-12 sm:py-16 max-w-5xl mx-auto w-full scroll-mt-20"
    >
      {header && (
        <div className="mb-6">
          <SectionHeader value={header} />
        </div>
      )}

      {!hasAny ? (
        <p className="text-foreground/60">
          {emptyMessage || "No upcoming shows."}
        </p>
      ) : (
        <>
          {/* Upcoming */}
          {upcomingShown.length > 0 && (
            <ul className="divide-y divide-foreground/10">
              {upcomingShown.map((show) => (
                <ShowRow key={show.id} show={show} cta={cta} />
              ))}
            </ul>
          )}

          {/* Past — only if requested AND we actually got any */}
          {pastSortedNewestFirst.length > 0 && (
            <div className="mt-10">
              <h3 className="text-sm uppercase tracking-wide text-foreground/50 mb-3">
                Past shows
              </h3>
              <ul className="divide-y divide-foreground/10">
                {pastSortedNewestFirst.map((show) => (
                  <ShowRow key={show.id} show={show} isPast />
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {ctaButtons?.length > 0 && (
        <Buttons
          items={ctaButtons}
          align={ctaButtonsAlign || "center"}
          className="mt-10"
        />
      )}
    </section>
  );
}
