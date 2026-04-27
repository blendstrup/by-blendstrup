/**
 * Given a raw YouTube or Vimeo URL entered by the CMS user,
 * returns the corresponding embed src URL, or null if unrecognised.
 *
 * Supported input patterns:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   https://vimeo.com/VIDEO_ID
 *
 * Returns:
 *   https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=VIDEO_ID&controls=0
 *   https://player.vimeo.com/video/VIDEO_ID?autoplay=1&muted=1&loop=1&background=1
 *
 * Security: only YouTube and Vimeo hostnames are allowlisted.
 * Any other URL (including arbitrary domains) returns null — the iframe
 * is never rendered for unrecognised URLs (T-u06-01).
 */
export function toEmbedUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  try {
    const url = new URL(raw.trim())
    // YouTube watch
    if (
      (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") &&
      url.pathname === "/watch"
    ) {
      const id = url.searchParams.get("v")
      if (!id) return null
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0`
    }
    // YouTube short link
    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1)
      if (!id) return null
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0`
    }
    // YouTube Shorts
    if (
      (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") &&
      url.pathname.startsWith("/shorts/")
    ) {
      const id = url.pathname.replace("/shorts/", "")
      if (!id) return null
      return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0`
    }
    // Vimeo
    if (url.hostname === "vimeo.com" || url.hostname === "www.vimeo.com") {
      const id = url.pathname.replace(/\//g, "")
      if (!id) return null
      return `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1`
    }
    return null
  } catch {
    return null
  }
}
