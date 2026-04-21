/**
 * Minimal HTML-escape helper for safe interpolation of user-controlled strings
 * into HTML email templates.
 *
 * Escapes the five characters that allow HTML injection:
 *   &  <  >  "  '
 */
export function escHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
}
