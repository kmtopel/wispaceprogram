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
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

// YouTube serves several thumbnail variants for any public video.
// hqdefault (480x360) is the most reliable — exists for every video.
export function getYouTubeThumbnailUrl(url) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
