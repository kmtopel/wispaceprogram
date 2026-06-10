// Extract a YouTube video ID from any common URL format.
// Returns null if no ID can be parsed.
export function getYouTubeId(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    // youtu.be/<id>
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }

    // youtube.com/watch?v=<id>
    const v = parsed.searchParams.get("v");
    if (v) return v;

    // youtube.com/embed/<id> or /shorts/<id> or /v/<id>
    const match = parsed.pathname.match(/\/(embed|shorts|v)\/([^/?]+)/);
    if (match) return match[2];
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(url) {
  const id = getYouTubeId(url);
  // enablejsapi=1 lets us postMessage pauseVideo when the carousel moves.
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1`
    : null;
}

// YouTube serves several thumbnail variants for any public video.
// Quality presets:
//   "low"  — mqdefault.jpg (320x180, 16:9, always exists)
//   "high" — maxresdefault.jpg (1280x720, 16:9, only when uploaded HD)
// "high" should be paired with a fallback to "low" via <img onError> since
// not every video has a maxresdefault variant.
export function getYouTubeThumbnailUrl(url, quality = "low") {
  const id = getYouTubeId(url);
  if (!id) return null;
  const file = quality === "high" ? "maxresdefault.jpg" : "mqdefault.jpg";
  return `https://i.ytimg.com/vi/${id}/${file}`;
}
