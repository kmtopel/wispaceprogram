// Parse a Bandcamp embed input into a clean iframe src URL.
// Accepts either:
//   1) A full iframe embed snippet from Bandcamp (Share → Embed)
//   2) The raw src URL (https://bandcamp.com/EmbeddedPlayer/...)
//
// Returns the embed URL, or null if input is not a valid Bandcamp embed.

const EMBED_HOST_PATTERN = /^https?:\/\/bandcamp\.com\/EmbeddedPlayer\//i;

export function parseBandcampEmbed(input) {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();

  // Case 1: raw URL
  if (EMBED_HOST_PATTERN.test(trimmed)) {
    return normalizeUrl(trimmed);
  }

  // Case 2: iframe HTML — pull out the src="..." value
  const match = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  if (match && EMBED_HOST_PATTERN.test(match[1])) {
    return normalizeUrl(match[1]);
  }

  return null;
}

function normalizeUrl(url) {
  // Force https and strip any whitespace that sneaks in.
  return url.replace(/^http:/, "https:").replace(/\s+/g, "");
}

// Bandcamp embed URLs use path segments like "album=12345" / "size=large".
// Extract them as key/value pairs so we can inspect layout.
export function parseBandcampParams(url) {
  if (!url) return {};
  const params = {};
  const path = url.replace(/^https?:\/\/bandcamp\.com\/EmbeddedPlayer\/?/i, "");
  path.split("/").forEach((segment) => {
    if (!segment) return;
    const eq = segment.indexOf("=");
    if (eq > 0) {
      params[segment.slice(0, eq)] = segment.slice(eq + 1);
    }
  });
  return params;
}

// The "large" size embed is typically 350x470 (with artwork + tracklist).
// Without tracklist, it's 350x350. "small" is 400x42.
export function getEmbedDimensions(url) {
  const p = parseBandcampParams(url);
  const size = p.size || "large";
  const hasTracklist = p.tracklist === "true";

  if (size === "small") {
    return { width: 400, height: 42 };
  }
  // large
  return {
    width: 350,
    height: hasTracklist ? 470 : 350,
  };
}
