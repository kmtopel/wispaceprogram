// Bandsintown API helper.
// Uses Next.js fetch with `revalidate: 3600` (1 hour) so the same data is served
// from cache for up to an hour before refetching. Tagged for on-demand revalidation.

const API_BASE = "https://rest.bandsintown.com";
const REVALIDATE_SECONDS = 60 * 60; // 1 hour
export const SHOWS_CACHE_TAG = "bandsintown-shows";

/**
 * Fetches events for an artist.
 * @param {string} artist — Bandsintown artist name
 * @param {"upcoming"|"past"|"all"} [date] — which events to fetch
 * Returns an array (possibly empty). Soft-fails on errors.
 */
export async function getShows(artist, date = "upcoming") {
  if (!artist) return [];

  const apiKey = process.env.BANDSINTOWN_API_KEY;
  if (!apiKey) {
    console.warn("BANDSINTOWN_API_KEY is not set; returning no shows.");
    return [];
  }

  const url = `${API_BASE}/artists/${encodeURIComponent(
    artist,
  )}/events?app_id=${encodeURIComponent(apiKey)}&date=${encodeURIComponent(date)}`;

  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [SHOWS_CACHE_TAG] },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    console.error(
      `Bandsintown request failed: ${res.status} ${res.statusText}`,
    );
    return [];
  }

  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data;
}
